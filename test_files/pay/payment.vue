<template>
  <view class="pages">
    <view class="payment-info">
      <view class="title">應付金額</view>
      <view class="money-text" :class="moneyClass">{{ payMoneyText }}</view>
      <view class="limit-time" v-if="pageType != 'integral'">
        <view>請在</view>
        <lk-count-down :time="endTime" @finish="onTimeEnd" />
        <view>內完成支付</view>
      </view>
    </view>
    <view>
      <lk-pay-action-group v-model="payType" @change="onPayTypeChange" :balance="balance" :bpay="isShowBPay"
        :wpay="isShowWPay" :apay="isShowAPay" :tlpay="isShowTlPay" :ppay="isShowPPay" :offline="isOffline"
        :bcpay="isBcpay" @select-bankcard="onSelectBankCard" @pay_voucher_src="onPay_voucher"
        @select-coin="onSelectCoin" />
    </view>
    <lk-modal-pay-password ref="modalPayPassword" v-model="isShowModalPayPassword" :type="feeType" :money="payMoney"
      :money-title="chargeInfo.title" :money-text="chargeInfo.money" :charge="chargeInfo.charge"
      :charge-cpu="chargeInfo.cpu" :charge-net="chargeInfo.net" @confirm="onPayPassword" @cancel="isLoading = false" />
    <lk-popup-bankcard-sms v-model="showBankCardSms" :info="bankCardParams" type="pay" @success="bankCardPaySuccess"
      @close="bankCardPayClose" />
    <view class="foot-btn-group fixed">
      <view v-if="node_id">
        <lk-wx-open-subscribe :node_id="node_id" @success="success">
          <view slot="btn-subscribe">
            <lk-button block round type="danger" theme-color :disabled="disabledPay" :loading="isLoading"
              @click="onPay">
              確認付款 ({{ payMoneyText }})
            </lk-button>
          </view>
        </lk-wx-open-subscribe>
      </view>
      <view v-else>
        <lk-button block round type="danger" theme-color :disabled="disabledPay" :loading="isLoading" @click="onPay">
          確認付款 ({{ payMoneyText }})
        </lk-button>
      </view>
    </view>
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
import {
  GET_PAYINFO,
  PAY_BALANCE,
  PAY_ALIPAY,
  PAY_BLOCKCHAIN,
  APPLY_BANKCARDSMS,
  PAY_BANKCARD,
  PAY_PROCEEDS,
  PAY_OFFLINE
} from "@/common/interface/pay";
import { GET_ORDERPAYINFO } from "@/common/interface/order";
import { GET_CHANNELORDERPAYINFO } from "@/common/interface/channel";
import { GET_AGENTORDERPAYINFO } from "@/common/interface/agent";
import { GET_INTEGRALPAYINFO } from "@/common/interface/integral";
import { OFFLINERECHARGEPAY } from "@/common/interface/smallshop";
import {
  TRAN_BLOCKCHAINPAYMONEY,
  PAY_BLOCKCHAINCOIN
} from "@/common/interface/blockchain";
import { Base64 } from "@/common/lib/base64";
import { mapState, mapGetters, mapActions } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import PAY from "./pay";

export default {
  name: "pay-payment",
  data () {
    return {
      /**
       * 頁面類型
       * buy        =>  普通購買支付
       * order      =>  訂單付款支付
       * recharge   =>  充值支付
       * channel    =>  渠道商采購支付
       * agent      =>  代理渠道商采購支付
       * integral   =>  積分商城支付
       */
      pageType: "buy",
      pay_voucher: "",
      endTime: "",
      pay_money: 0,
      balance: 0,

      payType: null,
      isLoading: false,
      ethpay: {
        show: false,
        balance: 0,
        money: 0,
        paymoney: 0,
        loadingText: null
      },
      eospay: {
        show: false,
        balance: 0,
        money: 0,
        paymoney: 0,
        loadingText: null
      },

      bankCardParams: {},
      showBankCardSms: false,

      chargeServiceMoney: 0,
      is_proceeds_pay: false, //是否貨款支付

      coinInfo: null, //選中幣種信息
      chargeInfo: {
        // 支付彈窗顯示手續費相關
        title: "",
        money: "",
        charge: "",
        title: "",
        cpu: "",
        net: ""
      },
      node_id: "" //訂閱消息類型
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons,
      payConfig: ({ config }) => config.payConfig,
      memberTexts: ({ member }) => member.texts
    }),
    ...mapGetters(["orderFrom"]),
    // 支付密碼彈窗手續費類型
    feeType () {
      let type = null;
      if (this.payType == "bpay") {
        type = 1;
      }
      return type;
    },
    // 支付密碼彈窗顯示支付金額
    payMoney () {
      let money = parseFloat(this.pay_money);
      // if (this.payType == "ethpay" || this.payType == "eospay") {
      //   this.chargeServiceMoney = parseFloat(this.pay_money);
      //   money = this[this.payType].paymoney;
      // }
      return money;
    },
    // 是否顯示餘額支付
    isShowBPay () {
      return this.pageType != "recharge" && !this.is_proceeds_pay;
    },
    // 是否顯示微信支付
    isShowWPay () {
      return !this.is_proceeds_pay;
    },
    // 是否顯示支付寶支付
    isShowAPay () {
      return !this.is_proceeds_pay;
    },
    // 是否顯示銀行卡支付
    isShowTlPay () {
      return this.pageType != "integral" && !this.is_proceeds_pay;
    },
    // 是否顯示貨款支付
    isShowPPay () {
      return !!this.is_proceeds_pay;
    },
    // 是否顯示線下支付
    isOffline () {
      return this.pageType == "recharge";
    },
    // 是否顯示區塊鍊幣種支付
    isBcpay () {
      //return this.pageType == "buy" || this.pageType == "order";
      return this.pageType == 'recharge'
    },
    disabledPay () {
      return !this.payType;
    },
    moneyClass () {
      return this.payType == "bcpay" && this.coinInfo ? "" : "first-letter";
    },
    payMoneyText () {
      let text = yuan(this.pay_money);
      if (this.payType == "bcpay" && this.coinInfo) {
        text = `${this.coinInfo.pay_money} ${this.coinInfo.symbol}`;
      }
      return text;
    }
  },
  onLoad (query) {
    if (query.node_id) {
      this.node_id = query.node_id;
    }
    this.pageType = query.hash || "buy";
    this.out_trade_no = query.out_trade_no || null; // 支付單號
    this.order_id = query.order_id || null; // 訂單id
    typeof this[this.pageType + "PayInfo"] === "function" &&
      this[this.pageType + "PayInfo"](query);
  },
  methods: {
    ...mapActions(["setSubscribe"]),

    success () {
      this.onPay();
    },
    // 獲取支付信息
    getPayInfo (res) {
      if (res.data && res.data.node_id) {
        this.node_id = res.data.node_id; //訂閱消息類型
      }

      if (res.data && res.data.out_trade_no) {
        this.out_trade_no = res.data.out_trade_no;
      }
      if (res.code === 1) {
        this.endTime = parseFloat(res.data.end_time) * 1000;
        this.pay_money = res.data.pay_money;
        this.balance = parseFloat(res.data.balance);
        this.is_proceeds_pay = !!res.data.is_proceeds;
      } else if (res.code == 2) {
        this.$Prompt.toast(res.message).then(() => {
          this.$Navigate.replace({
            path: "/packages/pay/result",
            query: {
              out_trade_no: this.out_trade_no
            }
          });
        });
      } else {
        this.$Prompt.toast(res.message).then(() => {
          setTimeout(() => {
            this.$Navigate.back();
          }, 500);
        });
      }
    },
    // 获取普通購買支付信息
    buyPayInfo (query) {
      GET_PAYINFO({ out_trade_no: this.out_trade_no })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 獲取充值支付信息
    rechargePayInfo (query) {
      GET_PAYINFO({ out_trade_no: this.out_trade_no })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 获取訂單支付信息
    orderPayInfo (query) {
      GET_ORDERPAYINFO({ order_id: this.order_id })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 获取渠道商采购訂單支付信息
    channelPayInfo (query) {
      if (this.order_id) {
        GET_CHANNELORDERPAYINFO({ order_id: this.order_id })
          .then(res => {
            this.getPayInfo(res);
          })
          .catch(error => {
            // this.$Navigate.back();
          });
      } else {
        GET_PAYINFO({ out_trade_no: this.out_trade_no })
          .then(res => {
            this.getPayInfo(res);
          })
          .catch(error => {
            // this.$Navigate.back();
          });
      }
    },
    // 获取代理渠道商采购訂單支付信息
    agentPayInfo (query) {
      GET_AGENTORDERPAYINFO({ order_id: this.order_id })
        .then(res => {
          this.getPayInfo(res);
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 获取積分商城訂單支付信息
    integralPayInfo (query) {
      this.integral_data = JSON.parse(Base64.decode(query.integral_data));
      this.pay_money = query.pay_money;
      GET_INTEGRALPAYINFO()
        .then(res => {
          this.balance = parseFloat(res.data.balance);
          this.point = res.data.point;
        })
        .catch(error => {
          // this.$Navigate.back();
        });
    },
    // 切換支付方式
    onPayTypeChange (e) {
      if (e == "bpay" && this.bpayPassword) {
        this.bpayPassword = null;
      }
      this.coinInfo = "";
      // 清除幣種手續費金額
      this.chargeInfo.title = "";
      this.chargeInfo.money = "";
      this.chargeInfo.charge = "";
      this.chargeInfo.cpu = "";
      this.chargeInfo.net = "";
      this.pay_voucher = "";
      this.isLoading = false;
    },
    // 獲取虛擬幣相關支付信息
    getBlockchainPayInfo () {
      if (
        this.addons.blockchain &&
        !this.is_proceeds_pay &&
        this.pageType != "integral" &&
        (this.payConfig.ethPay || this.payConfig.eosPay)
      ) {
        this.ethpay.show = !!this.payConfig.ethPay;
        this.eospay.show = !!this.payConfig.eosPay;
        this.ethpay.loadingText = "ETH餘額加載中...";
        this.eospay.loadingText = "EOS餘額加載中...";
        this.$store
          .dispatch("getBlockchainPayInfo", this.out_trade_no)
          .then(data => {
            this.ethpay.loadingText = null;
            this.ethpay.balance = data.eth_balance;
            this.ethpay.money = data.eth_money;
            this.ethpay.paymoney = data.eth_paymoney;
            this.ethpay.name = "ETH";

            this.eospay.loadingText = null;
            this.eospay.balance = data.eos_balance;
            this.eospay.money = data.eos_money;
            this.eospay.paymoney = data.eos_paymoney;
            this.eospay.name = "EOS";
          });
      }
    },
    // 支付倒計時結束
    onTimeEnd () {
      this.$Prompt.toast("支付有效時間已過！").then(() => {
        this.$Navigate.back();
      });
    },
    // 支付密碼
    onPayPassword (password) {
      this.bpayPassword = password;
      this.onPay();
    },
    // 進行支付
    onPay () {
      console.log(this.payType)
      typeof this[this.payType + "Fn"] === "function" &&
        this[this.payType + "Fn"]();
    },
    onPay_voucher (e) {
      this.pay_voucher = e;
    },
    // usdt pay
    usdt_payFn () {
      this.offline_pay1Fn()
    },
    // 餘額支付
    bpayFn () {
      if (this.balance < parseFloat(this.pay_money)) {
        this.$Prompt.toast(
          this.memberTexts.balance_style + "不足，請選擇其他支付方式！"
        );
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            pay_money: this.pay_money,
            type: this.orderFrom
          };
          if (this.pageType == "integral") {
            // 積分商城 餘額支付
            this.integral_data.pay_type = 5;
            params = {
              order_data: this.integral_data,
              password: this.bpayPassword,
              type: this.orderFrom
            };
          }
          PAY_BALANCE(params, { isIntegral: this.pageType == "integral" })
            .then(res => {
              // 發送訂閱消息
              this.setSubscribe({ node_id: this.node_id }).then(() => {
                const out_trade_no =
                  params.out_trade_no || res.data.out_trade_no;
                if (res.code == 0) {
                  this.$Navigate.replace({
                    path: "/packages/pay/result",
                    query: {
                      out_trade_no
                    }
                  });
                } else {
                  this.$Prompt.toast(res.message);
                  this.isLoading = false;
                  this.bpayPassword = null;
                }
              });
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    // 銀行卡支付
    tlpayFn () {
      if (!this.bankCardInfo) {
        this.$Prompt.toast("請選擇銀行卡！");
        return false;
      }
      this.bankCardParams.out_trade_no = this.out_trade_no;
      this.bankCardParams.id = this.bankCardInfo.id;
      this.bankCardParams.mobile = this.bankCardInfo.mobile;
      this.isLoading = true;
      APPLY_BANKCARDSMS(this.bankCardParams)
        .then(({ code, data, message }) => {
          if (code == 1) {
            if (data.thpinfo) {
              this.bankCardParams.thpinfo = data.thpinfo;
              this.showBankCardSms = true;
            } else {
              this.$Prompt.toast(message);
              this.isLoading = true;
            }
          } else {
            this.$Prompt.toast(message).then(() => {
              setTimeout(() => {
                this.$Navigate.replace("/pages/order/list");
              }, 500);
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 銀行卡支付成功
    bankCardPaySuccess () {
      this.$Navigate.replace({
        path: "/packages/pay/result",
        query: {
          out_trade_no: this.out_trade_no
        }
      });
    },
    // 銀行卡支付关闭
    bankCardPayClose () {
      this.bankCardParams = {};
      this.isLoading = false;
    },
    // 選擇銀行卡
    onSelectBankCard (info) {
      //銀行卡信息
      this.bankCardInfo = info;
    },
    // 選中幣種
    onSelectCoin (info) {
      //幣種信息
      // console.log(info);
      let param = {
        out_trade_no: this.out_trade_no,
        symbol: info.symbol
      };
      if (info.gas) {
        param.gas = info.gas;
      }
      TRAN_BLOCKCHAINPAYMONEY(param, { isShowLoading: true })
        .then(({ data }) => {
          this.coinInfo = "";
          info.pay_money = data.pay_money || 0;
          this.chargeInfo.title = `${info.symbol}支付`;
          this.chargeInfo.money = `${info.pay_money} ${info.symbol}`;
          if (info.symbol == "EOS") {
            this.chargeInfo.cpu = `${data.cpucharge || 0}ms`;
            this.chargeInfo.net = `${data.netcharge || 0}kb`;
            this.chargeInfo.charge = "";
          } else {
            this.chargeInfo.charge = `${data.getGasPrice} ${data.unit}`;
            this.chargeInfo.cpu = "";
            this.chargeInfo.net = "";
          }
          this.coinInfo = info;
        })
        .catch(() => {
          this.coinInfo = "";
          if (info.gas) {
            this.chargeInfo.charge = "";
          }
          if (info.symbol == "EOS") {
            this.chargeInfo.cpu = "";
            this.chargeInfo.net = "";
          }
        });
    },
    // 微信支付
    wechatFn () {
      let params = {
        out_trade_no: this.out_trade_no
      };
      if (this.pageType == "integral") {
        // 積分商城 微信支付
        this.integral_data.pay_type = 1;
        params = {
          order_data: this.integral_data
        };
      }
      this.isLoading = true;
      PAY.WXPAY(params, { isIntegral: this.pageType == "integral" })
        .then(({ type, out_trade_no }) => {
          if (type == "wechat") {
            // 發送訂閱消息
            this.setSubscribe({ node_id: this.node_id }).then(() => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no
                }
              });
            });
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 支付寶支付
    alipayFn () {
      let params = {
        out_trade_no: this.out_trade_no
      };
      if (this.pageType == "integral") {
        // 積分商城 支付寶支付
        this.integral_data.pay_type = 2;
        params = {
          order_data: this.integral_data
        };
      }
      this.isLoading = true;
      PAY.ALIPAY(params, { isIntegral: this.pageType == "integral" })
        .then(({ type, out_trade_no }) => {
          if (type == "alipay") {
            this.$Navigate.replace({
              path: "/packages/pay/result",
              query: {
                out_trade_no
              }
            });
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 貨款支付
    ppayFn () {
      if (this.balance < parseFloat(this.pay_money)) {
        this.$Prompt.toast(
          this.memberTexts.balance_style + "不足，請選擇其他支付方式！"
        );
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            pay_money: this.pay_money,
            type: this.orderFrom
          };
          if (this.pageType == "integral") {
            // 積分商城 貨款支付
            this.integral_data.pay_type = 4;
            params = {
              order_data: this.integral_data,
              password: this.bpayPassword
            };
          }
          PAY_PROCEEDS(params, { isIntegral: this.pageType == "integral" })
            .then(res => {
              const out_trade_no = params.out_trade_no || res.data.out_trade_no;
              if (res.code == 0) {
                // 發送訂閱消息
                this.setSubscribe({ node_id: this.node_id }).then(() => {
                  this.$Navigate.replace({
                    path: "/packages/pay/result",
                    query: {
                      out_trade_no
                    }
                  });
                });
              } else {
                this.$Prompt.toast(res.message);
                this.isLoading = false;
                this.bpayPassword = null;
              }
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    // 線下支付
    offline_payFn () {
      if (this.pay_voucher == "") {
        this.$Prompt.toast("請上傳支付憑證");
        return false;
      }
      let out_trade_no = this.out_trade_no;
      let params = {
        out_trade_no,
        pay_voucher: this.pay_voucher
      };
      if (this.rechargeType) {
        params.type = this.rechargeType - 4;
      }
      PAY_OFFLINE(params)
        .then(res => {
          if (res.code == 0) {
            this.$Navigate.replace({
              path: "/packages/pay/result",
              query: {
                out_trade_no
              }
            });
          } else {
            this.$Prompt.toast(res.message);
            this.isLoading = false;
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    offline_pay1Fn () {
      if (this.pay_voucher == "") {
        this.$Prompt.toast("請上傳支付憑證");
        return false;
      }
      let out_trade_no = this.out_trade_no;
      let params = {
        out_trade_no,
        pay_voucher: this.pay_voucher,
        pay_type: this.payType
      };
      OFFLINERECHARGEPAY(params)
        .then(res => {
          if (res.code == 0) {
            this.$Navigate.replace({
              path: "/packages/pay/result",
              query: {
                out_trade_no
              }
            });
          } else {
            this.$Prompt.toast(res.message);
            this.isLoading = false;
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    offline_pay2Fn () {
      this.offline_pay1Fn()
    },
    offline_pay3Fn () {
      this.offline_pay1Fn()
    },
    // 數字資產錢包相關支付
    onBlockchainPay () {
      const payType = this.payType;
      const type = payType == "ethpay" ? "eth" : "eos";
      const balance = parseFloat(this[payType].balance);
      const pay_money = parseFloat(this[payType].paymoney);
      if (balance < pay_money) {
        this.$Prompt.toast(type + "餘額不足，請選擇其他支付方式！");
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword, true)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            password: this.bpayPassword
          };
          PAY_BLOCKCHAIN(params, { type })
            .then(res => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no,
                  blockchain_order: 1
                }
              });
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    },
    // globe pay跨境支付
    gpayFn () {
      let params = {
        out_trade_no: this.out_trade_no,
        type: this.orderFrom
      };
      this.isLoading = true;
      PAY.GLOBEPAY(params)
        .then(({ type, out_trade_no }) => {
          if (type == "wechat") {
            // 發送訂閱消息
            this.setSubscribe({ node_id: this.node_id }).then(() => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no
                }
              });
            });
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    // 幣種支付
    bcpayFn () {
      // console.log(this.coinInfo);
      if (!this.coinInfo) {
        this.$Prompt.toast("請選擇幣種！");
        return false;
      }
      const balance = parseFloat(this.coinInfo.balance);
      const pay_money = parseFloat(this.coinInfo.pay_money);
      if (balance < pay_money) {
        this.$Prompt.toast(
          this.coinInfo.symbol + "餘額不足，請選擇其他支付方式！"
        );
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.bpayPassword, true)
        .then(() => {
          let params = {
            out_trade_no: this.out_trade_no,
            gas: this.coinInfo.gas,
            symbol: this.coinInfo.symbol,
            password: this.bpayPassword
          };
          PAY_BLOCKCHAINCOIN(params)
            .then(res => {
              this.$Navigate.replace({
                path: "/packages/pay/result",
                query: {
                  out_trade_no: this.out_trade_no,
                  blockchain_order: 1
                }
              });
            })
            .catch(() => {
              this.isLoading = false;
              this.bpayPassword = null;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.bpayPassword = null;
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 160rpx;
}

.payment-info {
  line-height: 1.6;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;

  .title {
    font-size: $font-size-lg;
  }

  .money-text {
    font-size: 40rpx;
    font-weight: 700;
    color: $red;
    margin-top: 12rpx;
  }

  .limit-time {
    color: $text-light;
    font-size: $font-size-sm;
    display: flex;
    flex-flow: row;
  }

  .charge-text {
    margin-bottom: 10rpx;
    line-height: 28rpx;
    color: $text-light;
    font-size: $font-size-sm;
  }
}

.foot-btn-group {
  z-index: 10;
}
</style>
