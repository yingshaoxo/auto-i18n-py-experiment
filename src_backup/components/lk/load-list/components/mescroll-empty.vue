<!--空布局

可作為獨立的組件, 不使用mescroll的頁面也能單獨引入, 以便APP全局統一管理:
import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
<mescroll-empty v-if="isShowEmpty" :option="optEmpty" @emptyclick="emptyClick"></mescroll-empty>

-->
<template>
  <view
    class="mescroll-empty"
    :class="{ 'empty-fixed': option.fixed }"
    :style="{ 'z-index': option.zIndex, top: option.top }"
  >
    <image v-if="icon" class="empty-icon" :src="icon" mode="widthFix" />
    <view v-if="tip" class="empty-tip">{{ tip }}</view>
    <lk-button
      v-if="option.btnText"
      size="small"
      :custom-style="{ width: '200rpx', margin: '20rpx' }"
      :color="theme.gradient"
      round
      type="danger"
      :to="option.to"
      @click="emptyClick"
    >
      {{ option.btnText }}
    </lk-button>
  </view>
</template>

<script>
// 引入全局配置
import GlobalOption from "./../mescroll-uni-option.js";
import { mapGetters } from "vuex";
export default {
  props: {
    // empty的配置項: 默認為GlobalOption.up.empty
    option: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  // 使用computed獲取配置,用於支持option的動態配置
  computed: {
    ...mapGetters(["static"]),
    // 圖標
    icon() {
      return this.option.icon == null
        ? this.option.type
          ? this.static.baseImgPath + "empty-" + this.option.type + ".png"
          : this.static.baseImgPath + "empty-data.png"
        : this.option.icon; // 此處不使用短路求值, 用於支持传空串不显示圖標
    },
    // 文本提示
    tip() {
      return this.option.tip == null
        ? GlobalOption.up.empty.tip
        : this.option.tip; // 此處不使用短路求值, 用於支持传空串不显示文本提示
    }
  },
  methods: {
    // 點擊按鈕
    emptyClick() {
      this.$emit("emptyclick");
    }
  }
};
</script>

<style lang="scss" scoped>
/* 無任何數據的空布局 */
.mescroll-empty {
  box-sizing: border-box;
  width: 100%;
  padding: 100rpx 50rpx;
  text-align: center;
}

.mescroll-empty.empty-fixed {
  z-index: 99;
  position: absolute; /*transform會使fixed失效,最終會降級為absolute */
  top: 100rpx;
  left: 0;
}

.mescroll-empty .empty-icon {
  width: 514rpx;
  height: 260rpx;
}

.mescroll-empty .empty-tip {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: gray;
}

.mescroll-empty .empty-btn {
  display: inline-block;
  margin-top: 40rpx;
  min-width: 200rpx;
  padding: 18rpx;
  font-size: 28rpx;
  border: 1rpx solid #e04b28;
  border-radius: 60rpx;
  color: #e04b28;
}

.mescroll-empty .empty-btn:active {
  opacity: 0.75;
}
</style>
