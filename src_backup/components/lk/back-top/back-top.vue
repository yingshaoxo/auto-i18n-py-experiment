<template>
  <view
    @tap="backToTop"
    class="u-back-top"
    :class="['u-back-top--mode--' + mode]"
    :style="[
      {
        bottom: bottom + 'rpx',
        right: right + 'rpx',
        borderRadius: mode == 'circle' ? '10000rpx' : '8rpx',
        zIndex: uZIndex,
        opacity: opacity
      },
      customStyle
    ]"
  >
    <view
      class="u-back-top__content"
      v-if="!$slots.default && !$slots.$default"
    >
      <lk-icon
        @click="backToTop"
        :name="icon"
        :custom-style="iconStyle"
      ></lk-icon>
      <view class="u-back-top__content__tips">
        {{ tips }}
      </view>
    </view>
    <slot v-else />
  </view>
</template>

<script>
export default {
  name: "u-back-top",
  props: {
    // 返回頂部的形狀，circle-圓形，square-方形
    mode: {
      type: String,
      default: "circle"
    },
    // 自定義圖標
    icon: {
      type: String,
      default: "arrow-up"
    },
    // 提示文字
    tips: {
      type: String,
      default: ""
    },
    // 返回頂部滾動時間
    duration: {
      type: [Number, String],
      default: 100
    },
    // 滾動距離
    scrollTop: {
      type: [Number, String],
      default: 0
    },
    // 距離頂部多少距離顯示，單位rpx
    top: {
      type: [Number, String],
      default: 400
    },
    // 返回頂部按鈕到底部的距離，單位rpx
    bottom: {
      type: [Number, String],
      default: 200
    },
    // 返回頂部按鈕到右邊的距離，單位rpx
    right: {
      type: [Number, String],
      default: 40
    },
    // 層級
    zIndex: {
      type: [Number, String],
      default: "9"
    },
    // 圖標的樣式，對象形式
    iconStyle: {
      type: Object,
      default() {
        return {
          color: "#909399",
          fontSize: "38rpx"
        };
      }
    },
    // 整個組件的樣式
    customStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    showBackTop(nVal, oVal) {
      // 當組件的顯示與隱藏狀態發生跳變時，修改組件的層級和不透明度
      // 讓組件有顯示和消失的動畫效果，如果用v-if控制組件狀態，將無設置動畫效果
      if (nVal) {
        this.uZIndex = this.zIndex;
        this.opacity = 1;
      } else {
        this.uZIndex = -1;
        this.opacity = 0;
      }
    }
  },
  computed: {
    showBackTop() {
      // 由於scrollTop为页面的滾動距離，默認為px單位，這裡將用於傳入的top(rpx)值
      // 轉為px用於比較，如果滾動條到頂的距離大於設定的距離，就顯示返回頂部的按鈕
      return this.scrollTop > uni.upx2px(this.top);
    }
  },
  data() {
    return {
      // 不透明度，為了讓組件有一個顯示和隱藏的過渡動畫
      opacity: 0,
      // 組件的z-index值，隱藏時設置為-1，就會看不到
      uZIndex: -1
    };
  },
  methods: {
    backToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: this.duration
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.u-back-top {
  width: 80rpx;
  height: 80rpx;
  position: fixed;
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  color: $text-color;
  align-items: center;
  transition: opacity 0.4s;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__tips {
      font-size: 24rpx;
      transform: scale(0.8);
      line-height: 1;
    }
  }
}
</style>
