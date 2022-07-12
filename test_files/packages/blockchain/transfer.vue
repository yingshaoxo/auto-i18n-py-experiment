<template>
  <view class="pages">
    <transfer-group
      :type="pageType"
      :info="info"
      @params-change="onParamsChange"
      @address-change="onAddressBlur"
    >
      <view v-if="showPoundage">
        <poundage-group
          :type="pageType"
          :info="poundage"
          @change="onSdChange"
        />
      </view>
    </transfer-group>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
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
        @click="onTransfer"
      >
        {{ transferBtnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { yuan, bi } from "@/common/utils";
import mixinPayPassword from "@/mixins/valid-pay-password";
import blockchain from "./mixin";
import transferGroup from "./component/transfer-group";
import poundageGroup from "./component/poundage-group";
import {
  GET_BLOCKCHAINGAS,
  CHECK_BLOCKCHAINETHADDRESS,
  CHECK_BLOCKCHAINEOSACCOUNTNAME,
  TRANSFER_BLOCKCHAIN,
  GET_BLOCKCHAINGWEISIZE
} from "@/common/interface/blockchain";
export default {
  name: "packages-blockchain-transfer",
  data() {
    return {
      info: {
        balance: 0,
        tokey: ""
      },
      params: {
        password: "",
        memo: "",
        fromAddress: "",
        toAddress: "",
        gas: "",
        symbol: "",
        num: ""
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
      addressFlag: false, //收款地址是否正確標識
      notEnough: false
    };
  },
  mixins: [blockchain, mixinPayPassword],
  computed: {
    isDisabled() {
      const type = this.pageType;
      if (!this.addressFlag) {
        return true;
      }
      if (this.notEnough) {
        // gwei 商家餘額不足
        return true;
      }
      if (parseFloat(this.info.balance) <= 0) {
        return true;
      }
      return false;
    },
    transferBtnText() {
      const type = this.pageType;
      let text = "";
      if (parseFloat(this.info.balance) <= 0) {
        text = "可用" + type.toUpperCase() + "不足，無法轉賬！";
      } else {
        text = "轉賬";
      }
      return text;
    },
    feeType() {
      const pageType = this.pageType;
      let type = null;
      type = pageType == "eos" ? 13 : 9;
      return type;
    },
    payMoney() {
      let money = parseFloat(this.params.num || 0);
      return money;
    }
  },
  onLoad(query) {},
  methods: {
    blockchainBaseDataCall(data) {
      this.info = data || {};
      this.params.fromAddress = data.address;
      this.params.symbol = data.symbol;

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
    onSdChange(e) {
      this.params.gas = e;
      this.getGas();
    },
    onParamsChange(param) {
      for (const key in param) {
        this.params[key] = param[key];
      }
    },
    onAddressBlur(e) {
      this.params.toAddress = e;
      if (e) {
        this.checkAddress(e)
          .then(() => {
            this.addressFlag = true;
            this.getGas();
          })
          .catch(() => {
            this.addressFlag = false;
            this.initPoundage();
          });
      } else {
        this.addressFlag = false;
        this.initPoundage();
      }
    },
    // 初始化手續費
    initPoundage(e) {
      this.poundage.loadingInitText = e ? "" : "輸入收款地址後方可獲取手續費";
      this.poundage.loadingFlag = false;
      this.notEnough = false;
    },
    // 獲取gas費用
    getGas() {
      // 公鍊為eth
      if (this.info.publicLink == "ETH") {
        const address = this.params.toAddress;
        this.initPoundage(address);
        if (address) {
          GET_BLOCKCHAINGAS({
            gas: this.params.gas,
            type: 4,
            symbol: this.info.symbol,
            toAddress: address
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
            .catch(error => {
              this.poundage.loadingInitText = error.message || "格式錯誤";
            });
        }
      }
    },
    // 驗證收款地址
    checkAddress(address) {
      return new Promise((resolve, reject) => {
        CHECK_BLOCKCHAINETHADDRESS({
          address: address,
          symbol: this.info.symbol
        })
          .then(({ code, message }) => {
            if (code == 2) {
              resolve();
            } else {
              this.$Prompt.toast(message);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 驗證密碼
    onPayPassword(password) {
      this.params.password = password;
      this.onTransfer();
    },
    onTransfer() {
      const type = this.pageType;
      const params = this.validator(type);
      // return console.log(params);
      if (params) {
        this.isLoading = true;
        this.validPayPassword(params.password, true)
          .then(() => {
            TRANSFER_BLOCKCHAIN(params)
              .then(({ message }) => {
                this.$Prompt.toast({ title: message, icon: "success" });
                this.$Navigate.replace({
                  path: "/packages/blockchain/index",
                  query: { type }
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
      if (!this.addressFlag) return;
      const params = this.params;
      const balance = parseFloat(this.info.balance);
      if (balance <= 0) {
        this.$Prompt.toast("可用" + type.toUpperCase() + "不足！");
        return false;
      }
      if (!params.toAddress) {
        this.$Prompt.toast("請輸入收款人錢包地址！");
        return false;
      }
      if (!params.num) {
        this.$Prompt.toast("请输入轉賬" + type.toUpperCase() + "！");
        return false;
      }
      if (parseFloat(params.num) <= 0) {
        this.$Prompt.toast("轉賬" + type.toUpperCase() + "不可小於0！");
        return false;
      }
      if (parseFloat(params.num) > balance) {
        this.$Prompt.toast(
          "轉賬" +
            type.toUpperCase() +
            "不可大於可用" +
            type.toUpperCase() +
            "！"
        );
        return false;
      }
      params.num = bi(params.num, type == "eos" ? 4 : 6);
      return params;
    }
  },
  components: {
    transferGroup,
    poundageGroup
  }
};
</script>

<style lang="scss" scoped></style>
