<template>
  <view class="u-checkbox">
    <view class="u-checkbox__icon-wrap" @tap="toggle">
      <lk-icon
        :class="iconClass"
        name="success"
        :size="iconSize"
        :color="iconColor"
        class="u-checkbox__icon"
        :style="[iconStyle]"
      />
    </view>
    <view class="u-label-class u-checkbox__label" @tap="toggle('label')">
      <slot />
    </view>
  </view>
</template>

<script>
import { basic } from "../../mixin";
import create from "@/common/utils/create";
import { formatClass, formatStyle } from "@/common/utils/stringify";
import { pxTorpx, isDef } from "@/common/utils";

const bem = create("checkbox");

export default {
  data() {
    return {
      cname: "checkbox",
      parentDisabled: false
    };
  },
  props: {
    // checkbox的名稱
    name: {
      type: [String, Number],
      default: ""
    },
    // 形狀，square為方形，circle為原型
    shape: {
      type: String,
      default: "circle"
    },
    // 是否為選中狀態
    value: null,
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
    // 選中狀態下的顏色，如設置此值，將會覆蓋checkboxGroup的activeColor值
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
  inject: ["checkboxGroup"],
  watch: {
    value(val) {
      this.$emit("change", val);
    }
  },
  created() {},
  computed: {
    iconStyle() {
      let style = {};
      if (this.checkboxActiveColor && this.checked && !this.isDisabled) {
        style.borderColor = this.checkboxActiveColor;
        style.backgroundColor = this.checkboxActiveColor;
      }
      return style;
    },
    iconColor() {
      return this.checked ? "#ffffff" : "transparent";
    },
    iconClass() {
      let classs = [];
      classs.push("u-checkbox__icon--" + this.shape);
      if (this.checked == true) classs.push("u-checkbox__icon--checked");
      if (this.isDisabled) classs.push("u-checkbox__icon--disabled");
      if (this.checked && this.isDisabled)
        classs.push("u-checkbox__icon--disabled--checked");
      return classs;
    },
    // 激活的顏色，可能受checkboxGroup和本組件的activeColor影響
    // 本組件的activeColor值優先
    checkboxActiveColor() {
      return (
        this.activeColor ||
        (this.checkboxGroup && this.checkboxGroup.activeColor
          ? this.checkboxGroup.activeColor
          : this.activeColor)
      );
    },
    // 單獨使用
    aloneUse() {
      return typeof this.value == "boolean";
    },

    checked: {
      get() {
        return !this.aloneUse && this.checkboxGroup
          ? this.checkboxGroup.value.indexOf(this.name) !== -1
          : this.value;
      },

      set(val) {
        const { checkboxGroup } = this;
        if (!this.aloneUse && checkboxGroup) {
          const parentValue = this.checkboxGroup.value.slice();
          if (val) {
            if (checkboxGroup.max && parentValue.length >= checkboxGroup.max) {
              return;
            }
            /* istanbul ignore else */
            if (parentValue.indexOf(this.name) === -1) {
              parentValue.push(this.name);
              checkboxGroup.$emit("input", parentValue);
              checkboxGroup.$emit("change", parentValue);
            }
          } else {
            const index = parentValue.indexOf(this.name);
            /* istanbul ignore else */
            if (index !== -1) {
              parentValue.splice(index, 1);
              checkboxGroup.$emit("input", parentValue);
              checkboxGroup.$emit("change", parentValue);
            }
          }
        } else {
          this.$emit("input", val);
          this.$emit("change", val);
        }
      }
    },

    isDisabled() {
      return (
        (this.checkboxGroup && this.checkboxGroup.disabled) || this.disabled
      );
    }
  },
  methods: {
    toggle(target) {
      if (!this.isDisabled && !(target === "label" && this.labelDisabled)) {
        this.checked = !this.checked;
        this.$emit("click", this.checked);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-checkbox {
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
}

.u-checkbox__icon-wrap,
.u-checkbox__label {
  color: $text-color;
}

.u-checkbox__icon-wrap {
  -webkit-flex: none;
  flex: none;
}

.u-checkbox__icon {
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

.u-checkbox__icon--circle {
  border-radius: 100%;
}

.u-checkbox__icon--square {
  border-radius: 6rpx;
}

.u-checkbox__icon--checked {
  color: #fff;
  background-color: $blue;
  border-color: $blue;
}

.u-checkbox__icon--disabled {
  background-color: #ebedf0;
  border-color: #c8c9cc;
}

.u-checkbox__icon--disabled--checked {
  color: #c8c9cc !important;
}

.u-checkbox__label {
  word-wrap: break-word;
  margin-left: 10rpx;
  margin-right: 18rpx;
  color: $text-color;
  font-size: $font-size;
  flex: 1;
}

.u-checkbox__label--disabled {
  color: #c8c9cc;
}

.u-checkbox__label:empty {
  margin: 0;
}
</style>
