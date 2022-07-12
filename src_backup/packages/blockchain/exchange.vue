<template>
  <view class="pages">
    <exchange-group
      :type="pageType"
      :info="info"
      :params="params"
      @ex-change="onExChange"
      @count-change="onCountChange"
      @params-change="onParamsChange"
      @charge-change="onChargeChange"
    >
      <view v-if="showPoundage">
        <poundage-group
          :type="pageType"
          :info="poundage"
          @change="onSdChange"
        />
      </view>
    </exchange-group>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      :money-title="chargeInfo.title"
      :money-text="chargeInfo.money"
      :charge-cpu="chargeInfo.cpu"
      :charge-net="chargeInfo.net"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
    <view class="foot-btn-group">
      <lk-button
        round
        theme-color
        block
        :disabled="isDisabled"
        :loading="isLoading"
        @click="onExchange"
      >
        {{ exchangeBtnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { yuan, bi } from "@/common/utils";
import mixinPayPassword from "@/mixins/valid-pay-password";
import blockchain from "./mixin";
import exchangeGroup from "./component/exchange-group";
import {
  GET_BLOCKCHAINGAS,
  EXCHANGE_BLOCKCHAIN,
  GET_BLOCKCHAINGWEISIZE
} from "@/common/interface/blockchain";
import poundageGroup from "./component/poundage-group";
export default {
  name: "packages-blockchain-exchange",
  data() {
    return {
      info: {
        lowPoint: 0, // 最低兌換積分
        balance: 0
      },
      exchangeFlag: false, // 是否開啟兌換
      params: {
        exchange_type: 1,
        password: "",
        gas: "",
        num: "",
        address: "",
        symbol: "",
        password: ""
      },
      showPoundage: false,
      poundage: {
        gMin: 0,
        gMax: 0,
        gasFee: 0,
        gasPrice: 0,
        unit: "",
        loadingInitText: "",
        loadingFlag: false
      },
      isLoading: false,
      notEnough: false,
      countErr: false, // 費用計算出錯
      chargeInfo: {
        money: "",
        title: "",
        cpu: "",
        net: ""
      }
    };
  },
  mixins: [blockchain, mixinPayPassword],
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info,
      memberTexts: ({ member }) => member.texts
    }),
    isDisabled() {
      const type = this.pageType;
      if (!this.exchangeFlag) {
        return true;
      }
      if (this.countErr) {
        // 費用計算出錯
        return true;
      }
      if (this.notEnough) {
        // gwei 商家餘額不足
        return true;
      }
      if (
        this.params.exchange_type == 1 &&
        (this.memberInfo.point <= 0 ||
          this.memberInfo.point < this.info.lowPoint)
      ) {
        return true;
      }
      if (
        (this.params.exchange_type == 2 || this.params.exchange_type == 3) &&
        parseFloat(this.info.balance) <= 0
      ) {
        return true;
      }
      return false;
    },
    exchangeBtnText() {
      const type = this.pageType;
      let text = "";
      if (!this.exchangeFlag) {
        text =
          "未開啟" +
          this.memberTexts.point_style +
          "與" +
          type.toUpperCase() +
          "互換";
      } else if (
        this.params.exchange_type == 1 &&
        (this.memberInfo.point <= 0 ||
          this.memberInfo.point < this.info.lowPoint)
      ) {
        text = "可用" + this.memberTexts.point_style + "不足，無法兌換！";
      } else if (
        (this.params.exchange_type == 2 || this.params.exchange_type == 3) &&
        parseFloat(this.info.balance) <= 0
      ) {
        text = "可用" + type.toUpperCase() + "不足，無法兌換！";
      } else {
        text = "兌換";
      }
      return text;
    },
    feeType() {
      const pageType = this.pageType;
      let type = null;
      if (pageType == "eos") {
        type = this.params.exchange_type == 1 ? 15 : 14;
      }
      return type;
    },
    payMoney() {
      const pageType = this.pageType;
      let money = null;
      money = this.params.num;
      return money;
    }
  },
  onLoad(query) {},
  methods: {
    ...mapActions(["getBlockchainSet"]),
    blockchainBaseDataCall(data) {
      this.info = data || {};
      this.params.address = data.address;
      this.params.symbol = data.symbol;
      this.getBlockchainSet().then(set => {
        if (this.pageType == "eos") {
          this.exchangeFlag = set.eos_point == 1;
          this.info.lowPoint = set.eos_point_low;
        } else {
          this.exchangeFlag = set.eth_point == 1;
          this.info.lowPoint = set.eth_point_low;
        }
      });
      // 公鍊為eth
      if (this.info.publicLink == "ETH") {
        GET_BLOCKCHAINGWEISIZE()
          .then(({ data }) => {
            this.showPoundage = true;
            this.poundage.gMin = data.low;
            this.poundage.gMax = data.high;
            this.params.gas = data.low || 1;
            this.getGas();
          })
          .catch(() => {});
      }
    },
    onExChange(e) {
      this.params.num = "";
      this.params.exchange_type = e;
      this.getGas();
    },
    onSdChange(e) {
      this.params.gas = e;
      this.getGas();
    },
    onParamsChange(e) {
      this.params.num = e.num;
    },
    onCountChange(e) {
      this.countErr = e != 2;
    },
    // 獲取gas費用
    getGas() {
      // 公鍊為eth
      if (this.info.publicLink == "ETH") {
        this.initPoundage();
        GET_BLOCKCHAINGAS({
          gas: this.params.gas,
          type: this.params.exchange_type,
          symbol: this.info.symbol
        })
          .then(({ code, data, msg }) => {
            if (code == 200) {
              this.poundage.gasFee = data.gasFee || 0;
              this.poundage.gasPrice = data.gasPrice || 0;
              this.poundage.unit = data.unit;
              this.poundage.loadingFlag = true;
            } else {
              this.poundage.loadingInitText = msg || "格式錯誤";
              if (code == 12008) {
                this.notEnough = true;
                this.$Prompt.toast(msg);
              }
            }
          })
          .catch(() => {
            this.initPoundage();
          });
      }
    },
    // 初始化手續費
    initPoundage() {
      this.poundage.loadingInitText = "";
      this.poundage.loadingFlag = false;
      this.notEnough = false;
    },
    // 手續費，cou，net等
    onChargeChange(info) {
      // this.chargeInfo.title = info.title;
      this.chargeInfo.cpu = info.cpu;
      this.chargeInfo.net = info.net;
    },
    // 驗證密碼
    onPayPassword(password) {
      this.params.password = password;
      this.onExchange();
    },
    // 确定兌換
    onExchange() {
      const type = this.pageType;
      const params = this.validator(type);
      // return console.log(params);
      if (params) {
        this.isLoading = true;
        this.validPayPassword(params.password, true)
          .then(() => {
            EXCHANGE_BLOCKCHAIN(params)
              .then(({ message }) => {
                this.$Prompt
                  .toast({ title: message, icon: "success" })
                  .then(() => {
                    this.$Navigate
                      .replace({
                        path: "/packages/blockchain/index",
                        query: { type }
                      })
                      .then(() => {
                        this.isLoading = false;
                      });
                  });
              })
              .catch(() => {
                this.isLoading = false;
              });
          })
          .catch(() => {
            this.isLoading = false;
            this.params.password = "";
          });
      }
    },
    /**
     * 驗證
     * type  ==> eth/eos
     */
    validator(type) {
      const params = this.params;
      const point = parseInt(this.memberInfo.point);
      const balance = parseFloat(this.info.balance);
      if (params.exchange_type == 1) {
        if (!point) {
          this.$Prompt.toast("可用" + this.memberTexts.point_style + "不足！");
          return false;
        }
        if (parseInt(params.num) < 1) {
          this.$Prompt.toast(
            "兌換" + this.memberTexts.point_style + "不可小於1！"
          );
          return false;
        }
        if (!parseInt(params.num)) {
          this.$Prompt.toast(
            "请输入兌換" + this.memberTexts.point_style + "！"
          );
          return false;
        }
        if (parseInt(params.num) < this.info.lowPoint) {
          this.$Prompt.toast(
            "兌換" +
              this.memberTexts.point_style +
              "不可小於最低兌換" +
              this.memberTexts.point_style +
              "！"
          );
          return false;
        }
        if (parseInt(params.num) > point) {
          this.$Prompt.toast(
            "兌換" +
              this.memberTexts.point_style +
              "不可大於可用" +
              this.memberTexts.point_style +
              "！"
          );
          return false;
        }
      }
      if (params.exchange_type == 2) {
        if (balance <= 0) {
          this.$Prompt.toast("可用" + type.toUpperCase() + "不足！");
          return false;
        }
        if (!params.num) {
          this.$Prompt.toast("请输入兌換" + type.toUpperCase() + "！");
          return false;
        }
        if (parseFloat(params.num) <= 0) {
          this.$Prompt.toast("兌換" + type.toUpperCase() + "不可小於0！");
          return false;
        }
        if (parseFloat(params.num) > balance) {
          this.$Prompt.toast(
            "兌換" +
              type.toUpperCase() +
              "不可大於可用" +
              type.toUpperCase() +
              "！"
          );
          return false;
        }
        params.num = bi(params.num, type == "eos" ? 4 : 6);
      }
      return params;
    }
  },
  components: {
    exchangeGroup,
    poundageGroup
  }
};
</script>

<style lang="scss" scoped></style>
