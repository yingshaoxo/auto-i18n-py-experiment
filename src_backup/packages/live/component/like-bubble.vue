<template>
  <canvas canvas-id="bubble" :style="styles" class="like-fx"></canvas>
</template>

<script>
let queue = {};
let timer = 0;
let ctx = null;
const badges = {};
import { formatStyle } from "@/common/utils/stringify";
export default {
  props: {
    count: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 180
    },
    height: {
      type: Number,
      default: 300
    },
    customStyle: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    /**點贊個數變化 */
    count(newVal, oldVal) {
      if (newVal - oldVal > 0) {
        this.likeClick();
      }
    }
  },
  computed: {
    styles() {
      return formatStyle({
        width: this.width + "px",
        height: this.height + "px",
        ...this.customStyle
      });
    }
  },
  mounted() {
    ctx = uni.createCanvasContext("bubble", this);
    queue = {};
  },
  methods: {
    /**點贊 */
    likeClick() {
      // #ifndef MP
      const image = require("../static/images/" +
        this.getRandomInt(1, 24) +
        ".png");
      // #endif
      // #ifdef MP
      const image = "../static/images/" + this.getRandomInt(1, 24) + ".png";
      // #endif
      const anmationData = {
        id: new Date().getTime(),
        timer: 0,
        opacity: 0.5,
        pathData: this.generatePathData(),
        image: image,
        factor: {
          speed: 0.004, // 運動速度，值越小越慢
          t: 0 //  貝塞爾函數系數
        }
      };
      if (Object.keys(queue).length > 0) {
        queue[anmationData.id] = anmationData;
      } else {
        queue[anmationData.id] = anmationData;
        this.bubbleAnimate();
      }
    },
    /**獲取最大最小隨機值 */
    getRandom(min, max) {
      return Math.random() * (max - min) + min;
    },
    /**獲取最大最小之前隨機值的整數 */
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    /**獲取圖片路徑 */
    generatePathData() {
      let width = this.width,
        height = this.height;
      const p0 = {
        x: 0.72 * width,
        y: height
      };
      const p1 = {
        x: this.getRandom(0.22 * width, 0.33 * width),
        y: this.getRandom(0.5 * height, 0.75 * height)
      };
      const p2 = {
        x: this.getRandom(0, 0.88 * width),
        y: this.getRandom(0.25 * height, 0.5 * height)
      };
      const p3 = {
        x: this.getRandom(0, 0.88 * width),
        y: this.getRandom(0, 0.125 * height)
      };
      return [p0, p1, p2, p3];
    },
    /**更新圖片的最新運動路徑 */
    updatePath(data, factor) {
      const p0 = data[0];
      const p1 = data[1];
      const p2 = data[2];
      const p3 = data[3];

      const t = factor.t;

      /*計算多項式系數 （下同）*/
      const cx1 = 3 * (p1.x - p0.x);
      const bx1 = 3 * (p2.x - p1.x) - cx1;
      const ax1 = p3.x - p0.x - cx1 - bx1;

      const cy1 = 3 * (p1.y - p0.y);
      const by1 = 3 * (p2.y - p1.y) - cy1;
      const ay1 = p3.y - p0.y - cy1 - by1;

      const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
      const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
      return {
        x,
        y
      };
    },
    /**點贊动画 */
    bubbleAnimate() {
      let width = this.width,
        height = this.height;
      Object.keys(queue).forEach(key => {
        const anmationData = queue[+key];
        const { x, y } = this.updatePath(
          anmationData.pathData,
          anmationData.factor
        );
        const speed = anmationData.factor.speed;
        anmationData.factor.t += speed;

        var curWidth = 30;
        curWidth = (height - y) / 1.5;
        curWidth = Math.min(30, curWidth);

        var curAlpha = anmationData.opacity;
        curAlpha = y / height;
        curAlpha = Math.min(1, curAlpha);
        ctx.globalAlpha = curAlpha;
        ctx.drawImage(
          anmationData.image,
          x - curWidth / 2,
          y,
          curWidth,
          curWidth
        );
        if (anmationData.factor.t > 1) {
          delete queue[anmationData.id];
        }
        if (y > height) {
          delete queue[anmationData.id];
        }
      });
      ctx.draw();
      if (Object.keys(queue).length > 0) {
        timer = setTimeout(() => {
          this.bubbleAnimate();
        }, 5);
      } else {
        clearTimeout(timer);
        ctx.draw(); // 清空畫面
      }
    }
  },
  destroyed() {
    if (timer) {
      clearTimeout(timer);
    }
  }
};
</script>

<style lang="scss" scoped>
.like-fx {
  position: fixed;
  right: 0;
  bottom: 100rpx;
  z-index: 998;
  pointer-events: none;
}
</style>
