<template>
  <view class="u-time-axis-item">
    <slot name="content" />
    <view class="u-time-axis-node" :style="[nodeStyle]">
      <slot name="node">
        <view class="u-dot"> </view>
      </slot>
    </view>
  </view>
</template>

<script>
/**
 * timeLineItem 時間軸Item
 * @description 時間軸组件一般用于物流信息展示，各種跟時間相關的記錄等場景。(搭配u-time-line使用)
 * @property {String} bg-color 左邊節點的背景顏色，一般通過slot內容自定義背景顏色即可（默認#ffffff）
 * @property {String Number} node-top 節點左邊圖標絕對定位的top值，單位rpx
 * @example <u-time-line-item node-top="2">...</u-time-line-item>
 */
export default {
  name: "u-time-line-item",
  props: {
    // 節點的背景顏色
    bgColor: {
      type: String,
      default: "#ffffff"
    },
    // 節點左邊圖標絕對定位的top值
    nodeTop: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    nodeStyle() {
      let style = {
        backgroundColor: this.bgColor
      };
      if (this.nodeTop != "") style.top = this.nodeTop + "rpx";
      return style;
    }
  }
};
</script>

<style lang="scss" scoped>
.u-time-axis-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  margin-bottom: 32rpx;
}
.u-time-axis-node {
  position: absolute;
  top: 12rpx;
  left: -40rpx;
  transform-origin: 0;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  font-size: 24rpx;
}
.u-dot {
  height: 16rpx;
  width: 16rpx;
  border-radius: 100rpx;
  background: #ddd;
}
</style>
