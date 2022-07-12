<template>
  <view class="pages">
    <view class="info">
      <view class="head" :style="headerStyle">
        <view class="title">{{ typeToUpperCase }}</view>
        <view class="text">
          <text>{{ info.address }}</text>
          <lk-icon class-prefix="v-icon" name="v-icon-copy" @click="onCopy" />
        </view>
      </view>
      <view class="qr-box">
        <view class="img">
          <image :src="info.qrCode" />
        </view>
        <view class="text">收款二維碼</view>
      </view>
    </view>
  </view>
</template>

<script>
import blockchain from "./mixin";
import $System from "@/api/system";
import { formatStyle } from "@/common/utils/stringify";
export default {
  name: "packages-blockchain-wallet",
  data() {
    return {
      info: {
        symbol: "",
        address: ""
      }
    };
  },
  mixins: [blockchain],
  computed: {
    typeToUpperCase() {
      return this.pageType.toUpperCase();
    },
    headerStyle() {
      return formatStyle({
        background: this.theme.gradient
      });
    }
  },
  onLoad(query) {},
  methods: {
    blockchainBaseDataCall(data) {
      this.info = data;
    },
    onCopy() {
      if (this.info.address) {
        $System.setClipboardData(this.info.address);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  border-radius: 16rpx;
  overflow: hidden;
  margin: 60rpx;
}

.info .head {
  background: $image-background;
  padding: $cell-padding;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  line-height: 1.4;
}

.info .head .title {
  font-size: $font-size-lg;
}

.info .head .text {
  display: flex;
  align-items: center;
  width: 100%;
}

.info .head .text text {
  display: block;
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}

.info .qr-box {
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 0;
  width: 100%;
  padding: 50% 0;
  overflow: hidden;
  background: #ffffff;
}

.info .qr-box .img {
  height: 0;
  width: 70%;
  padding: 35% 0;
  overflow: hidden;
  background: #ffffff;
  position: relative;
}

.info .qr-box .img image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.info .qr-box .text {
  font-size: $font-size-sm;
  color: #909399;
  margin-top: 20rpx;
}
</style>
