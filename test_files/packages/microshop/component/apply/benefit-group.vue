<template>
  <view class="cell-group">
    <view class="divider">
      <text>店主權益</text>
    </view>
    <lk-grid-panel cols="4" icon-color="#666" :items="cardItems" />
    <view class="cell lk-hairline--top">
      <view>購買以上任意禮包即可成為店主。成為店主後能享受權益如下：</view>
      <view>1、擁有自己的專屬微店。</view>
      <view>2、店主在平臺消費即可獲得相對應的返利。</view>
      <view>3、分享自己微店給朋友，銷售後獲得返利。</view>
      <view>
        4、下級{{ distributeTexts.distributor_name }}成為店主獲得返利。
      </view>
      <view>5、下級销售产品后，亦可獲得返利最大三級。</view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      cardItems: [
        {
          icon: "shop-o",
          title: "專屬微店"
        },
        {
          icon: "cash-back-record",
          title: "自購返利"
        },
        {
          icon: "after-sale",
          title: "銷售返利"
        },
        {
          icon: "replay",
          title: "開店返利"
        }
      ]
    };
  },
  props: {
    list: Array
  },
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts
    })
  },
  components: {}
};
</script>

<style scoped lang="scss">
.cell-group {
  margin: 20rpx 0;
  padding: 20rpx 0;
  background: #fff;
}
.cell {
  padding: 20rpx 30rpx;
  line-height: 48rpx;
  font-size: $font-size-sm;
  color: $red;
}
</style>
