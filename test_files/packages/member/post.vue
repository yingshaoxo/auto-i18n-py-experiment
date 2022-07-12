<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <block v-if="isValid">
      <view>
        <lk-field
          label="手機號碼"
          type="number"
          disabled
          v-model="memberInfo.user_tel"
        />
        <lk-field-local-puzzle
          :display="show_puzzle"
          @onOK="
            () => {
              show_puzzle = false;
            }
          "
        ></lk-field-local-puzzle>
        <lk-field-msgcode
          v-model="verification_code"
          :mobile="memberInfo.user_tel"
          :type="msgcodeType"
          :areacode="areacode"
          :verify="false"
          :disabled="show_puzzle"
        />
      </view>
      <view class="foot-btn-group">
        <lk-button
          round
          block
          type="danger"
          :color="theme.gradient"
          @click="onNext"
        >
          下一步
        </lk-button>
      </view>
    </block>
    <block v-else>
      <update-password
        v-if="updateTypeName === 'password'"
        :page-type="pageType"
        @adopt="isValid = true"
      />
      <update-payment-password
        v-if="updateTypeName === 'paymentPassword'"
        :page-type="pageType"
        @adopt="isValid = true"
      />
      <update-mobile v-if="updateTypeName === 'mobile'" :page-type="pageType" />
      <update-email v-if="updateTypeName === 'email'" :page-type="pageType" />
    </block>
  </view>
</template>

<script>
const pagesObj = {
  1: { title: "修改密碼", name: "password", codeType: "change_password" },
  2: {
    title: "支付密碼",
    name: "paymentPassword",
    codeType: "change_pay_password",
  },
  3: { title: "修改關聯手機", name: "mobile", codeType: "update_mobile" },
  4: { title: "綁定郵箱", name: "email", codeType: "bind_email" },
};
import { validMsgcode } from "@/common/utils/validator";
import { VALID_MSGCODE } from "@/common/interface/member";
import { mapState } from "vuex";
import updatePassword from "./component/post/update-pasword";
import updatePaymentPassword from "./component/post/update-payment-password";
import updateMobile from "./component/post/update-mobile";
import updateEmail from "./component/post/update-email";
export default {
  name: "packages-member-post",
  data() {
    return {
      error_time: 0,
      show_puzzle: false,

      pageStyle: {
        background: "",
        title: "",
      },
      /**
       * pageType 頁面類型
       * 1 ==> 修改登錄密碼
       * 2 ==> 修改支付密碼
       * 3 ==> 修改手機
       * 4 ==> 綁定郵箱
       */
      pageType: null,
      updateTypeName: null,
      msgcodeType: null, // 獲取驗證參數類型

      isValid: true,
      verification_code: "",
    };
  },
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info,
      areacode: ({ member }) => member.info.country_code,
    }),
  },
  onLoad(query) {
    this.pagetype = query.pagetype;
    this.pageStyle.title = pagesObj[this.pagetype].title;
    this.updateTypeName = pagesObj[this.pagetype].name;
    this.msgcodeType = pagesObj[this.pagetype].codeType;
  },
  methods: {
    onNext() {
      const $this = this;
      if (!validMsgcode($this.verification_code)) {
        return false;
      }
      const params = {};
      params.mobile = $this.memberInfo.user_tel;
      params.verification_code = $this.verification_code;
      VALID_MSGCODE(params).then((res) => {
        if (res.code === 0) {
          $this.$Prompt.toast(res.message);
          this.do_something_when_error();
        } else {
          // 短信驗證成功下一步操作;
          $this.$Prompt.toast({ title: "驗證通過", icon: "success" });
          $this.isValid = false;
        }
      });
    },
    do_something_when_error() {
      this.error_time += 1;
      if (this.error_time >= 5) {
        this.show_puzzle = true;
        this.error_time = 0;
      }
    },
  },
  components: {
    updatePassword,
    updatePaymentPassword,
    updateMobile,
    updateEmail,
  },
};
</script>

<style lang="scss" scoped></style>
