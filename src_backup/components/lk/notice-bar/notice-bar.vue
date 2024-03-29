<template>
  <view
    v-if="show"
    class="uni-noticebar"
    :style="{ background: background }"
    @click="onClick"
  >
    <!-- #ifdef MP-ALIPAY -->
    <view
      v-if="showClose === true || showClose === 'true'"
      class="uni-noticebar-close"
      @click="close"
    >
      <lk-icon name="cross" :color="color" />
    </view>
    <view
      v-if="showIcon === true || showIcon === 'true'"
      class="uni-noticebar-icon"
    >
      <lk-icon name="volume-o" :color="color" />
    </view>
    <!-- #endif -->
    <!-- #ifndef MP-ALIPAY -->
    <lk-icon
      v-if="showClose === true || showClose === 'true'"
      class="uni-noticebar-close"
      name="cross"
      :color="color"
      @click="close"
    />
    <lk-icon
      v-if="showIcon === true || showIcon === 'true'"
      class="uni-noticebar-icon"
      name="volume-o"
      :color="color"
    />
    <!-- #endif -->
    <view
      ref="textBox"
      class="uni-noticebar__content-wrapper"
      :class="{
        'uni-noticebar__content-wrapper--scrollable': scrollable,
        'uni-noticebar__content-wrapper--single':
          !scrollable && (single || moreText)
      }"
    >
      <view
        :id="elIdBox"
        class="uni-noticebar__content"
        :class="{
          'uni-noticebar__content--scrollable': scrollable,
          'uni-noticebar__content--single': !scrollable && (single || moreText)
        }"
      >
        <text
          :id="elId"
          ref="animationEle"
          class="uni-noticebar__content-text"
          :class="{
            'uni-noticebar__content-text--scrollable': scrollable,
            'uni-noticebar__content-text--single':
              !scrollable && (single || moreText)
          }"
          :style="{
            color: color,
            width: wrapWidth + 'px',
            animationDuration: animationDuration,
            '-webkit-animationDuration': animationDuration,
            animationPlayState: webviewHide ? 'paused' : animationPlayState,
            '-webkit-animationPlayState': webviewHide
              ? 'paused'
              : animationPlayState,
            animationDelay: animationDelay,
            '-webkit-animationDelay': animationDelay
          }"
          >{{ content }}</text
        >
      </view>
    </view>
    <view
      v-if="showGetMore === true || showGetMore === 'true'"
      class="uni-noticebar__more"
      @click="clickMore"
    >
      <text
        v-if="moreText"
        :style="{ color: moreColor }"
        class="uni-noticebar__more-text"
        >{{ moreText }}</text
      >
      <lk-icon name="arrow" :color="moreColor" />
    </view>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule("dom");
const animation = weex.requireModule("animation");
// #endif

/**
 * NoticeBar 自定義導航欄
 * @description 通告欄組件
 * @property {Number} speed 文字滾動的速度，默認100px/秒
 * @property {String} text 顯示文字
 * @property {String} background 背景顏色
 * @property {String} color 文字顏色
 * @property {String} moreColor 查看更多文字的顏色
 * @property {String} moreText 設置“查看更多”的文本
 * @property {Boolean} single = [true|false] 是否單行
 * @property {Boolean} scrollable = [true|false] 是否滾動，為true時，NoticeBar為单行
 * @property {Boolean} showIcon = [true|false] 是否顯示左側喇叭圖標
 * @property {Boolean} showClose = [true|false] 是否顯示左側關閉按鈕
 * @property {Boolean} showGetMore = [true|false] 是否顯示右側查看更多圖標，為true時，NoticeBar為单行
 * @event {Function} click 點擊 NoticeBar 觸發事件
 * @event {Function} close 關閉 NoticeBar 觸發事件
 * @event {Function} getmore 點擊”查看更多“時觸發事件
 */
export default {
  data() {
    const elId = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    const elIdBox = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    return {
      cname: "notice-bar",
      textWidth: 0,
      boxWidth: 0,
      wrapWidth: "",
      webviewHide: false,
      // #ifdef APP-NVUE
      stopAnimation: false,
      // #endif
      elId: elId,
      elIdBox: elIdBox,
      show: true,
      animationDuration: "none",
      animationPlayState: "paused",
      animationDelay: "0s"
    };
  },
  props: {
    text: {
      type: [String, Number],
      default: ""
    },
    moreText: {
      type: String,
      default: ""
    },
    background: {
      type: String,
      default: "#fffbe8"
    },
    speed: {
      // 默認1s滾動100px
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: "#de8c17"
    },
    moreColor: {
      type: String,
      default: "#999999"
    },
    single: {
      // 是否單行
      type: [Boolean, String],
      default: false
    },
    scrollable: {
      // 是否滾動，添加後控制單行效果取消
      type: [Boolean, String],
      default: false
    },
    showIcon: {
      // 是否顯示左側icon
      type: [Boolean, String],
      default: true
    },
    showGetMore: {
      // 是否顯示右側查看更多
      type: [Boolean, String],
      default: false
    },
    showClose: {
      // 是否顯示左側關閉按鈕
      type: [Boolean, String],
      default: false
    }
  },
  computed: {
    content() {
      let str = JSON.stringify(this.text);
      if (str.indexOf("\\n") != -1) {
        str = str.substr(1);
        str = str.substr(0, str.length - 1);
        str = str.replace(/\\n/g, "");
      } else {
        str = this.text;
      }
      return str;
    }
  },
  mounted() {
    // #ifdef APP-PLUS
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    var currentWebview = page.$getAppWebview();
    currentWebview.addEventListener("hide", () => {
      this.webviewHide = true;
    });
    currentWebview.addEventListener("show", () => {
      this.webviewHide = false;
    });
    // #endif
    this.$nextTick(() => {
      this.initSize();
    });
  },
  // #ifdef APP-NVUE
  beforeDestroy() {
    this.stopAnimation = true;
  },
  // #endif
  methods: {
    initSize() {
      if (this.scrollable) {
        // #ifndef APP-NVUE
        let query = [],
          boxWidth = 0,
          textWidth = 0;
        let textQuery = new Promise((resolve, reject) => {
          uni
            .createSelectorQuery()
            // #ifndef MP-ALIPAY
            .in(this)
            // #endif
            .select(`#${this.elId}`)
            .boundingClientRect()
            .exec(ret => {
              this.textWidth = ret[0].width;
              resolve();
            });
        });
        let boxQuery = new Promise((resolve, reject) => {
          uni
            .createSelectorQuery()
            // #ifndef MP-ALIPAY
            .in(this)
            // #endif
            .select(`#${this.elIdBox}`)
            .boundingClientRect()
            .exec(ret => {
              this.boxWidth = ret[0].width;
              resolve();
            });
        });
        query.push(textQuery);
        query.push(boxQuery);
        Promise.all(query).then(() => {
          this.animationDuration = `${this.textWidth / this.speed}s`;
          this.animationDelay = `-${this.boxWidth / this.speed}s`;
          setTimeout(() => {
            this.animationPlayState = "running";
          }, 1000);
        });
        // #endif
        // #ifdef APP-NVUE
        dom.getComponentRect(this.$refs["animationEle"], res => {
          let winWidth = uni.getSystemInfoSync().windowWidth;
          this.textWidth = res.size.width;
          animation.transition(
            this.$refs["animationEle"],
            {
              styles: {
                transform: `translateX(-${winWidth}px)`
              },
              duration: 0,
              timingFunction: "linear",
              delay: 0
            },
            () => {
              if (!this.stopAnimation) {
                animation.transition(
                  this.$refs["animationEle"],
                  {
                    styles: {
                      transform: `translateX(-${this.textWidth}px)`
                    },
                    timingFunction: "linear",
                    duration: ((this.textWidth - winWidth) / this.speed) * 1000,
                    delay: 1000
                  },
                  () => {
                    if (!this.stopAnimation) {
                      this.loopAnimation();
                    }
                  }
                );
              }
            }
          );
        });
        // #endif
      }
      // #ifdef APP-NVUE
      if (!this.scrollable && (this.single || this.moreText)) {
        dom.getComponentRect(this.$refs["textBox"], res => {
          this.wrapWidth = res.size.width;
        });
      }
      // #endif
    },
    loopAnimation() {
      // #ifdef APP-NVUE
      animation.transition(
        this.$refs["animationEle"],
        {
          styles: {
            transform: `translateX(0px)`
          },
          duration: 0
        },
        () => {
          if (!this.stopAnimation) {
            animation.transition(
              this.$refs["animationEle"],
              {
                styles: {
                  transform: `translateX(-${this.textWidth}px)`
                },
                duration: (this.textWidth / this.speed) * 1000,
                timingFunction: "linear",
                delay: 0
              },
              () => {
                if (!this.stopAnimation) {
                  this.loopAnimation();
                }
              }
            );
          }
        }
      );
      // #endif
    },
    clickMore() {
      this.$emit("getmore");
    },
    close() {
      this.show = false;
      this.$emit("close");
    },
    onClick() {
      this.$emit("click");
    }
  }
};
</script>

<style scoped lang="scss">
.uni-noticebar {
  /* #ifndef APP-NVUE */
  display: flex;
  width: 100%;
  box-sizing: border-box;
  /* #endif */
  flex-direction: row;
  align-items: center;
  padding: 0px 30rpx;
  line-height: 48rpx;
  height: 80rpx;
}

.uni-noticebar-close {
  margin-right: 10rpx;
}

.uni-noticebar-icon {
  margin-right: 10rpx;
}

.uni-noticebar__content-wrapper {
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.uni-noticebar__content-wrapper--single {
  /* #ifndef APP-NVUE */
  line-height: 36rpx;
  /* #endif */
}

.uni-noticebar__content-wrapper--single,
.uni-noticebar__content-wrapper--scrollable {
  flex-direction: row;
}

/* #ifndef APP-NVUE */
.uni-noticebar__content-wrapper--scrollable {
  position: relative;
  height: 36rpx;
}
/* #endif */

.uni-noticebar__content--scrollable {
  /* #ifdef APP-NVUE */
  flex: 0;
  /* #endif */
  /* #ifndef APP-NVUE */
  flex: 1;
  display: block;
  overflow: hidden;
  /* #endif */
}

.uni-noticebar__content--single {
  /* #ifndef APP-NVUE */
  display: flex;
  flex: none;
  width: 100%;
  justify-content: center;
  /* #endif */
}

.uni-noticebar__content-text {
  font-size: $font-size;
  line-height: 36rpx;
  /* #ifndef APP-NVUE */
  word-break: break-all;
  /* #endif */
}

.uni-noticebar__content-text--single {
  /* #ifdef APP-NVUE */
  lines: 1;
  /* #endif */
  /* #ifndef APP-NVUE */
  display: block;
  width: 100%;
  white-space: nowrap;
  /* #endif */
  overflow: hidden;
  text-overflow: ellipsis;
}

.uni-noticebar__content-text--scrollable {
  /* #ifdef APP-NVUE */
  lines: 1;
  padding-left: 750rpx;
  /* #endif */
  /* #ifndef APP-NVUE */
  position: absolute;
  display: block;
  height: 36rpx;
  line-height: 36rpx;
  white-space: nowrap;
  padding-left: 100%;
  animation: notice 10s 0s linear infinite both;
  animation-play-state: paused;
  /* #endif */
}

.uni-noticebar__more {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding-left: 10rpx;
}

.uni-noticebar__more-text {
  font-size: $font-size;
}

@keyframes notice {
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
