<template>
  <view class="u-checkbox-group" :style="{ flexFlow }">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    // 最多能選中多少個checkbox
    max: {
      type: [Number, String],
      default: 999
    },
    // 所有選中項的 name
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否禁用所有復選框
    disabled: {
      type: Boolean,
      default: false
    },
    // 在表單內提交時的標識符
    name: {
      type: [Boolean, String],
      default: ""
    },
    // 選中狀態下的顏色
    activeColor: {
      type: String,
      default: "#f44"
    },
    // 組件的整體大小
    size: {
      type: [String, Number],
      default: 20
    },
    flexFlow: {
      type: String,
      default: "wrap"
    }
  },
  provide() {
    return {
      checkboxGroup: this
    };
  },
  data() {
    return {};
  },
  watch: {
    value(val) {
      this.$emit("change", val);
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.u-checkbox-group {
  display: flex;
}
</style>
