<template>
  <view class="header" :style="styles">
    <view v-if="topBar" :style="topBarStyle"></view>
    <view class="wrap">
      <view class="avatar">
        <lk-avatar size="large" :src="avatar" />
      </view>
      <view class="content">
        <view class="name">
          {{ name || '' }}
          <text v-if="nameTag" class="name-tag" @click="tagLink">{{
            nameTag
          }}</text>
        </view>
        <slot />
      </view>
      <slot name="right" />
    </view>
    <slot name="bottom" />
  </view>
</template>

<script>
import { formatStyle } from "@/common/utils/stringify";

// 獲取系統狀態欄
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，獲取右上角膠囊的尺寸信息，避免導航欄右側內容與膠囊重疊(支付寶小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
  data() {
    return {};
  },
  props: {
    avatar: String,
    name: [String, Number],
    nameTag: [String, Number],
    nameTagLink: [String, Object],
    customStyle: {
      type: Object,
      default: () => ({})
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    },
    // 置頂通欄頂部bar
    topBar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    styles() {
      return formatStyle({
        background: this.theme.gradient,
        marginBottom: this.marginBottom + "rpx",
        ...this.customStyle
      });
    },
    // 轉換字符數值為真正的數值
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44;
      // #endif
      // #ifdef MP
      // 小程序特別處理，讓導航欄高度 = 膠囊高度 + 兩倍膠囊頂部與狀態欄底部的距離之差(相當於同時獲得了導航欄底部與膠囊底部的距離)
      // 此方法有缺陷，暫不用(會導致少了幾個px)，採用直接固定值的方式
      // return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//導航高度
      return systemInfo.platform == "ios" ? 44 : 48;
      // #endif
    },
    topBarStyle() {
      // #ifdef H5
      return "";
      // #endif

      // 在小程序端生效
      let sH = systemInfo.statusBarHeight; // 狀態欄高度
      let nH = this.navbarHeight; //導航欄高度
      let style = {
        height: sH + nH + "px"
      };
      return formatStyle(style);
    }
  },
  methods: {
    tagLink() {
      if (this.nameTagLink) {
        this.$Navigate.push(this.nameTagLink);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  padding: 60rpx 30rpx;
  min-height: 240rpx;
  color: #ffffff;
}
.wrap {
  display: flex;
  flex-flow: row;
  .avatar {
    width: 120rpx;
    flex: none;
    margin-right: 30rpx;
  }
  .name {
    font-size: $font-size-lg;
    line-height: 48rpx;
    height: 48rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 340rpx;
  }
  .name-tag {
    display: inline-flex;
    border-radius: 40rpx;
    height: 32rpx;
    min-width: 100rpx;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    color: $text-gray;
    font-size: $font-size-xs;
    margin-left: 16rpx;
    vertical-align: text-top;
  }
  .content {
    flex: 1;
    display: flex;
    flex-flow: column;
    color: inherit;
  }
}
</style>
