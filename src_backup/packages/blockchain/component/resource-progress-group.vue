<template>
  <view class="cell-group">
    <lk-cell>
      <view class="text">
        <view>
          <text class="name">CPU</text>
          <text class="explain"
            >{{ info.cpuUsed }} ms / {{ info.cpuMax }} ms</text
          >
        </view>
        <view>
          <text class="name">{{ info.totalCpu }} EOS</text>
        </view>
      </view>
      <view>
        <progress
          class="progress"
          :active-color="theme.color"
          :percent="info.cpuRatio"
          stroke-width="10"
        />
      </view>
    </lk-cell>
    <lk-cell>
      <view class="text">
        <view>
          <text class="name">NET</text>
          <text class="explain"
            >{{ info.netUsed }} kb / {{ info.netMax }} kb</text
          >
        </view>
        <view>
          <text class="name">{{ info.totalNet }} EOS</text>
        </view>
      </view>
      <view>
        <progress
          class="progress"
          :active-color="theme.color"
          :percent="info.netRatio"
          stroke-width="10"
        />
      </view>
    </lk-cell>
  </view>
</template>

<script>
export default {
  props: {
    info: Object
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin-bottom: 20rpx;
}
.text {
  display: flex;
  justify-content: space-between;
}

.text .explain {
  font-size: $font-size-sm;
  color: $text-light;
  padding: 0 8rpx;
}

.progress {
  border-radius: 10rpx;
  overflow: hidden;
}
</style>
