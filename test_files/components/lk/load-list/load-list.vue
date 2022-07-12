<template>
  <view
    class="mescroll-body"
    :style="{
      minHeight: minHeight,
      'padding-top': padTop,
      'padding-bottom': padBottom,
      'padding-bottom': padBottomConstant,
      'padding-bottom': padBottomEnv
    }"
    @touchstart="touchstartEvent"
    @touchmove="touchmoveEvent"
    @touchend="touchendEvent"
    @touchcancel="touchendEvent"
  >
    <view
      class="mescroll-body-content"
      :style="{ transform: translateY, transition: transition }"
    >
      <!-- 下拉加載區域 (支付寶小程序子組件傳參給子子組件仍報單項數據流的異常,暫時不通過mescroll-down組件實現)-->
      <!-- <mescroll-down :option="mescroll.optDown" :type="downLoadType" :rate="downRate"></mescroll-down> -->
      <view
        v-if="mescroll.optDown.use"
        class="mescroll-downwarp"
        :style="{
          'background-color': mescroll.optDown.bgColor,
          color: mescroll.optDown.textColor
        }"
      >
        <view class="downwarp-content">
          <view
            class="downwarp-progress"
            :class="{ 'mescroll-rotate': isDownLoading }"
            :style="{
              'border-color': mescroll.optDown.textColor,
              transform: downRotate
            }"
          ></view>
          <view class="downwarp-tip">{{ downText }}</view>
        </view>
      </view>

      <!-- 列表內容 -->
      <slot></slot>

      <!-- 空布局 -->
      <mescroll-empty
        v-if="isShowEmpty"
        :option="mescroll.optUp.empty"
        @emptyclick="emptyClick"
      ></mescroll-empty>

      <!-- 上拉加載區域 (下拉刷新時不顯示, 支付寶小程序子組件傳參給子子組件仍報單項數據流的異常,暫時不通過mescroll-up組件實現)-->
      <!-- <mescroll-up v-if="mescroll.optUp.use && !isDownLoading" :option="mescroll.optUp" :type="upLoadType"></mescroll-up> -->
      <view
        v-if="mescroll.optUp.use && !isDownLoading"
        class="mescroll-upwarp"
        :style="{
          'background-color': mescroll.optUp.bgColor,
          color: mescroll.optUp.textColor
        }"
      >
        <!-- 加載中 (此處不能用v-if,否則android小程序快速上拉可能會不斷觸髮上拉回調) -->
        <view v-show="upLoadType === 1">
          <view
            class="upwarp-progress mescroll-rotate"
            :style="{ 'border-color': mescroll.optUp.textColor }"
          ></view>
          <view class="upwarp-tip">{{ mescroll.optUp.textLoading }}</view>
        </view>
        <!-- 無數據 -->
        <view v-if="upLoadType === 2" class="upwarp-nodata">{{
          mescroll.optUp.textNoMore
        }}</view>
      </view>
    </view>

    <!-- 回到頂部按鈕 (fixed元素需寫在transform外面,防止降級為absolute)-->
    <mescroll-top
      v-model="isShowToTop"
      :option="mescroll.optUp.toTop"
      @click="toTopClick"
    ></mescroll-top>
  </view>
</template>

<script>
// 引入mescroll-uni.js,處理核心邏輯
import MeScroll from "./mescroll-uni.js";
// 引入全局配置
import GlobalOption from "./mescroll-uni-option.js";
// 引入空布局組件
import MescrollEmpty from ".//components/mescroll-empty.vue";
// 引入回到頂部組件
import MescrollTop from "./components/mescroll-top.vue";

export default {
  components: {
    MescrollEmpty,
    MescrollTop
  },
  data() {
    return {
      mescroll: { optDown: {}, optUp: {} }, // mescroll實例
      downHight: 0, //下拉刷新: 容器高度
      downRate: 0, // 下拉比率(inOffset: rate<1; outOffset: rate>=1)
      downLoadType: 4, // 下拉刷新狀態 （inOffset：1， outOffset：2， showLoading：3， endDownScroll：4）
      upLoadType: 0, // 上拉加載狀態：0（loading前），1（loading中），2（沒有更多了）
      isShowEmpty: false, // 是否顯示空布局
      isShowToTop: false, // 是否显示回到頂部按鈕
      windowHeight: 0, // 可使用窗口的高度
      statusBarHeight: 0, // 狀態欄高度
      isSafearea: false // 支持安全區
    };
  },
  props: {
    down: Object, // 下拉刷新的參數配置
    up: Object, // 上拉加載的參數配置
    top: [String, Number], // 下拉布局往下的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中純數字則默認單位rpx, 百分比則相對於windowHeight)
    topbar: Boolean, // top的偏移量是否加上狀態欄高度, 默認false (使用場景:取消原生導航欄時,配置此项可自动加上狀態欄高度的偏移量)
    bottom: [String, Number], // 上拉布局往上的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中純數字則默認單位rpx, 百分比則相對於windowHeight)
    safearea: Boolean, // bottom的偏移量是否加上底部安全區的距離, 默認false (需要適配iPhoneX時使用)
    height: [String, Number] // 指定mescroll最小高度,默認windowHeight,使列表不滿屏仍可下拉
  },
  computed: {
    // mescroll最小高度,默認windowHeight,使列表不滿屏仍可下拉
    minHeight() {
      return this.toPx(this.height || "100%") + "px";
    },
    // 下拉布局往下偏移的距離 (px)
    numTop() {
      return this.toPx(this.top) + (this.topbar ? this.statusBarHeight : 0);
    },
    padTop() {
      return this.numTop + "px";
    },
    // 上拉布局往上偏移 (px)
    numBottom() {
      return this.toPx(this.bottom);
    },
    padBottom() {
      return this.numBottom + "px";
    },
    padBottomConstant() {
      return this.isSafearea
        ? "calc(" + this.padBottom + " + constant(safe-area-inset-bottom))"
        : this.padBottom;
    },
    padBottomEnv() {
      return this.isSafearea
        ? "calc(" + this.padBottom + " + env(safe-area-inset-bottom))"
        : this.padBottom;
    },
    // 是否為重置下拉的狀態
    isDownReset() {
      return this.downLoadType === 3 || this.downLoadType === 4;
    },
    // 過渡
    transition() {
      return this.isDownReset ? "transform 300ms" : this.downTransition;
    },
    translateY() {
      return this.downHight > 0 ? "translateY(" + this.downHight + "px)" : ""; // transform會使fixed失效,需注意把fixed元素寫在mescroll之外
    },
    // 是否在加載中
    isDownLoading() {
      return this.downLoadType === 3;
    },
    // 旋轉的角度
    downRotate() {
      return "rotate(" + 360 * this.downRate + "deg)";
    },
    // 文本提示
    downText() {
      switch (this.downLoadType) {
        case 1:
          return this.mescroll.optDown.textInOffset;
        case 2:
          return this.mescroll.optDown.textOutOffset;
        case 3:
          return this.mescroll.optDown.textLoading;
        case 4:
          return this.mescroll.optDown.textLoading;
        default:
          return this.mescroll.optDown.textInOffset;
      }
    }
  },
  methods: {
    //number,rpx,upx,px,% --> px的數值
    toPx(num) {
      if (typeof num === "string") {
        if (num.indexOf("px") !== -1) {
          if (num.indexOf("rpx") !== -1) {
            // "10rpx"
            num = num.replace("rpx", "");
          } else if (num.indexOf("upx") !== -1) {
            // "10upx"
            num = num.replace("upx", "");
          } else {
            // "10px"
            return Number(num.replace("px", ""));
          }
        } else if (num.indexOf("%") !== -1) {
          // 傳百分比,則相對於windowHeight,傳"10%"則等於windowHeight的10%
          let rate = Number(num.replace("%", "")) / 100;
          return this.windowHeight * rate;
        }
      }
      return num ? uni.upx2px(Number(num)) : 0;
    },
    //注冊列表touchstart事件,用於下拉刷新
    touchstartEvent(e) {
      this.mescroll.touchstartEvent(e);
    },
    //注冊列表touchmove事件,用於下拉刷新
    touchmoveEvent(e) {
      this.mescroll.touchmoveEvent(e);
    },
    //注冊列表touchend事件,用於下拉刷新
    touchendEvent(e) {
      this.mescroll.touchendEvent(e);
    },
    // 點擊空布局的按鈕回調
    emptyClick() {
      this.$emit("emptyclick", this.mescroll);
    },
    // 點擊回到頂部的按鈕回調
    toTopClick() {
      this.mescroll.scrollTo(0, this.mescroll.optUp.toTop.duration); // 執行回到頂部
      this.$emit("topclick", this.mescroll); // 派发点击回到頂部按鈕的回調
    }
  },
  // 使用created初始化mescroll對象; 如果用mounted部分css樣式編譯到H5會失效
  created() {
    let vm = this;

    let diyOption = {
      // 下拉刷新的配置
      down: {
        inOffset(mescroll) {
          vm.downLoadType = 1; // 下拉的距離進入offset範圍內那一刻的回調 (自定義mescroll組件時,此行不可刪)
        },
        outOffset(mescroll) {
          vm.downLoadType = 2; // 下拉的距離大於offset那一刻的回調 (自定義mescroll組件時,此行不可刪)
        },
        onMoving(mescroll, rate, downHight) {
          // 下拉過程中的回調,滑動過程一直在執行;
          vm.downHight = downHight; // 設置下拉區域的高度 (自定義mescroll組件時,此行不可刪)
          vm.downRate = rate; //下拉比率 (inOffset: rate<1; outOffset: rate>=1)
        },
        showLoading(mescroll, downHight) {
          vm.downLoadType = 3; // 顯示下拉刷新進度的回調 (自定義mescroll組件時,此行不可刪)
          vm.downHight = downHight; // 設置下拉區域的高度 (自定義mescroll組件時,此行不可刪)
        },
        endDownScroll(mescroll) {
          vm.downLoadType = 4; // 結束下拉 (自定義mescroll組件時,此行不可刪)
          vm.downHight = 0; // 設置下拉區域的高度 (自定義mescroll組件時,此行不可刪)
        },
        // 派發下拉刷新的回調
        callback: function(mescroll) {
          vm.$emit("down", mescroll);
        }
      },
      // 上拉加載的配置
      up: {
        // 显示加載中的回調
        showLoading() {
          vm.upLoadType = 1;
        },
        // 顯示無更多數據的回調
        showNoMore() {
          vm.upLoadType = 2;
        },
        // 隱藏上拉加載的回調
        hideUpScroll() {
          vm.upLoadType = 0;
        },
        // 空布局
        empty: {
          onShow(isShow) {
            // 顯示隱藏的回調
            vm.isShowEmpty = isShow;
          }
        },
        // 回到頂部
        toTop: {
          onShow(isShow) {
            // 顯示隱藏的回調
            vm.isShowToTop = isShow;
          }
        },
        // 派髮上拉加載的回調
        callback: function(mescroll) {
          vm.$emit("up", mescroll);
        }
      }
    };

    MeScroll.extend(diyOption, GlobalOption); // 混入全局的配置
    let myOption = JSON.parse(
      JSON.stringify({
        down: vm.down,
        up: vm.up
      })
    ); // 深拷貝,避免對props的影響
    MeScroll.extend(myOption, diyOption); // 混入具體界面的配置

    // 初始化MeScroll對象
    vm.mescroll = new MeScroll(myOption, true); // 傳入true,標記body為滾動區域
    // init回調mescroll對象
    vm.$emit("init", vm.mescroll);

    // 設置高度
    const sys = uni.getSystemInfoSync();
    if (sys.windowHeight) vm.windowHeight = sys.windowHeight;
    if (sys.statusBarHeight) vm.statusBarHeight = sys.statusBarHeight;
    // 使down的bottomOffset生效
    vm.mescroll.setBodyHeight(sys.windowHeight);
    // mescroll-body在Android小程序下拉會卡頓,無法像mescroll-uni那樣通過設置"disableScroll":true解決,只能用动画過渡缓解
    // #ifdef MP
    if (sys.platform == "android") vm.downTransition = "transform 200ms";
    // #endif

    // 因為使用的是page的scroll,这里需自定義scrollTo
    vm.mescroll.resetScrollTo((y, t) => {
      uni.pageScrollTo({
        scrollTop: y,
        duration: t
      });
    });

    // 具體的界面如果不配置up.toTop.safearea,則取本vue的safearea值
    if (sys.platform == "ios") {
      vm.isSafearea = vm.safearea;
      if (vm.up && vm.up.toTop && vm.up.toTop.safearea != null) {
      } else {
        vm.mescroll.optUp.toTop.safearea = vm.safearea;
      }
    } else {
      vm.isSafearea = false;
      vm.mescroll.optUp.toTop.safearea = false;
    }
  }
};
</script>

<style scoped>
@import "./mescroll-body.css";
@import "./components/mescroll-down.css";
@import "./components/mescroll-up.css";
</style>
