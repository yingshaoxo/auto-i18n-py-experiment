<template>
  <page-meta>
    <navigation-bar front-color="#000000" background-color="#FFFFFF" :title="pageStyle.title" />
  </page-meta>
  <view class="pages">
    <view class="property-wrap">
      <view class="info" :style="{ background: infoBg }">
        <text class="text">總資產</text>
        <view class="item">
          <view class="money">{{ balance | yuan }}</view>
          <view class="btn" @click="goPage('/packages/property/log/list')" :style="{ color: infoColor }">查看明細</view>
        </view>
        <image class="info-image" :src="infoImageSrc"></image>
      </view>
      <view class="cell-group card-group-box card-groud-margin">
        <lk-cell center title="凍結資產" label='下單凍結資產，訂單完成減少凍結資產'>
          <view class="price-color first-letter">{{ freezing_money | yuan }}</view>
        </lk-cell>
        <lk-cell center title="提現中" label='提現中的余額。'>
          <view class="price-color first-letter">{{ freezing_balance | yuan }}</view>
        </lk-cell>
        <!-- <lk-cell center title="累計傭金" label='累計獲得傭金'>
          <view class="price-color first-letter">{{ total_money | yuan }}</view>
        </lk-cell>
        <lk-cell center title="總資產" label='提現成功的資產'>
          <view class="price-color first-letter">{{ suc_money | yuan }}</view>
        </lk-cell>
        <lk-cell center title="提現中" label='提現中的利潤'>
          <view class="price-color first-letter">{{ acc_money | yuan }}</view>
        </lk-cell>
        <lk-cell center title="凍結資產" label='凍結的資產'>
          <view class="price-color first-letter">{{ paid_money | yuan }}</view>
        </lk-cell> -->
        <!-- <lk-cell
          center
          title="已付貨款"
          label='已付的貨款'
        >
          <view class="price-color first-letter">{{ acc_money | yuan }}</view>
        </lk-cell>
        <lk-cell
          center
          title="保證金"
          label='繳納的保證金'
        >
        <view class="price-color first-letter">{{ money | yuan }}</view>
        </lk-cell>
        -->
      </view>

      <view class="foot-btn-group">
        <lk-button block round type="danger" :color="theme.gradient" :disabled="isDisabled"
          to="/packages/property/withdraw">
          {{ btnText }}
        </lk-button>
        <div style="padding: 10rpx;"></div>
        <lk-button block round type="danger" :color="theme.gradient" to="/packages/property/recharge">
          充值
        </lk-button>
      </view>
    </view>
  </view>
</template>

<script>
import { WXSHOPCENTER } from "@/common/interface/smallshop";
import { mapState } from "vuex";
export default {
  name: "packages-smallshop-asset",
  data () {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      f_money: 0,
      total_money: 0,
      withdrawals: 0,
      apply_withdraw: 0,
      freezing_commission: 0,
      balance: 0,
      freezing_money: 0,
      freezing_balance: 0,
    };
  },
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts,
      memberTexts: ({ member }) => member.texts
    }),

    isDisabled () {
      return this.balance <= 0;
    },
    btnText () {
      return this.balance <= 0
        ? "提現利潤為0，不可提現"
        : "提現";
    },
    infoImageSrc () {
      return `${this.$store.getters.static.baseImgPath}balance_bg.png`;
    },
    infoBg () {
      return this.theme.gradient;
    },
    infoColor () {
      return this.theme.color;
    }
  },
  onLoad (query) {
    WXSHOPCENTER({ id: query.wx_id })
      .then(({ data }) => {
        this.f_money = parseFloat(data.f_money);
        this.total_money = data.total_money;
        this.suc_money = data.suc_money;
        this.paid_money = data.paid_money;
        this.acc_money = data.acc_money;
        this.money = data.money;
        this.freezing_money = data.freezing_money;
        this.freezing_balance = data.freezing_balance;
        this.balance = parseFloat(data.balance);
      })
      .catch(() => { });
  },
  methods: {
    goPage (url) {
      this.$Navigate.push(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.property-wrap {
  padding: 26rpx;
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
</style>
