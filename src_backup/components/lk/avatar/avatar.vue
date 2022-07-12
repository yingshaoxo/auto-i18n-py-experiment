<template>
  <view class="u-avatar" :style="[wrapStyle]" @tap="click">
    <image
      @error="loadError"
      :style="[imgStyle]"
      class="u-avatar-img"
      v-if="!text && defaultAvatar"
      :src="defaultAvatar"
      :mode="imgMode"
    ></image>
    <text class="u-line-1" v-else-if="text">{{ text }}</text>
    <slot v-else></slot>
  </view>
</template>

<script>
/**
 * avatar 頭像
 * @description 本组件一般用于展示頭像的地方，如個人中心，或者评论列表页的用户頭像展示等场所。
 * @tutorial https://www.uviewui.com/components/avatar.html
 * @property {String} bg-color 背景顏色，一般顯示文字時用（默認#ffffff）
 * @property {String} src 頭像路径，如加載失敗，将会显示默認頭像
 * @property {String Number} size 頭像尺寸，可以為指定字符串(large, default, mini)，或者數值，單位rpx（默認default）
 * @property {String} mode 顯示類型，見上方說明（默認circle）
 * @property {String} text 用文字替代圖片，級別優先於src
 * @property {String} img-mode 頭像图片的裁剪类型，與uni的image組件的mode參數一致，如效果達不到需求，可嘗試傳widthFix值（默認aspectFill）
 * @property {String} index 用戶傳遞的標識符值，如果是列表循環，可穿v-for的index值
 * @event {Function} click 頭像被点击
 * @example <u-avatar :src="src"></u-avatar>
 */
import { mapGetters } from "vuex";
export default {
  name: "u-avatar",
  props: {
    // 背景顏色
    bgColor: {
      type: String,
      default: "transparent"
    },
    // 頭像路径
    src: {
      type: String,
      default: ""
    },
    // 尺寸，large-大，default-中等，mini-小，如果為數值，则單位为rpx
    // 寬度等於高度
    size: {
      type: [String, Number],
      default: "default"
    },
    // 頭像模型，square-帶圓角方形，circle-圓形
    mode: {
      type: String,
      default: "circle"
    },
    // 文字內容
    text: {
      type: String,
      default: ""
    },
    // 圖片的裁剪模型
    imgMode: {
      type: String,
      default: "aspectFill"
    },
    // 標識符
    index: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      error: false
    };
  },
  computed: {
    ...mapGetters(["static"]),
    wrapStyle() {
      let style = {};
      style.height =
        this.size == "large"
          ? "120rpx"
          : this.size == "default"
          ? "90rpx"
          : this.size == "mini"
          ? "70rpx"
          : this.size + "rpx";
      style.width = style.height;
      style.flex = `0 0 ${style.height}`;
      style.backgroundColor = this.bgColor;
      style.borderRadius = this.mode == "circle" ? "500px" : "5px";
      if (this.text) style.padding = `0 6rpx`;
      return style;
    },
    defaultAvatar() {
      if (!this.src) return this.static.noAvatar;
      else if (this.src && this.error) return this.static.noAvatar;
      else return this.src;
    },
    imgStyle() {
      let style = {};
      style.borderRadius = this.mode == "circle" ? "500px" : "5px";
      return style;
    }
  },
  methods: {
    // 圖片加載錯誤時，显示默認頭像
    loadError() {
      this.error = true;
    },
    click() {
      this.$emit("click", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.u-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: $text-color;
  border-radius: 10px;
  overflow: hidden;
}

.u-avatar-img {
  width: 100%;
  height: 100%;
}
</style>
