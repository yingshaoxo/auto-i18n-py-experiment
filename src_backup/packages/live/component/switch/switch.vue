<template>
  <view
    class="u-switch"
    :class="[
      value == true ? 'u-switch--on' : '',
      disabled ? 'u-switch--disabled' : ''
    ]"
    @tap="onClick"
    :style="[switchStyle]"
  >
    <view
      class="u-switch__node node-class"
      :style="{
        width: nodeWidth,
        height: nodeHeight
      }"
    >
      <text class="u-switch__text" v-if="text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
/**
 * switch 開關選擇器
 * @description 選擇開關一般用於只有兩個選擇，且只能選其一的場景。
 * @property {Boolean} loading 是否處於加載中（默認false）
 * @property {Boolean} disabled 是否禁用（默認false）
 * @property {String Number} size 開關尺寸，單位rpx（默認50）
 * @property {String} active-color 打開時的背景色（默認#2979ff）
 * @property {Boolean} inactive-color 關閉時的背景色（默認#ffffff）
 * @property {Boolean | Number | String} active-value 打開選擇器時通過change事件發出的值（默認true）
 * @property {Boolean | Number | String} inactive-value 關閉選擇器時通過change事件發出的值（默認false）
 * @event {Function} change 在switch打開或關閉時觸發
 * @example <u-switch v-model="checked" active-color="red" inactive-color="#eee"></u-switch>
 */
export default {
  name: "u-switch",
  props: {
    // 是否為加載中狀態
    loading: {
      type: Boolean,
      default: false
    },
    // 是否為禁用裝填
    disabled: {
      type: Boolean,
      default: false
    },
    // 開關尺寸，單位rpx
    size: {
      type: [Number, String],
      default: 50
    },
    // 打開時的背景顏色
    activeColor: {
      type: String,
      default: "#2979ff"
    },
    // 關閉時的背景顏色
    inactiveColor: {
      type: String,
      default: "#ffffff"
    },
    // 通過v-model雙向綁定的值
    value: {
      type: Boolean,
      default: false
    },
    // 是否使手機發生短促震動，目前只在iOS的微信小程序有效(2020-05-06)
    vibrateShort: {
      type: Boolean,
      default: false
    },
    // 打開選擇器時的值
    activeValue: {
      type: [Number, String, Boolean],
      default: true
    },
    // 關閉選擇器時的值
    inactiveValue: {
      type: [Number, String, Boolean],
      default: false
    },
    text: String
  },
  data() {
    return {};
  },
  computed: {
    switchStyle() {
      let style = {};
      style.fontSize = this.size + "rpx";
      style.backgroundColor = this.value
        ? this.activeColor
        : this.inactiveColor;
      return style;
    },
    loadingColor() {
      return this.value ? this.activeColor : null;
    },
    nodeWidth() {
      return this.size + "rpx";
    },
    nodeHeight() {
      return this.size + "rpx";
    }
  },
  methods: {
    onClick() {
      if (!this.disabled && !this.loading) {
        // 使手機產生短促震動，微信小程序有效，APP(HX 2.6.8)龢H5無效
        if (this.vibrateShort) uni.vibrateShort();
        this.$emit("input", !this.value);
        // 放到下一個生命週期，因為雙向綁定的value修改父組件狀態需要時間，且是異步的
        this.$nextTick(() => {
          this.$emit(
            "change",
            this.value ? this.activeValue : this.inactiveValue
          );
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-switch {
  position: relative;
  display: inline-block;
  box-sizing: initial;
  width: 2em;
  height: 1em;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1em;
  transition: background-color 0.3s;
  font-size: 50rpx;
}
.u-switch__node {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 100%;
  z-index: 1;
  background-color: #fff;
  background-color: #fff;
  box-shadow: 0 3px 1px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1),
    0 3px 3px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 3px 1px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1),
    0 3px 3px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
  transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05),
    -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
  transition: transform cubic-bezier(0.3, 1.05, 0.4, 1.05);
  transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
}
.u-switch__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}
.u-switch--on {
  background-color: #1989fa;
}
.u-switch--on .u-switch__node {
  transform: translateX(1em);
}
.u-switch--disabled {
  opacity: 0.4;
}
.u-switch__text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #999;
}
.u-switch--on .u-switch__text {
  color: #333;
}
</style>
