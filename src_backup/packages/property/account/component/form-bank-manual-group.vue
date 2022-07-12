<template>
  <view>
    <view>
      <lk-field
        required
        label="銀行卡"
        placeholder="請輸入銀行名稱"
        v-model="info.bank_name"
      />
      <lk-field
        required
        label="銀行卡号"
        text="number"
        placeholder="请输入銀行卡号"
        v-model="info.account_number"
      />
      <lk-field
        required
        label="持卡人"
        placeholder="請輸入持卡人姓名"
        v-model="info.realname"
      />
    </view>
    <view class="foot-btn-group">
      <lk-button
        type="danger"
        :color="theme.gradient"
        round
        block
        @click="save"
        :loading="loading"
      >
        保存
      </lk-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    info: Object,
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 驗證
    validator() {
      const info = this.info;
      if (!info.bank_name) {
        this.$Prompt.toast("請輸入銀行名稱！");
        return false;
      }
      if (!info.account_number) {
        this.$Prompt.toast("请输入銀行卡号！");
        return false;
      }
      if (!info.realname) {
        this.$Prompt.toast("請輸入真實姓名！");
        return false;
      }
      return info;
    },
    save() {
      const info = this.validator();
      if (info) {
        this.$emit("save", info);
      }
    }
  }
};
</script>

<style scoped></style>
