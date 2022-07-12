<template>
  <view class="pages">
    <view class="head">
      <view class="title">{{ detail.type_name }}</view>
      <view
        class="value"
        :class="detail.change_money > 0 ? 'positive' : 'negative'"
      >
        {{ detail.change_money }}
      </view>
    </view>
    <lk-cell v-for="(item, index) in items" :key="index" :title="item.title">
      <view :style="{ color: item.color }" class="text-nowrap">
        {{ item.value }}
      </view>
    </lk-cell>
    <view class="tip-text" v-if="footTip">{{ footTip }}</view>
  </view>
</template>

<script>
import { GET_ASSETBALANCEDETAIL } from "@/common/interface/property";
import { formatDate, yuan } from "@/common/utils";
export default {
  name: "packages-property-log-detail",
  data() {
    return {
      detail: {},
      items: []
    };
  },
  onLoad(query) {
    GET_ASSETBALANCEDETAIL({ id: query.id }).then(({ data }) => {
      this.detail = data;
      this.items = this.dataToArr(data);
    });
  },
  methods: {
    statuColor(state) {
      let name = "#ff9900";
      if (state == -1 || state == 4) {
        name = "#ff454e";
      } else if (state == 3) {
        name = "#4b0";
      }
      return name;
    },
    statuName(state) {
      let name = "處理中";
      if (state == -1 || state == 4) {
        name = "失敗";
      } else if (state == 3) {
        name = "成功";
      }
      return name;
    },
    dataToArr(data) {
      let arr = [
        {
          title: "交易單號",
          value: data.records_no
        },
        {
          title: "時間",
          value: data.create_time
        }
      ];
      if (data.from_type == 8) {
        arr.push(
          {
            title: "狀態",
            value: this.statuName(data.status),
            color: this.statuColor(data.status)
          },
          {
            title: "提現金額",
            value: yuan(data.number)
          },
          {
            title: "手續費",
            value: yuan(data.charge)
          },
          {
            title: "餘額",
            value: yuan(data.balance)
          }
        );
      } else {
        arr.push({
          title: "餘額",
          value: yuan(data.balance)
        });
      }
      if (data.msg) {
        arr.push({
          title: "理由",
          value: data.msg
        });
      }
      return arr;
    }
  },

  computed: {
    footTip() {
      let text =
        "提示：提現過程中，提現金額将暂时进入冻结餘額，提现成功后该笔提现的冻结餘額将会扣除，如果提现失敗则冻结餘額解冻，該筆提現不成立。";
      return this.detail.from_type == 8 ? text : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.head {
  text-align: center;
  font-size: 32rpx;
  line-height: 1.8;
  margin: 60rpx 0;
}

.head .value {
  font-weight: 800;
}
.positive {
  color: #4b0;
}

.negative {
  color: $red;
}
.tip-text {
  margin: 20rpx 30rpx;
  font-size: 24rpx;
  color: $red;
  line-height: 1.4;
}
.text-nowrap {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
