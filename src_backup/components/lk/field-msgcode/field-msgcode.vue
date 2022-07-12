<template>
  <lk-field
    v-model="code"
    :label="label"
    type="number"
    :maxlength="codeLength"
    :left-icon="leftIcon"
    :class-prefix="iconPrefix"
    :placeholder="placeholder"
  >
    <lk-button
      slot="button"
      size="mini"
      round
      :plain="true"
      type="danger"
      :color="btnColor"
      :disabled="isDisabled"
      :style="{
        opacity: disabled ? 0.5 : 1,
      }"
      @click="
        () => {
          disabled ? null : onSend();
        }
      "
    >
      {{ codeTxt }}
    </lk-button>
  </lk-field>
</template>

<script>
import { validMobile, validEmail } from "@/common/utils/validator";
import { GET_EMAILCODE } from "@/common/interface/login";
import store from "@/store";
export default {
  data() {
    return {
      cname: "field-magcode",
      isDisabled: false,
      codeTime: 0,
      codeTxt: "獲取驗證碼",
    };
  },
  props: {
    value: [String, Number],
    mobile: [String, Number],
    email: [String, Number],
    label: {
      type: String,
      default: "驗證碼",
    },
    placeholder: {
      type: String,
      default: "请输入驗證碼",
    },
    codeLength: {
      type: [String, Number],
      default: 6,
    },
    // 區號
    areacode: {
      type: [String, Number],
      default: 852,
    },
    leftIcon: String,
    iconPrefix: String,
    type: String, //驗證碼类型  注冊/登錄/忘記密碼/綁定手機/修改資料/修改郵箱等
    validType: {
      type: String,
      default: "mobile",
    },
    // 是否驗證
    verify: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnColor() {
      return store.getters.theme ? store.getters.theme.color : "";
    },
    code: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      },
    },
  },
  methods: {
    // 邮箱驗證碼
    getEmailcode(form) {
      return new Promise((resolve, reject) => {
        GET_EMAILCODE(form)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 发送驗證碼
    onSend() {
      if (this.type === "bind_email" && this.validType == "email") {
        this.emailFn();
      } else {
        this.msgFn();
      }
    },
    msgFn() {
      if (this.verify && !validMobile(this.mobile, this.areacode)) {
        return false;
      }
      let params = {
        type: this.type || "",
        mobile: this.mobile,
      };
      if (store.state.config.mobile_type == 1) {
        params.country_code = this.areacode;
      }
      store.dispatch("getMsgcode", params).then((res) => {
        this.$emit("send-success", res);
        this.startTimer();
      });
    },
    emailFn() {
      if (!validEmail(this.email)) {
        return false;
      }
      this.getEmailcode({
        type: this.type || "",
        email: this.email,
      }).then((res) => {
        this.$emit("send-success", res);
        this.startTimer();
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
      this.codeTxt = "獲取驗證碼";
    },
  },
};
</script>
