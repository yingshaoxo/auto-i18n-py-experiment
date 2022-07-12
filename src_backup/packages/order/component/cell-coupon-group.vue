<template>
  <view>
    <lk-cell title="優惠券" :value="nameText" is-link @click="isshow" />
    <lk-popup-coupon
      v-model="show"
      :items="list"
      :title="shopName"
      :get-type="1"
      @use="use"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      name: "",
      isUse: 2,
    };
  },
  props: {
    value: Boolean,
    shopName: String,
    list: Array,
    couponNum: [String, Number],
    couponName: [String, Number],
    items: {
      type: Array,
      default: () => [],
    },
    couponUse: [String, Number], //0不允許 優惠券，領貨碼同時使用

    receiveGoodsuse: [String, Number], //是否使用了領貨碼 1使用過，2未使
  },
  watch: {
    receiveGoodsuse(e) {
      if (e) this.isUse = e;
    },
  },
  computed: {
    // show: {
    //   get() {
    //     return this.value;
    //   },
    //   set(e) {
    //     this.$emit("input", e);
    //   }
    // },
    nameText() {
      if (this.isUse == 1 && this.couponUse == 0)
        return "優惠券和領貨碼不能同時使用";
      else
        return this.couponName
          ? "已選：" + this.couponName
          : "有 " + this.couponNum + " 張可用優惠券";
    },
  },
  methods: {
    use(item) {
      const flag = this.items.some(({ coupon_id }) => {
        if (coupon_id == item.coupon_id) {
          this.$Prompt.toast("該優惠券只能使用一次！");
          return true;
        }
      });
      if (!flag) {
        this.$emit("use", item);
        this.show = false;
      }
    },
    isshow() {
      if (this.isUse == 1 && this.couponUse == 0) this.show = false;
      else this.show = true;
    },
  },
};
</script>
