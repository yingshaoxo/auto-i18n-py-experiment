<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.user_headimg"
      :name="info.member_name"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        <view>{{ info.shopkeeper_level_name }}</view>
        <view>{{ info.shopkeeper_time_text }}</view>
      </view>
      <view class="header-bottom" slot="bottom">
        <lk-button
          v-if="info.is_default_shopkeeper == 0"
          class="btn"
          size="small"
          round
          plain
          :color="theme.color"
          to="/packages/microshop/apply?type=2"
        >
          立即續費
        </lk-button>
        <lk-button
          class="btn"
          size="small"
          round
          plain
          :color="theme.color"
          to="/packages/microshop/apply?type=1"
        >
          提升等級
        </lk-button>
      </view>
    </lk-header-panel>
    <view class="cell-group" v-if="levelList.length">
      <view class="tabel-title">等級權益介紹</view>
      <view class="tabel">
        <lk-table :th="levelHead" :tr="levelList" />
      </view>
    </view>
    <view class="cell-group">
      <view class="tips">
        <view> 店主升級：店主通過購買升級禮包升級。 </view>
        <view> 店主降級：等級過期後，將會降至默認等級。 </view>
        <view> 專屬店鋪：擁有自己的專屬微店。 </view>
        <view> 自購返利：店主在平臺消費，獲得返利。 </view>
        <view> 銷售返利：消費者通過店主微店消費，獲得返利。 </view>
        <view> 開店返利：下線開店獲得相應返利。 </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_GRADEINFO, GET_UPGRADE } from "@/common/interface/microshop";
import { mapState, mapActions } from "vuex";
function ratio(value) {
  return value ? parseFloat(value) + "%" : "--";
}
export default {
  name: "packages-microshop-level",
  data() {
    return {
      info: {},
      levelHead: [],
      levelList: []
    };
  },
  onLoad() {
    this.getMicroshopInfo().then(info => {
      this.info = info;
      this.getData();
    });
  },
  methods: {
    ...mapActions(["getMicroshopInfo"]),
    getData() {
      GET_GRADEINFO().then(({ data }) => {
        let headArr = [{ value: "等級" }];
        let listArr = [];
        let arr1 = [{ value: "專屬店鋪" }];
        let arr2 = [{ value: "自購返利" }];
        let arr3 = [{ value: "開店返利" }];
        data.forEach(e => {
          headArr.push({ value: e.level_name });
          arr1.push({ value: "擁有" });
          arr2.push({ value: ratio(e.selfpurchase_rebate) });
          arr3.push({ value: ratio(e.shop_rebate) });
        });
        listArr.push({ td: arr1 }, { td: arr2 }, { td: arr3 });
        this.levelHead = headArr;
        this.levelList = listArr;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.header-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
  .btn {
    margin-left: 20rpx;
  }
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
  .light {
    color: $text-light;
    font-size: $font-size-sm;
  }
}
</style>
