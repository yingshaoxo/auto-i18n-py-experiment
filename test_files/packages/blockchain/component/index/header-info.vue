<template>
  <view class="header" :style="headerStyle">
    <view class="title">{{ symbol }}</view>
    <view class="balance-money">
      <text class="balance">{{ balance || 0 }}</text>
      <text class="money">≈ {{ money_text }}</text>
      <view class="btn-updata" :class="updataingClass">
        <lk-icon name="replay" @click="click" />
      </view>
    </view>
    <view class="foot">
      <view class="icon-text" @click="toLink('/packages/blockchain/wallet')">
        <lk-icon name="v-icon-qr3" class-prefix="v-icon" />
        <text class="text">錢包地址</text>
      </view>
      <view class="btn">
        <lk-button
          round
          size="small"
          @click="toLink('/packages/blockchain/trade/log')"
          >交易明細</lk-button
        >
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { yuan } from "@/common/utils";
import { formatStyle } from "@/common/utils/stringify";
export default {
  data() {
    return {};
  },
  props: {
    type: String,
    symbol: {
      type: String,
      default: ""
    },
    balance: {
      type: [String, Number],
      default: ""
    },
    money_text: {
      type: [String, Number],
      default: ""
    },
    updating: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      blockchainInfo: ({ blockchain }) => blockchain
    }),
    headerStyle() {
      return formatStyle({
        background: this.theme.gradient
      });
    },
    info() {
      return this.blockchainInfo[this.type] || {};
    },
    typeToUpperCase() {
      return this.type.toUpperCase();
    },
    updataingClass() {
      return this.updating ? "updating" : "";
    }
  },
  methods: {
    click() {
      if (this.updating) {
        return;
      }
      this.$emit("update");
    },
    toLink(path) {
      this.$Navigate.push({
        path,
        query: {
          type: this.type
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  padding: $cell-padding;
  background-color: $image-background;
  color: #fff;
  line-height: 1.2;
}

.header .title {
  font-size: $font-size-lg;
  font-weight: 800;
}

.header .balance-money {
  margin: 16rpx 0;
  display: flex;
  align-items: center;
}

.header .balance {
  font-weight: 800;
  font-size: $font-size-lg;
  padding-right: 8rpx;
}

.header .foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-text {
  display: flex;
  align-items: center;
  .text {
    padding-left: 10rpx;
  }
}

.btn-updata {
  font-size: $font-size-lg;
  margin: 0 16rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-updata.updating {
  animation: updating 1s infinite linear;
}

@keyframes updating {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
