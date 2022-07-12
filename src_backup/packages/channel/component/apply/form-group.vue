<template>
  <view class="apply-condition">
    <form-group :items="formList" ref="formGroup" v-if="isForm" />
    <block v-else>
      <lk-field
        label="真實姓名"
        type="text"
        placeholder="请输入真實姓名"
        v-model="real_name"
      />
      <lk-field
        label="手機號碼"
        :disabled="isDisabled"
        type="number"
        placeholder="请输入手機號碼"
        v-model="user_tel"
      />
      <slot />
    </block>
    <apply-submit-group
      :protocol="protocol"
      :loading="loading"
      @submit="onSubmit"
    />
  </view>
</template>

<script>
import formGroup from "@/components/custom/form-group";
import applySubmitGroup from "./submit-group";
import { isEmpty } from "@/common/utils";
import { validMobile, validUsername } from "@/common/utils/validator";
import { mapState } from "vuex";
export default {
  data() {
    return {
      real_name: this.params.real_name,
      user_tel: this.params.user_tel
    };
  },
  props: {
    formList: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: {
        real_name: "",
        user_tel: ""
      }
    },
    // 申請條件  3 為無條件
    conditionState: [Number, String],
    protocol: [Number, String]
  },
  computed: {
    ...mapState({
      account_type: ({ config }) => config.account_type,
      memberInfo: ({ member }) => member.info
    }),
    isForm() {
      return !isEmpty(this.formList);
    },
    isDisabled() {
      // 賬號體系為3時開放輸入手機號
      this.user_tel = this.memberInfo.user_tel;
      return this.account_type != 3;
    }
  },
  methods: {
    onSubmit() {
      const $this = this;
      const params = {};
      if ($this.conditionState != 3) {
        const form_data = $this.$refs["formGroup"]
          ? $this.$refs["formGroup"].getFormData()
          : "";
        if (!$this.isForm) {
          if (!validUsername($this.real_name, "真實姓名不能为空")) {
            return false;
          }
          params.real_name = $this.real_name;
          params.user_tel = $this.user_tel;
        } else {
          if (!form_data) return false;
          params.post_data = JSON.stringify(form_data);
        }
      }
      $this.$emit("submit", params);
    }
  },
  components: {
    formGroup,
    applySubmitGroup
  }
};
</script>

<style lang="scss" scoped></style>
