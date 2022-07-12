<template>
  <view class="u-radio-group" :style="{ flexFlow }">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    // 是否禁用所有單選框
    disabled: {
      type: Boolean,
      default: false
    },
    // 匹配某一個radio組件，如果某個radio的name值等於此值，那麼這個radio就被會選中
    value: {
      type: [String, Number],
      default: ""
    },
    // 選中狀態下的顏色
    activeColor: {
      type: String,
      default: "#f44"
    },
    // 組件的整体大小
    size: {
      type: [String, Number],
      default: 40
    },
    flexFlow: {
      type: String,
      default: "wrap"
    }
  },
  provide() {
    return {
      radioGroup: this
    };
  },
  methods: {
    // 该方法有子組件radio調用，當一個radio被選中的時候，给父組件设置value值(props傳遞的value)
    setValue(val) {
      // 通過emit事件，设置父組件通過v-model雙向綁定的值
      this.$emit("input", val);
      // 等待下一個週期再執行，因為this.$emit('input')作用于父組件，再反馈到子組件内部，需要時間
      this.$nextTick(function() {
        this.$emit("change", this.value);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.u-radio-group {
  display: flex;
}
</style>
