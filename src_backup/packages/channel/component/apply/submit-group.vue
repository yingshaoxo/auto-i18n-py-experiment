<template>
  <view class="cell">
    <view class="cell-checkbox">
      <lk-checkbox-group>
        <lk-checkbox v-model="checked" :active-color="theme.color">
          我已閱讀並了解<text class="text-link" @click="showAgreement = true"
            >【{{ agreementText }}】</text
          >
        </lk-checkbox>
      </lk-checkbox-group>
    </view>
    <lk-popup v-model="showAgreement" :title="agreementText" round>
      <view class="contract">
        <lk-parser show-with-animation lazy-load :html="protocol"></lk-parser>
      </view>
    </lk-popup>
    <lk-button
      block
      round
      type="danger"
      :loading="loading"
      theme-color
      bing-mobile
      :disabled="!checked"
      @click="submit"
    >
      {{ btnText }}
    </lk-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      showAgreement: false
    };
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: "提交申請"
    },
    protocol: [Number, String]
  },
  computed: {
    agreementText() {
      return `申請協議`;
    }
  },
  methods: {
    submit() {
      this.$emit("submit", {});
    }
  }
};
</script>

<style lang="scss" scoped>
.cell {
  padding: $cell-padding;
  background: #ffffff;
}
.cell-checkbox {
  margin: 20rpx 0 40rpx;
}
.contract {
  width: 80vw;
  height: 60vh;
  overflow-y: auto;
}
</style>
