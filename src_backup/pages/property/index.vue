<template>
  <view class="pages">
    <view class="property-wrap">
      <view class="info" :style="{ background: infoBg }">
        <text class="text">餘額(元)</text>
        <view class="item">
          <view class="money">{{ member.info.balance }}</view>
          <view
            class="btn"
            @click="goPage('/packages/property/balance')"
            :style="{ color: infoColor }"
            >詳情</view
          >
        </view>
        <image class="info-image" :src="infoImageSrc"></image>
      </view>
    </view>
    <view class="card-group-box">
      <view class="info-box">
        <view
          class="item"
          v-for="(item, index) in infoList"
          :key="index"
          @click="goPage(item.route)"
        >
          <view class="item-box">
            <view class="item-text">
              <view class="item-text_title">{{ item.title }}</view>
              <view class="item-text_text">{{ item.text }}</view>
            </view>
            <image class="item-img" :src="item.iconSrc"></image>
          </view>
        </view>
      </view>
    </view>
    <!-- <view class="card-group-box">
      <view class="info-title">錢包工具</view>
      <view class="info-box wallet-box">
        <view
          class="item"
          v-for="(item, index) in walletList"
          :key="index"
          @click="goPage(item.route)"
        >
          <view class="item-box">
            <image
              class="item-img"
              :src="item.iconSrc"
              mode="aspectFit"
            ></image>
            <view class="item-text">
              <text class="item-text_text">{{ item.title }}</text>
              <text class="item-text_title">{{ item.text }}</text>
            </view>
          </view>
        </view>
      </view>
    </view> -->
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "pages-property-index",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      member: ({ member }) => member,
      addons: ({ config }) => config.addons
    }),
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    infoList() {
      const { coupontype, giftvoucher, store, receivegoodscode } = this.addons;
      let arr = [];
      // arr.push({
      //   title: this.member.texts.point_style,
      //   text: this.member.info.point,
      //   route: "/packages/property/points",
      //   iconSrc: `${this.$store.getters.static.baseImgPath}integral_icon.png`
      // });
      if (coupontype == 1) {
        arr.push({
          title: "優惠券",
          text: this.member.info.coupon_num,
          route: "/packages/coupon/list",
          iconSrc: `${this.$store.getters.static.baseImgPath}coupon_icon.png`
        });
      }
      if (giftvoucher == 1) {
        arr.push({
          title: "禮品券",
          text: this.member.info.giftvoucher_num,
          route: "/packages/giftvoucher/list",
          iconSrc: `${this.$store.getters.static.baseImgPath}gift_certificate.png`
        });
      }
      if (store == 1) {
        arr.push({
          title: "消費券",
          text: this.member.info.store_card_num,
          route: "/packages/consumercard/list",
          iconSrc: `${this.$store.getters.static.baseImgPath}consume_icon.png`
        });
      }
      if (receivegoodscode == 1) {
        arr.push({
          title: this.member.info.receivegoodscode.copy_writing,
          text: this.member.info.receivegoodscode.count,
          route: "/packages/deliverycode/list",
          iconSrc: `${this.$store.getters.static.baseImgPath}take_icon.png`
        });
      }
      return arr;
    },
    walletList() {
      const { blockchain } = this.addons;
      let walletListArr = [];
      walletListArr.push({
        title: "賬號列表",
        text: "提現賬號管理",
        route: "/packages/property/account/list",
        iconSrc: `${this.$store.getters.static.baseImgPath}account_list.png`
      });
      if (blockchain == 1) {
        walletListArr.push({
          title: "數字錢包",
          // text: this.member.info.digital_assets ? this.member.info.digital_assets: '去中心化資產',
          text: "去中心化資產",
          route: "/pages/blockchain/list",
          iconSrc: `${this.$store.getters.static.baseImgPath}wallets_icon.png`
        });
      }
      return walletListArr;
    },
    infoImageSrc() {
      return `${this.$store.getters.static.baseImgPath}property_bg.png`;
    },
    infoBg() {
      return this.theme.gradient;
    },
    infoColor() {
      return this.theme.color;
    }
  },
  methods: {
    goPage(url) {
      this.$Navigate.push(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.property-wrap {
  margin: 20rpx;
  .info {
    width: 100%;
    height: 300rpx;
    border-radius: $border-radius-lg;
    position: relative;
    .text {
      padding: 74rpx 0 0 50rpx;
      font-size: 30rpx;
      color: $white;
      display: block;
    }
    .item {
      display: flex;
      padding: 52rpx 50rpx;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 100;
      .money {
        font-size: 80rpx;
        color: $white;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        line-height: 1.2;
        max-width: 420rpx;
      }
      .btn {
        width: 170rpx;
        height: 66rpx;
        line-height: 66rpx;
        text-align: center;
        font-size: 30rpx;
        border-radius: 66rpx;
        background: #ffffff;
      }
    }
    .info-image {
      width: 100%;
      height: 100rpx;
      position: absolute;
      bottom: 0;
    }
  }
}
.info-title {
  font-size: $font-size-lg;
  padding: $cell-padding;
  background: #ffffff;
}
.info-box {
  display: flex;
  background: #ffffff;
  flex-wrap: wrap;
  .item {
    display: flex;
    width: 50%;
    height: 140rpx;
    align-items: center;
    .item-box {
      display: flex;
      position: relative;
      width: 100%;
      height: 80rpx;
      padding: 0 40rpx;
    }
    .item-text {
      width: 100%;
      padding-right: 100rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .item-text_title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: $font-size;
        line-height: 40rpx;
        height: 40rpx;
        color: $text-gray;
      }
      .item-text_text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: $font-size;
        line-height: 48rpx;
        height: 48rpx;
      }
    }
    .item-img {
      width: 82rpx;
      height: 82rpx;
      position: absolute;
      right: 40rpx;
      top: 0;
    }
  }
}
.wallet-box {
  .item {
    .item-text {
      padding-right: 0;
      padding-left: 100rpx;
      .item-text_title {
        font-size: $font-size-sm;
      }
    }
    .item-img {
      width: 72rpx;
      height: 72rpx;
      text-align: center;
      position: absolute;
      left: 40rpx;
      top: 8rpx;
    }
  }
}
</style>
