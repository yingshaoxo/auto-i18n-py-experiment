<template>
  <view class="header" :style="{ background: theme.gradient }">
    <view class="shop-info">
      <view class="logo">
        <view class="image">
          <image :src="info.shop_logo" />
        </view>
      </view>
      <view class="name">
        {{ info.shop_name || "" }}
      </view>
      <view class="time">
        {{ timeText }}
      </view>
    </view>
    <view class="item-card">
      <view class="receive-info" :style="receiveColor">
        <view class="image">
          <image :src="info.pic_cover_mid" />
        </view>
        <view class="text">
          <view class="name">{{ info.giftvoucher_name }}</view>
        </view>
        <view>
          <lk-button
            size="small"
            bing-mobile
            round
            :color="theme.gradient"
            :disabled="btnDisabled"
            :loading="isLoading"
            @click="onReceive"
          >
            {{ btnText }}
          </lk-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatDate, yuan } from "@/common/utils";
import { RECEIVE_GIFVOUCHER } from "@/common/interface/giftvoucher";
export default {
  data() {
    return {
      isLoading: false,
      is_giftvoucher: this.info.is_giftvoucher
    };
  },
  props: {
    info: Object
  },
  computed: {
    timeText() {
      if (this.info.start_time && this.info.end_time) {
        return `有限期 ${formatDate(this.info.start_time)} ~ ${formatDate(
          this.info.end_time
        )}`;
      }
    },
    receiveColor() {
      let colors = "";
      if (!this.btnDisabled) {
        colors = "color:" + this.theme.color;
      }
      return colors;
    },
    btnDisabled() {
      let flag = false;
      if (
        this.info.is_giftvoucher == 0 ||
        this.info.is_giftvoucher == -1 ||
        this.info.is_giftvoucher == -2
      ) {
        flag = true;
      }
      return flag;
    },
    btnText() {
      let text = "";
      if (this.info.is_giftvoucher === 0) {
        text = "已領取";
      } else if (this.info.is_giftvoucher > 0) {
        text = "立即領取";
      } else if (this.info.is_giftvoucher == -1) {
        text = "未開始";
      } else if (this.info.is_giftvoucher == -2) {
        text = "已過期";
      }
      return text;
    }
  },
  methods: {
    onReceive() {
      let params = {
        gift_voucher_id: this.info.gift_voucher_id,
        get_type: 1 // 接口規定復制鍊接領取領取標識
      };
      this.isLoading = true;
      RECEIVE_GIFVOUCHER(params)
        .then(res => {
          this.isLoading = false;
          this.$Prompt.toast({ title: "領取成功", icon: "success" });
          this.$emit("success");
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: $cell-padding;
  .shop-info {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: #ffffff;
    line-height: 48rpx;
    .name {
      color: #ffffff;
    }
    .time {
      font-size: $font-size-sm;
    }
    .logo {
      width: 200rpx;
      border-radius: 16rpx;
      overflow: hidden;
      .image {
        padding-bottom: 56%;
        width: 100%;
        position: relative;
        image {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: $image-background;
        }
      }
    }
  }
  .item-card {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 8rpx;
    margin-top: 20rpx;
    padding: 20rpx 30rpx;
    position: relative;
    overflow: hidden;
    width: 80%;
    color: $text-gray;
  }

  .item-card::after,
  .item-card::before {
    content: "";
    display: block;
    position: absolute;
    width: 32rpx;
    height: 32rpx;
    background: #f8f8f8;
    border-radius: 50%;
    top: 50%;
    margin-top: -16rpx;
  }

  .item-card::after {
    right: -16rpx;
  }

  .item-card::before {
    left: -16rpx;
  }

  .item-card .receive-info {
    flex: 1;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    height: 100rpx;
    .image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 8rpx;
      overflow: hidden;
      background-color: $image-background;
      margin-right: 10rpx;
      image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .text {
      flex: 1;
      font-size: $font-size-sm;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
      }
    }
  }
}
</style>
