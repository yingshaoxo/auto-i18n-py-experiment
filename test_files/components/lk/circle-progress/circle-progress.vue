<template>
  <view
    class="u-circle-progress"
    :style="{
      width: widthPx + 'px',
      height: widthPx + 'px',
      backgroundColor: bgColor
    }"
  >
    <canvas
      class="u-canvas-bg"
      :canvas-id="elBgId"
      :style="{
        width: widthPx + 'px',
        height: widthPx + 'px'
      }"
    ></canvas>
    <canvas
      class="u-canvas"
      :canvas-id="elId"
      :style="{
        width: widthPx + 'px',
        height: widthPx + 'px'
      }"
    ></canvas>
    <slot></slot>
  </view>
</template>

<script>
/**
 * circleProgress 環形進度條
 * @description 展示操作或任務的當前進度，比如上傳文件，是一個圓形的進度條。注意：此組件的percent值只能動態增加，不能動態減少。
 * @property {String Number} percent 圓環進度百分比值，為數值類型，0-100
 * @property {String} inactive-color 圓環的底色，默認為灰色(該值無法動態變更)（默認#ececec）
 * @property {String} active-color 圓環激活部分的顏色(該值無法動態變更)（默認#19be6b）
 * @property {String Number} width 整個圓環組件的寬度，高度默認等於寬度值，單位rpx（默認200）
 * @property {String Number} border-width 圓環的邊框寬度，單位rpx（默認14）
 * @property {String Number} duration 整個圓環執行一圈的時間，單位ms（默認呢1500）
 * @property {String} type 如設置，active-color值將會失效
 * @property {String} bg-color 整個組件背景顏色，默認為白色
 * @example <u-circle-progress active-color="#2979ff" :percent="80"></u-circle-progress>
 */
import guid from "@/common/utils/guid";
export default {
  name: "u-circle-progress",
  props: {
    // 圓環進度百分比值
    percent: {
      type: Number,
      default: 0,
      // 限制值在0到100之間
      validator: val => {
        return val >= 0 && val <= 100;
      }
    },
    // 底部圓環的顏色（灰色的圓環）
    inactiveColor: {
      type: String,
      default: "#ececec"
    },
    // 圓環激活部分的顏色
    activeColor: {
      type: String,
      default: "#f44"
    },
    // 圓環線條的寬度，單位rpx
    borderWidth: {
      type: [Number, String],
      default: 10
    },
    // 整個圓形的寬度，單位rpx
    width: {
      type: [Number, String],
      default: 200
    },
    // 整個圓環執行一圈的時間，單位ms
    duration: {
      type: [Number, String],
      default: 1500
    },
    // 整個圓環進度區域的背景色
    bgColor: {
      type: String,
      default: "#ffffff"
    }
  },
  data() {
    return {
      // #ifdef MP-WEIXIN
      elBgId: "uCircleProgressBgId", // 微信小程序中不能使用this.$u.guid()形式動態生成id值，否則會報錯
      elId: "uCircleProgressElId",
      // #endif
      // #ifndef MP-WEIXIN
      elBgId: guid(), // 非微信端的時候，需用動態的id，否則一個頁面多個圓形進度條組件數據會混亂
      elId: guid(),
      // #endif
      widthPx: uni.upx2px(this.width), // 轉成px後的整個組件的背景寬度
      borderWidthPx: uni.upx2px(this.borderWidth), // 轉成px後的圓環的寬度
      startAngle: -Math.PI / 2, // canvas畫圓的起始角度，默認為3點鐘方向，定位到12點鐘方向
      progressContext: null, // 活動圓的canvas上下文
      newPercent: 0, // 當動態修改進度值的時候，保存進度值的變化前後值，用於比較用
      oldPercent: 0 // 當動態修改進度值的時候，保存進度值的變化前後值，用於比較用
    };
  },
  watch: {
    percent(nVal, oVal = 0) {
      if (nVal > 100) nVal = 100;
      if (nVal < 0) oVal = 0;
      // 此值其實等於this.percent，命名一個新
      this.newPercent = nVal;
      this.oldPercent = oVal;
      setTimeout(() => {
        // 無論是百分比值增加還是減少，需要操作還是原來的舊的百分比值
        // 將此值減少或者新增到新的百分比值
        this.drawCircleByProgress(oVal);
      }, 50);
    }
  },
  created() {
    // 賦值，用於加載後第一個畫圓使用
    this.newPercent = this.percent;
    this.oldPercent = 0;
  },
  computed: {
    // 有type主題時，優先起作用
    circleColor() {
      return this.activeColor;
    }
  },
  mounted() {
    // 在h5端，必須要做一點延時才起作用，this.$nextTick()無效(HX2.4.7)
    setTimeout(() => {
      this.drawProgressBg();
      this.drawCircleByProgress(this.oldPercent);
    }, 50);
  },
  methods: {
    drawProgressBg() {
      let ctx = uni.createCanvasContext(this.elBgId, this);
      ctx.setLineWidth(this.borderWidthPx); // 設置圓環寬度
      ctx.setStrokeStyle(this.inactiveColor); // 線條顏色
      ctx.beginPath(); // 開始描繪路徑
      // 設置一個原點(110,110)，半徑為100的圓的路徑到當前路徑
      let radius = this.widthPx / 2;
      ctx.arc(
        radius,
        radius,
        radius - this.borderWidthPx,
        0,
        2 * Math.PI,
        false
      );
      ctx.stroke(); // 對路徑進行描繪
      ctx.draw();
    },
    drawCircleByProgress(progress) {
      // 第一次操作進度環時將上下文保存到了this.data中，直接使用即可
      let ctx = this.progressContext;
      if (!ctx) {
        ctx = uni.createCanvasContext(this.elId, this);
        this.progressContext = ctx;
      }
      // 表示進度的兩端為圓形
      ctx.setLineCap("round");
      // 設置線條的寬度和顏色
      ctx.setLineWidth(this.borderWidthPx);
      ctx.setStrokeStyle(this.circleColor);
      // 將總過渡時間除以100，得出每修改百分之一進度所需的時間
      let time = Math.floor(this.duration / 100);
      // 結束角的計算依據為：將2π分為100份，乘以當前的進度值，得出終止點的弧度值，加起始角，為整個圓從默認的
      // 3點鐘方向开始画图，轉為更好理解的12點鐘方向开始作图，這需要起始角和終止角同時加上this.startAngle值
      let endAngle = ((2 * Math.PI) / 100) * progress + this.startAngle;
      ctx.beginPath();
      // 半徑為整个canvas寬度的一半
      let radius = this.widthPx / 2;
      ctx.arc(
        radius,
        radius,
        radius - this.borderWidthPx,
        this.startAngle,
        endAngle,
        false
      );
      ctx.stroke();
      ctx.draw();
      // 如果變更後新值大於舊值，意味著增大了百分比
      if (this.newPercent > this.oldPercent) {
        // 每次遞增百分之一
        progress++;
        // 如果新增後的值，大於需要設置的值百分比值，停止繼續增加
        if (progress > this.newPercent) return;
      } else {
        // 同理於上面
        progress--;
        if (progress < this.newPercent) return;
      }
      setTimeout(() => {
        // 定時器，每次操作間隔為time值，為了讓進度條有動畫效果
        this.drawCircleByProgress(progress);
      }, time);
    }
  }
};
</script>

<style lang="scss" scoped>
.u-circle-progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.u-canvas-bg {
  position: absolute;
}
.u-canvas {
  position: absolute;
}
</style>
