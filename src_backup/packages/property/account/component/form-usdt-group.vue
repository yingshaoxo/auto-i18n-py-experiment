<template>
  <view>
    <view>
      <lk-field required label="網關" placeholder="请输入網關" v-model="info.account_number" />
      <lk-field required label="地址" placeholder="請輸入地址" v-model="info.realname" />
    </view>
    <view class="foot-btn-group">
      <lk-button type="danger" :color="theme.gradient" round block @click="save" :loading="loading">
        保存
      </lk-button>
    </view>
  </view>
</template>

<script>
export default {
  data () {
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
    validator () {
      const info = this.info;
      if (!info.account_number) {
        this.$Prompt.toast("请输入網關！");
        return false;
      }
      if (!info.realname) {
        this.$Prompt.toast("請輸入地址！");
        return false;
      }
      return info;
    },
    save () {
      const info = this.validator();
      if (info) {
        this.$emit("save", info);
      }
    }
  }
};
</script>

<style scoped>
</style>
