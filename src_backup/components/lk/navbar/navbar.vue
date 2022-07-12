<template>
  <view class="">
    <view
      class="u-navbar"
      :style="[navbarStyle]"
      :class="{ 'u-navbar-fixed': isFixed, 'u-border-bottom': borderBottom }"
    >
      <view
        class="u-status-bar"
        :style="{ height: statusBarHeight + 'px' }"
      ></view>
      <view class="u-navbar-inner" :style="[navbarInnerStyle]">
        <view class="u-back-wrap" v-if="isShowBack" @tap="goBack">
          <view class="u-icon-wrap">
            <lk-icon
              :name="backIconName"
              :color="backIconColor"
              :size="backIconSize"
            ></lk-icon>
          </view>
          <view
            class="u-icon-wrap u-back-text u-line-1"
            v-if="backText"
            :style="[backTextStyle]"
            >{{ backText }}</view
          >
        </view>
        <view
          class="u-navbar-content-title"
          v-if="titleText || titleImage"
          :style="[titleStyle]"
        >
          <image
            v-if="titleImage"
            :src="titleImage"
            class="u-title-img"
            mode="heightFix"
          />
          <view
            v-else
            class="u-title u-line-1"
            :style="{
              color: titleColor,
              fontSize: titleSize + 'rpx',
              fontWeight: titleBold ? 'bold' : 'normal'
            }"
          >
            {{ titleText }}
          </view>
        </view>
        <view class="u-slot-content">
          <slot></slot>
        </view>
        <view class="u-slot-right">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
    <!-- 解決fixed定位後導航欄塌陷的問題 -->
    <view
      class="u-navbar-placeholder"
      v-if="isFixed && !immersive"
      :style="{
        width: '100%',
        height: Number(navbarHeight) + statusBarHeight + 'px'
      }"
    ></view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
// 獲取系統狀態欄的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，獲取右上角膠囊的尺寸信息，避免導航欄右側內容與膠囊重疊(支付寶小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
/**
 * navbar 自定義導航欄
 * @description 此組件一般用於在特殊情況下，需要自定義導航欄的时候用到，一般建議使用uniapp自帶的導航欄。
 * @property {String Number} height 導航欄高度(不包括狀態欄高度在內，內部自動加上)，注意這裡的單位是px（默認44）
 * @property {String} back-icon-color 左邊返回圖標的顏色（默認#606266）
 * @property {String} back-icon-name 左邊返回圖標的名稱，只能為uView自帶的圖標（默認arrow-left）
 * @property {String Number} back-icon-size 左邊返回圖標的大小，單位rpx（默認30）
 * @property {String} back-text 返回圖標右邊的輔助提示文字
 * @property {Object} back-text-style 返回圖標右邊的輔助提示文字的樣式，對象形式（默認{ color: '#606266' }）
 * @property {String} title 導航欄標題，如設置為空字符，將會隱藏標題占位區域
 * @property {String Number} title-width 導航欄標題的最大宽度，內容超出會以省略號隱藏，單位rpx（默認250）
 * @property {String} title-color 標題的顏色（默認#606266）
 * @property {String Number} title-size 導航欄標題字体大小，單位rpx（默認32）
 * @property {Function} custom-back 自定義返回邏輯方法
 * @property {String Number} z-index 固定在頂部時的z-index值（默認980）
 * @property {Boolean} is-back 是否顯示導航欄左邊返回圖標和輔助文字（默認true）
 * @property {Object} background 導航欄背景設置，見官網說明（默認{ background: '#ffffff' }）
 * @property {Boolean} is-fixed 導航欄是否固定在頂部（默認true）
 * @property {Boolean} immersive 沉浸式，允許fixed定位後導航欄塌陷，僅fixed定位下生效（默認false）
 * @property {Boolean} border-bottom 導航欄底部是否顯示下邊框，如定義了較深的背景顏色，可取消此值（默認true）
 * @example <u-navbar back-text="返回" title="劍未配妥，出門已是江湖"></u-navbar>
 */
function $parent(name = undefined) {
  let parent = this.$parent;
  // 通過while歷遍，這裡主要是為了H5需要多層解析的問題
  while (parent) {
    // 父組件
    if (parent.$options && parent.$options.name !== name) {
      // 如果組件的name不相等，繼續上一級尋找
      parent = parent.$parent;
    } else {
      return parent;
    }
  }
  return false;
}
export default {
  name: "u-navbar",
  props: {
    // 導航欄高度，單位px，非rpx
    height: {
      type: [String, Number],
      default: ""
    },
    // 返回箭頭的顏色
    backIconColor: {
      type: String,
      default: "#606266"
    },
    // 左邊返回的圖標
    backIconName: {
      type: String,
      default: "arrow-left"
    },
    // 左邊返回圖標的大小，rpx
    backIconSize: {
      type: [String, Number],
      default: "22"
    },
    // 返回的文字提示
    backText: {
      type: String,
      default: ""
    },
    // 返回的文字的 樣式
    backTextStyle: {
      type: Object,
      default() {
        return {
          color: "#606266"
        };
      }
    },
    // 導航欄標題
    title: {
      type: [String, Number],
      default: ""
    },
    // 標題的寬度，如果需要自定義右側內容，且右側內容很多時，可能需要減少這個寬度，單位rpx
    titleWidth: {
      type: [String, Number],
      default: "250"
    },
    // 標題的顏色
    titleColor: {
      type: String,
      default: "#606266"
    },
    // 標題字體是否加粗
    titleBold: {
      type: Boolean,
      default: true
    },
    // 標題的字體大小
    titleSize: {
      type: [String, Number],
      default: 32
    },
    // 圖片標題
    titleImage: {
      type: String
    },
    // 使用路由的標題
    routeTitle: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: true
    },
    // 對象形式，因為用戶可能定義一個純色，或者線性漸變的顏色
    background: {
      type: Object,
      default() {
        return {
          background: "#ffffff"
        };
      }
    },
    // 導航欄是否固定在頂部
    isFixed: {
      type: Boolean,
      default: true
    },
    // 是否沉浸式，允許fixed定位後導航欄塌陷，僅fixed定位下生效
    immersive: {
      type: Boolean,
      default: false
    },
    // 是否顯示導航欄的下邊框
    borderBottom: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: [String, Number],
      default: ""
    },
    // 自定義返回邏輯
    customBack: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      menuButtonInfo: menuButtonInfo,
      statusBarHeight: systemInfo.statusBarHeight
    };
  },
  computed: {
    // 导航栏内部盒子的樣式
    navbarInnerStyle() {
      let style = {};
      // 導航欄寬度，如果在小程序下，導航欄寬度为胶囊的左边到屏幕左边的距离
      style.height = this.navbarHeight + "px";
      // // 如果是各家小程序，導航欄內部的寬度需要減少右邊膠囊的寬度
      // #ifdef MP
      let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
      style.marginRight = rightButtonWidth + "px";
      // #endif
      return style;
    },
    // 整个导航栏的樣式
    navbarStyle() {
      let style = {};
      style.zIndex = this.zIndex ? this.zIndex : 1000;
      // 合併用戶傳遞的背景色對象
      Object.assign(style, this.background);
      return style;
    },
    // 导航中间的标题的樣式
    titleStyle() {
      let style = {};
      // #ifndef MP
      style.left =
        (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + "px";
      style.right =
        (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + "px";
      // #endif
      // #ifdef MP
      // 此處是為了讓標題顯示區域即使在小程序有右側膠囊的情況下也能處於屏幕的中間，是通過绝对定位实现的
      let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
      style.left =
        (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + "px";
      style.right =
        rightButtonWidth -
        (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 +
        rightButtonWidth +
        "px";
      // #endif
      style.width = uni.upx2px(this.titleWidth) + "px";
      return style;
    },
    // 轉換字符數值為真正的數值
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return this.height ? this.height : 44;
      // #endif
      // #ifdef MP
      // 小程序特別處理，讓導航欄高度 = 膠囊高度 + 兩倍膠囊頂部與狀態欄底部的距離之差(相當於同時獲得了導航欄底部與膠囊底部的距離)
      // 此方法有缺陷，暫不用(會導致少了幾個px)，採用直接固定值的方式
      // return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//導航高度
      let height = systemInfo.platform == "ios" ? 44 : 48;
      return this.height ? this.height : height;
      // #endif
    },
    ...mapGetters({
      routeInfo: "route"
    }),
    // 是否顯示返回按鈕
    isShowBack() {
      let flag = this.isBack;
      if (flag) {
        flag = !this.routeInfo.meta.isTabBar;
      }
      return flag;
    },
    titleText() {
      let text = this.title;
      if (!text && this.routeTitle) {
        text = this.routeInfo.title;
      }
      return text;
    }
  },
  created() {},
  methods: {
    goBack() {
      // 如果自定義了點擊返回按鈕的函數，則執行，否則執行返回逻辑
      if (typeof this.customBack === "function") {
        // 在微信，支付寶等環境(H5正常)，会导致父組件定义的customBack()函數體中的this變成子組件的this
        // 通過bind()方法，绑定父組件的this，讓this.customBack()的this为父組件的上下文
        this.customBack.bind(this.$parent)();
      } else {
        uni.navigateBack();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.u-navbar {
  width: 100%;
}

.u-navbar-fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 991;

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.u-status-bar {
  width: 100%;
}

.u-navbar-inner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  align-items: center;
}

.u-back-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  flex-grow: 0;
  padding: 14rpx 14rpx 14rpx 24rpx;
}

.u-back-text {
  padding-left: 4rpx;
  font-size: 30rpx;
}

.u-navbar-content-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: absolute;
  left: 0;
  right: 0;
  height: 60rpx;
  text-align: center;
  flex-shrink: 0;
}

.u-title-img {
  height: 100%;
}

.u-navbar-centent-slot {
  flex: 1;
}

.u-title {
  line-height: 60rpx;
  font-size: 32rpx;
  flex: 1;
}

.u-navbar-right {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.u-slot-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
