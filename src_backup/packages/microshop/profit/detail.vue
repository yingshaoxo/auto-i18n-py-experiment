<template>
  <view class="pages">
    <view class="cell-group card-group-box">
      <view class="header-box">
        <view>可提現收益（元）</view>
        <view class="panel">
          <view class="price-color first-letter">
            {{ profit | yuan }}
          </view>
          <lk-button size="small" round to="/packages/microshop/profit/log">
            查看明細
          </lk-button>
        </view>
      </view>
    </view>
    <view class="cell-group card-group-box">
      <lk-cell center title="累計收益" label="累計獲得收益">
        <view class="price-color first-letter">{{ total_money | yuan }}</view>
      </lk-cell>
      <lk-cell center title="已提現收益" label="提現成功的收益">
        <view class="price-color first-letter">{{ withdrawals | yuan }}</view>
      </lk-cell>
      <lk-cell center title="待結算" label="待結算的收益">
        <view class="price-color first-letter">
          {{ freezing_profit | yuan }}
        </view>
      </lk-cell>
      <lk-cell center title="提現中" label="提現中的收益">
        <view class="price-color first-letter">
          {{ apply_withdraw | yuan }}
        </view>
      </lk-cell>
    </view>

    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :disabled="isDisabled"
        to="/packages/microshop/profit/withdraw"
      >
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { GET_MICROSHOPDETAIL } from "@/common/interface/microshop";
export default {
  name: "packages-microshop-profit-detail",
  data() {
    return {
      profit: 0,
      total_money: 0,
      withdrawals: 0,
      apply_withdraw: 0,
      freezing_profit: 0
    };
  },
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts,
      memberTexts: ({ member }) => member.texts
    }),
    isDisabled() {
      return this.profit <= 0;
    },
    btnText() {
      return this.profit <= 0 ? "提現金額為0，不可提現" : "提現";
    }
  },
  onLoad() {
    GET_MICROSHOPDETAIL()
      .then(({ data }) => {
        this.profit = parseFloat(data.profit);
        this.total_money = data.total_money;
        this.withdrawals = data.withdrawals;
        this.apply_withdraw = data.apply_withdraw;
        this.freezing_profit = data.freezing_profit;
      })
      .catch(() => {});
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
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
