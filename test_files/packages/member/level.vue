<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.member_img"
      :name="info.username"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        <view>{{ info.growthText }}</view>
        <view>{{ info.discountText }}</view>
      </view>
      <view class="header-bottom" slot="bottom">
        <steps v-if="info.member_level_list" :items="info.member_level_list" />
      </view>
    </lk-header-panel>
    <view class="cell-group">
      <view class="tabel-title">等級權益介紹</view>
      <view class="tabel">
        <lk-table :th="levelHead" :tr="levelList" />
      </view>
    </view>
    <view class="cell-group">
      <view class="tips">
        <view class="title">如何獲得成長值？</view>
        <view>
          1、單次購物滿
          <text>{{ info.order_money || 0 }}</text>
          元增加
          <text>{{ info.pay_num || 0 }}</text>
          點成長值。
        </view>
        <view>
          2、充值
          <text>{{ info.recharge_money || 0 }}</text>
          元增加
          <text>{{ info.recharge_num || 0 }}</text>
          點成長值。
        </view>
        <view>
          3、訂單完成增加
          <text>{{ info.complete_num || 0 }}</text>
          點成長值。
        </view>
        <view>
          4、參與商城不定期的活動也可以獲得額外的成長值獎勵。
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_MEMBERLEVEL } from "@/common/interface/member";
import steps from "./component/level/steps";
export default {
  name: "packages-member-level",
  data() {
    return {
      info: {},
      levelHead: [
        {
          value: "等級"
        },
        {
          value: "成長值"
        },
        {
          value: "摺扣"
        }
      ],
      levelList: []
    };
  },
  computed: {},
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_MEMBERLEVEL().then(({ data }) => {
        this.info = data || {};
        this.info.growthText = `成長值：${data.growth_num}`;
        this.info.discountText = `購買商品享受${parseFloat(
          data.member_discount
        )}摺優惠`;
        this.info.order_money = parseFloat(data.order_money);
        this.info.recharge_money = parseFloat(data.recharge_money);
        let arr = [];
        data.member_level_list.forEach(e => {
          let td = [
            {
              value: e.level_name
            },
            {
              value: e.growth_num
            },
            {
              value: parseFloat(e.goods_discount) + "摺"
            }
          ];
          arr.push({ td });
        });
        this.levelList = arr;
      });
    }
  },
  components: {
    steps
  }
};
</script>

<style lang="scss" scoped>
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.header-bottom {
  margin-top: 20rpx;
}
.cell-group {
  margin: 20rpx 0;
}
.tabel {
  padding: $cell-padding;
  background-color: #ffffff;
}
.tabel-title {
  padding: 20rpx 30rpx 0;
  background-color: #ffffff;
}
.tips {
  padding: $cell-padding;
  line-height: 40rpx;
  background-color: #ffffff;
  font-size: $font-size-sm;
  .title {
    font-size: $font-size;
    line-height: 48rpx;
  }
  text {
    color: $red;
    padding: 0 8rpx;
  }
}
</style>
