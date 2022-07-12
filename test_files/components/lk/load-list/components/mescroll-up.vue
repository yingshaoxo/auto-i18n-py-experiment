<!-- 上拉加載區域 -->
<template>
  <view
    class="mescroll-upwarp"
    :style="{
      'background-color': mescroll.optUp.bgColor,
      color: mescroll.optUp.textColor
    }"
  >
    <!-- 加載中 (此處不能用v-if,否則android小程序快速上拉可能會不斷觸髮上拉回調) -->
    <view v-show="isUpLoading">
      <view
        class="upwarp-progress mescroll-rotate"
        :style="{ 'border-color': mescroll.optUp.textColor }"
      ></view>
      <view class="upwarp-tip">{{ mOption.textLoading }}</view>
    </view>
    <!-- 無數據 -->
    <view v-if="isUpNoMore" class="upwarp-nodata">{{
      mOption.textNoMore
    }}</view>
  </view>
</template>

<script>
export default {
  props: {
    option: Object, // up的配置項
    type: Number // 上拉加載的狀態：0（loading前），1（loading中），2（沒有更多了）
  },
  computed: {
    // 支付寶小程序需寫成計算屬性,prop定義default仍報錯
    mOption() {
      return this.option || {};
    },
    // 加載中
    isUpLoading() {
      return this.type === 1;
    },
    // 沒有更多了
    isUpNoMore() {
      return this.type === 2;
    }
  }
};
</script>

<style scoped>
@import "./mescroll-up.css";
</style>
