<template>
  <action-btn-confirm
    v-if="action"
    :action="action"
    :btn-type="btnType"
    @click="click"
  />
  <view class="sku-action-group" v-else>
    <view class="action-btn" v-if="showCart">
      <lk-button square type="warning" :color="theme.cart" @click="addCart">
        {{ cartBtnText }}
      </lk-button>
    </view>
    <view class="action-btn">
      <lk-button square type="danger" :color="theme.gradient" @click="buy">
        {{ buyBtnText }}
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
    action: String
  },
  computed: {
    btnType() {
      return this.action == "addCart" ? "warning" : "danger";
    },
    showCart() {
      return !(
        this.info.goodsType == 0 ||
        this.info.goodsType == 3 ||
        this.info.goodsType == 4 ||
        this.info.goodsType == 10 ||
        this.info.goodsType == 5 ||
        this.info.goodsType == 6
      );
    },
    cartBtnText() {
      let text = "加入購物車";
      if (this.info.cartBtnText) {
        text = this.info.cartBtnText;
      }
      return text;
    },
    buyBtnText() {
      let text = "立即購買";
      if (this.info.buyBtnText) {
        text = this.info.buyBtnText;
      }
      return text;
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    addCart() {
      this.$emit("click", "addCart");
    },
    buy() {
      this.$emit("click", "buy");
    }
  },
  components: {
    actionBtnConfirm
  }
};
</script>

<style scoped></style>
