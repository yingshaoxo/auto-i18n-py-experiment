<template>
  <lk-field
    v-if="display"
    v-model="user_answer"
    :label="label"
    type="number"
    :maxlength="codeLength"
    :left-icon="leftIcon"
    :class-prefix="iconPrefix"
    :placeholder="question"
  >
    <!-- <view>nono</view> -->
    <lk-button
      slot="button"
      size="mini"
      round
      plain
      type="danger"
      :color="btnColor"
      :disabled="isDisabled"
      @click="onSend"
    >
      {{ "確定" }}
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
      placeholder: "",
      question: "",
      answer: "",
      user_answer: "",
    };
  },
  props: {
    display: {
      type: [Boolean],
      default: false,
    },
    value: [String, Number],
    mobile: [String, Number],
    email: [String, Number],
    label: {
      type: String,
      default: "谜题",
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
  },
  computed: {
    btnColor() {
      return store.getters.theme ? store.getters.theme.color : "";
    },
    // code: {
    //   get() {
    //     return this.value;
    //   },
    //   set(e) {
    //     this.$emit("input", e);
    //   },
    // },
  },
  mounted() {
    this.generateNewPuzzle();
  },
  methods: {
    getRandomArbitrary(min, max) {
      return parseInt(Math.random() * (max - min) + min);
    },
    generateNewPuzzle() {
      const aa = this.getRandomArbitrary(0, 20);
      const bb = this.getRandomArbitrary(0, 20);
      this.answer = String(aa + bb);
      this.question = String(`${aa} + ${bb} = ?`);
    },
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
      if (this.answer == this.user_answer) {
        console.log(this.answer, this.user_answer);
        this.$emit("onOK");
      } else {
        this.$Prompt.toast("回答錯誤");
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
