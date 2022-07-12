<template>
  <view class="u-radio">
    <view class="u-radio__icon-wrap" @tap="toggle">
      <lk-icon
        :class="iconClass"
        name="success"
        :size="iconSize"
        :color="iconColor"
        class="u-radio__icon"
        :style="[iconStyle]"
      />
    </view>
    <view class="u-label-class u-radio__label" @tap="onClickLabel">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // radio的名稱
    name: {
      type: [String, Number],
      default: ""
    },
    // 形狀，square為方形，circle為原型
    shape: {
      type: String,
      default: "circle"
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否禁止點擊提示語選中復選框
    labelDisabled: {
      type: Boolean,
      default: false
    },
    // 選中狀態下的顏色，如設置此值，將會覆蓋radioGroup的activeColor值
    activeColor: {
      type: String,
      default: ""
    },
    // 圖標的大小，單位rpx
    iconSize: {
      type: [String, Number],
      default: 14
    }
  },
  inject: ["radioGroup"],
  data() {
    return {
      parentDisabled: false
    };
  },
  created() {
    this.parentDisabled = this.radioGroup.disabled;
  },
  computed: {
    // 設置radio的狀態，要求radio的name等於radioGroup的value時才為選中狀態
    iconStyle() {
      let style = {};
      if (
        this.radioActiveColor &&
        this.name == this.radioGroup.value &&
        !this.disabled &&
        !this.parentDisabled
      ) {
        style.borderColor = this.radioActiveColor;
        style.backgroundColor = this.radioActiveColor;
      }
      return style;
    },
    iconColor() {
      return this.name == this.radioGroup.value ? "#ffffff" : "transparent";
    },
    iconClass() {
      let classs = [];
      classs.push("u-radio__icon--" + this.shape);
      if (this.name == this.radioGroup.value)
        classs.push("u-radio__icon--checked");
      if (this.disabled || this.parentDisabled)
        classs.push("u-radio__icon--disabled");
      if (
        this.name == this.radioGroup.value &&
        (this.disabled || this.parentDisabled)
      )
        classs.push("u-radio__icon--disabled--checked");
      return classs;
    },
    // 激活的顏色，可能受radioGroup和本組件的activeColor影響
    // 本組件的activeColor值優先
    radioActiveColor() {
      return this.activeColor ? this.activeColor : this.radioGroup.activeColor;
    }
  },
  methods: {
    onClickLabel() {
      if (!this.disabled && !this.labelDisabled && !this.parentDisabled) {
        this.radioGroup.setValue(this.name);
        this.emitEvent();
      }
    },
    toggle() {
      if (!this.disabled && !this.parentDisabled) {
        this.radioGroup.setValue(this.name);
        this.emitEvent();
      }
    },
    emitEvent() {
      this.$emit("change", this.name);
    }
  }
};
</script>

<style lang="scss" scoped>
.u-radio {
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
}

.u-radio__icon-wrap,
.u-radio__label {
  color: $text-color;
}

.u-radio__icon-wrap {
  -webkit-flex: none;
  flex: none;
}

.u-radio__icon {
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  width: 42rpx;
  height: 42rpx;
  color: transparent;
  text-align: center;
  transition-property: color, border-color, background-color;
  font-size: 28rpx;
  border: 2rpx solid #c8c9cc;
  transition-duration: 0.2s;
}

.u-radio__icon--circle {
  border-radius: 100%;
}

.u-radio__icon--square {
  border-radius: 6rpx;
}

.u-radio__icon--checked {
  color: #fff;
  background-color: $blue;
  border-color: $blue;
}

.u-radio__icon--disabled {
  background-color: #ebedf0;
  border-color: #c8c9cc;
}

.u-radio__icon--disabled--checked {
  color: #c8c9cc !important;
}

.u-radio__label {
  word-wrap: break-word;
  margin-left: 10rpx;
  margin-right: 18rpx;
  color: $text-color;
  font-size: $font-size;
  flex: 1;
}

.u-radio__label--disabled {
  color: #c8c9cc;
}

.u-radio__label:empty {
  margin: 0;
}
</style>
