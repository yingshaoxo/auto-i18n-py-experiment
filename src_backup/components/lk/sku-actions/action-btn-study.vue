<template>
  <action-btn-confirm
    v-if="action"
    :action="action"
    :btn-type="btnType"
    @click="click"
  />
  <view class="sku-action-group" v-else>
    <view class="action-btn">
      <lk-button square type="danger" :color="theme.gradient" @click="study">
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import actionBtnConfirm from "./action-btn-confirm";
export default {
  data() {
    return {};
  },
  props: {
    // 活動相關參數
    params: Object,
    // 商品基本信息
    info: Object,
    action: String,
    buyBtnText: {
      type: String,
      default: "前往學習"
    }
  },
  computed: {
    btnText() {
      return this.buyBtnText;
    },
    btnType() {
      return "danger";
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    study() {
      this.$emit("click", "study", { goods_id: this.info.id });
    }
  },
  components: {
    actionBtnConfirm
  }
};
</script>

<style scoped></style>
