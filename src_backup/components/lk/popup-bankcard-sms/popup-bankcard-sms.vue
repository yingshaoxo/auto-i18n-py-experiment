<template>
  <lk-popup
    v-model="value"
    round
    :title="title"
    :mask-close="false"
    closeable
    :before-hide="close"
  >
    <view class="cell-group">
      <lk-field
        label="手機號碼"
        type="number"
        placeholder="请输入您的手機號碼"
        v-model="info.mobile"
        disabled
      />
      <lk-field
        label="驗證碼"
        type="number"
        maxlength="6"
        placeholder="请输入驗證碼"
        v-model="smscode"
      >
        <lk-button
          slot="button"
          size="mini"
          plain
          round
          :color="theme.color"
          type="danger"
          :disabled="isDisabled"
          @click="agentSend"
        >
          {{ codeTxt }}
        </lk-button>
      </lk-field>
      <lk-cell>
        <lk-button
          round
          type="danger"
          :color="theme.gradient"
          block
          :loading="isLoading"
          @click="confirm"
        >
          確定
        </lk-button>
      </lk-cell>
    </view>
  </lk-popup>
</template>

<script>
import { validMobile, validMsgcode } from "@/common/utils/validator";
import focusout from "@/mixins/focusout";
export default {
  data() {
    return {
      smscode: "",
      isLoading: false,

      isDisabled: false,
      codeTime: 0,
      codeTxt: "获取驗證碼"
    };
  },
  mixins: [focusout],
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "銀行卡安全驗證"
    },
    info: Object
  },
  watch: {
    value(e) {
      if (e) {
        this.startTimer();
      }
    }
  },
  methods: {
    close() {
      this.$emit("input", false);
      this.$emit("close");
      this.isLoading = false;
    },
    // 重新獲取
    agentSend() {
      let params = {
        ...this.info
      };
      let method = "";
      if (this.type == "signing") {
        method = "getSigningSms";
      } else if (this.type == "pay") {
        method = "getBankPaySms";
        params = {
          out_trade_no: this.info.out_trade_no,
          thpinfo: this.info.thpinfo
        };
      }
      this.$store.dispatch(method, params).then(() => {
        this.startTimer();
      });
    },
    // 簽約/支付
    confirm() {
      let params = {
        ...this.info
      };
      params.smscode = this.smscode;
      let method = "";
      if (this.type == "signing") {
        method = "signingBankCard";
      } else if (this.type == "pay") {
        method = "payBankCard";
      }
      if (!validMobile(params.mobile)) {
        return false;
      }
      if (!validMsgcode(params.smscode)) {
        return false;
      }
      this.isLoading = true;
      this.$store
        .dispatch(method, params)
        .then(() => {
          this.isLoading = false;
          this.$emit("input", false);
          this.$emit("success");
        })
        .catch(() => {
          this.isLoading = false;
        });
    },

    startTimer() {
      this.codeTime = 60;
      this.isDisabled = true;
      this.codeTimer();
    },
    codeTimer() {
      if (this.codeTime > 0) {
        this.codeTime--;
        this.codeTxt = this.codeTime + "s後獲取";
        setTimeout(this.codeTimer, 1000);
      } else {
        this.endTimer();
      }
    },
    endTimer() {
      this.codeTime = 0;
      this.isDisabled = false;
      this.codeTxt = "重新獲取";
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  max-width: 80vw;
}
</style>
