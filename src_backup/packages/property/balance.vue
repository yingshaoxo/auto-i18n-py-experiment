<template>
  <view class="pages">
    <view class="property-wrap">
      <view class="info" :style="{ background: infoBg }">
        <text class="text">{{ balanceText }}(元)</text>
        <view class="item">
          <view class="money">{{ can_use_money }}</view>
          <view
            class="btn"
            @click="goPage('/packages/property/log/list')"
            :style="{ color: infoColor }"
            >明細</view
          >
        </view>
        <image class="info-image" :src="infoImageSrc"></image>
      </view>
      <view class="cell-group card-group-box card-groud-margin">
        <lk-cell
          center
          :title="'總' + balanceText"
          :label="balanceText + '總数'"
        >
          <view class="price-color first-letter">{{ balance | yuan }}</view>
        </lk-cell>
        <!-- <lk-cell
          center
          :title="'凍結' + balanceText"
          :label="'已经凍結' + balanceText"
        >
          <view class="price-color first-letter">
            {{ freezing_balance | yuan }}
          </view>
        </lk-cell> -->
      </view>
      <!-- <view class="info-item">
        <view
          class="info-list"
          v-for="(item, index) in btnGroup"
          :key="index"
          @click="goPage(item.route)"
        >
          <image class="info-icon" :src="item.iconSrc"></image>
          <view class="info-text">{{ item.text }}</view>
        </view>
      </view> -->
    </view>
  </view>
</template>

<script>
import { GET_ASSETBALANCE } from "@/common/interface/property";
import { mapState } from "vuex";
export default {
  name: "packages-property-balance",
  data() {
    return {
      balance: "",
      can_use_money: 0,
      freezing_balance: ""
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config,
      balanceText: ({ member }) => member.texts.balance_style
    }),
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    infoImageSrc() {
      return `${this.$store.getters.static.baseImgPath}balance_bg.png`;
    },
    infoBg() {
      return this.theme.gradient;
    },
    infoColor() {
      return this.theme.color;
    },
    btnGroup() {
      const { is_point_transfer, is_transfer, withdraw_conf } = this.config;
      let arr = [];
      arr.push({
        text: "充值",
        route: "/packages/property/recharge",
        disabled: false,
        isPlain: false,
        iconSrc: `${this.$store.getters.static.baseImgPath}balance.png`
      });
      if (withdraw_conf.is_withdraw_start) {
        arr.push({
          text: "提現",
          route: "/packages/property/withdraw",
          disabled: !this.can_use_money,
          isPlain: false,
          iconSrc: `${this.$store.getters.static.baseImgPath}transfer_accounts.png`
        });
      }
      if (is_transfer == 1) {
        arr.push({
          text: "轉賬",
          route: "/packages/property/transfer",
          disabled: false,
          isPlain: false,
          iconSrc: `${this.$store.getters.static.baseImgPath}conversion.png`
        });
      }
      if (is_point_transfer == 1) {
        arr.push({
          text: "兌換",
          route: "/packages/property/exchange",
          disabled: false,
          isPlain: false,
          iconSrc: `${this.$store.getters.static.baseImgPath}withdraw.png`
        });
      }
      arr.forEach((e, i) => (e.isPlain = i + 1 > 2));
      arr.length == 2 && (arr[arr.length - 1].isPlain = true);
      return arr;
    }
  },
  onLoad() {
    GET_ASSETBALANCE()
      .then(({ data }) => {
        this.balance = data.balance || 0;
        this.can_use_money = data.can_use_money
          ? parseFloat(data.can_use_money)
          : 0;
        this.freezing_balance = data.freezing_balance || 0;
      })
      .catch(() => {});
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
  padding: 20rpx;
}
.card-groud-margin {
  margin: 25rpx 0;
}
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
    height: 300rpx;
    position: absolute;
    bottom: 0;
  }
}
.cell-group {
  .price-color {
    font-size: $font-size-lg;
  }
}
.header-box {
  padding: $cell-padding;
  background: #ffffff;
  line-height: 48rpx;
  .panel {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
  }
  .price-color {
    font-weight: 800;
    font-size: 40rpx;
  }
}
.info-item {
  background: #ffffff;
  border-radius: $border-radius-lg;
  padding: 28rpx 0 30rpx;
  display: flex;
  justify-items: center;
  align-items: center;
  .info-list {
    flex: 1;
    text-align: center;
    border-right: 2rpx solid #eeeeee;
    &:last-of-type {
      border-right: 0;
    }
    .info-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 24rpx;
    }
    .info-text {
      font-size: 26rpx;
      color: #333333;
    }
  }
}
</style>
