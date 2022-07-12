<template>
  <view class="pages">
    <lk-cell
      title="賬號類型"
      field
      v-if="pageType == 'add' && addType != 'bank'"
    >
      <lk-radio-group v-model="type" :active-color="theme.color">
        <lk-radio
          :name="item.type"
          v-for="(item, index) in columns"
          :key="index"
        >
          {{ item.text }}
        </lk-radio>
      </lk-radio-group>
    </lk-cell>
    <form-account-group
      v-if="type == 3"
      :info="info"
      :loading="isLoading"
      @save="onSave"
    />
    <form-bank-auto-group
      v-if="type == 1"
      :info="info"
      :loading="isLoading"
      @save="onSave"
    />
    <form-bank-manual-group
      v-if="type == 4"
      :info="info"
      :loading="isLoading"
      @save="onSave"
    />
    <formUsdtGroup
      v-if="type == 5"
      :info="info"
      :loading="isLoading"
      @save="onSave"
    />
    <lk-popup-bankcard-sms
      v-model="showBankCardSms"
      type="signing"
      :info="info"
      @success="signingSuccess"
      @close="signingClose"
    />
  </view>
</template>

<script>
import { mapState } from "vuex";
import { SET_ASSETACCOUNT } from "@/common/interface/property";
import formAccountGroup from "./component/form-account-group";
import formBankAutoGroup from "./component/form-bank-auto-group";
import formBankManualGroup from "./component/form-bank-manual-group";
import formUsdtGroup from "./component/form-usdt-group";
export default {
  name: "packages-property-account-post",
  data() {
    return {
      pageType: null,
      addType: "",
      type: "5",
      info: {},
      isLoading: false,
      showBankCardSms: false,
      q1_OrderNo: "", //匯聚簽約
      joinpaycode: false, //匯聚簽約銀行卡，顯示輸入驗證碼框
    };
  },
  watch: {
    type(e) {
      if (this.pageType == "add") {
        this.info = {};
      }
    },
    withdrawConfig() {
      this.changeType();
    },
  },
  computed: {
    ...mapState({
      payConfig: ({ config }) => config.payConfig,
      withdrawConfig: ({ config }) => config.withdraw_conf, //提現配置
    }),
    columns() {
      const withdrawType = this.withdrawConfig.withdraw_message || [];
      let arr = [];
      withdrawType.forEach((e) => {
        if (e == 3) {
          arr.push({
            text: "支付寶",
            type: e,
          });
        }
        if (e == 1 || e == 4) {
          arr.push({
            text: "銀行卡",
            type: this.payConfig.tlPay ? 1 : e, // 開啟通聯支付情況，添加類型都是自動類型
          });
        }
        // if (e == 5) {
        // }
      });

      arr.push({
        text: "USDT",
        // type: this.payConfig.usdt_pay ? 5 : e,
        type: 5,
      });
      return arr;
    },
  },
  onLoad(query) {
    this.info = query.info ? JSON.parse(query.info) : {};
    this.pageType = query.hash;
    this.addType = query.addtype || "";
    this.onbackevent = query.onbackevent || "";
    this.changeType();

    setTimeout(() => {
      this.type = "5";
    }, 1000);
  },
  methods: {
    changeType() {
      const withdrawType = this.withdrawConfig.withdraw_message || [];
      let type = this.info.type || "";
      if (this.pageType == "add") {
        withdrawType.some((e) => {
          if (e == 3 && this.addType != "bank") {
            type = e;
            return true;
          }
          if (e == 1 || e == 4) {
            type = this.payConfig.tlPay ? 1 : e;
            return true;
          }
        });
      } else {
        withdrawType.forEach((e) => {
          if (type == 4 && (e == 1 || this.payConfig.tlPay)) {
            // 如果編輯類型為手動打款，而平臺提現設置開啟自動打款，則type修改為自動打款類型
            // 開啟通聯支付情況，編輯情況都是自動類型,為升級賬號
            type = 1;
          }
        });
      }
      // console.log(type);
      this.type = type;
    },
    //關閉簽約
    signingClose() {
      this.isLoading = false;
    },
    //簽約成功
    signingSuccess() {
      setTimeout(() => {
        this.onBackEvent();
      }, 500);
    },
    // 返回觸發自定義事件
    onBackEvent() {
      if (this.onbackevent) {
        uni.$emit(this.onbackevent, true);
      }
      this.$Navigate.back();
    },
    onSave(info) {
      this.info = info;
      info.type = this.type;
      // return console.log(info);
      this.isLoading = true;
      SET_ASSETACCOUNT(info, { type: this.pageType })
        .then(({ code, data, message }) => {
          if (code == 1) {
            if (data.q1_OrderNo) {
              this.joinpaycode = true;
              this.q1_OrderNo = data.q1_OrderNo;
              this.$Prompt.toast({ title: message, icon: "success" });
            } else if (data.thpinfo) {
              this.info.thpinfo = data.thpinfo;
              this.showBankCardSms = true;
            } else {
              this.$Prompt.toast("獲取短信驗證失敗");
              this.isLoading = false;
            }
          } else {
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              this.onBackEvent();
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
  components: {
    formAccountGroup,
    formBankAutoGroup,
    formBankManualGroup,
    formUsdtGroup,
  },
};
</script>

<style lang="scss" scoped></style>
