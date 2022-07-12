<template>
  <view class="presell-group card-group-box">
    <lk-cell is-link @click="show = true">
      <view slot="icon" class="title" :style="{ color: titleColor }">
        {{ title }}
      </view>
      <view class="value">
        <view class="value-title">每人限購{{ maxBuy }}件</view>
        <view> 尾款時間：{{ times.pay }} </view>
        <view> 發貨時間：{{ times.send }} </view>
      </view>
    </lk-cell>
    <lk-popup v-model="show" position="bottom" round closeable title="預售規則">
      <view class="list">
        <lk-cell class="item" v-for="(item, index) in list" :key="index">
          <view class="title">{{ item.title }}</view>
          <view class="name">{{ item.value }}</view>
        </lk-cell>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { formatDate, yuan } from "@/common/utils";
export default {
  data() {
    return {
      show: false,
      title: "預售"
    };
  },
  props: {
    titleColor: {
      type: String,
      default: "#606266"
    },
    info: {
      type: [Object, Array],
      default: () => {}
    },
    goodsInfo: Object
  },
  computed: {
    maxBuy() {
      return this.goodsInfo.maxBuy || this.info.max_buy || 0;
    },
    list() {
      const info = this.info;
      let list = [
        {
          title: "定金",
          value: `定金支付：${formatDate(
            info.start_time,
            "YYYY-MM-DD"
          )}至${formatDate(info.end_time, "YYYY-MM-DD")}支付定金${yuan(
            info.firstmoney
          )}，下單後請在${info.pay_limit_time}分鐘內支付，超時將自動取消訂單。`
        },
        {
          title: "尾款",
          value: `尾款支付：${formatDate(
            info.pay_start_time,
            "YYYY-MM-DD"
          )}至${formatDate(
            info.pay_end_time,
            "YYYY-MM-DD"
          )}支付尾款，超時訂單關閉，且定金不予退還。`
        },
        {
          title: "發貨",
          value: `發貨時間：${formatDate(
            info.send_goods_time,
            "YYYY-MM-DD"
          )}开始發貨。`
        }
      ];
      return list;
    },
    times() {
      return {
        pay: `${formatDate(
          this.info.pay_start_time,
          "YYYY-MM-DD"
        )}~${formatDate(this.info.pay_end_time, "YYYY-MM-DD")}`,
        send: `${formatDate(this.info.send_goods_time, "YYYY-MM-DD")}`
      };
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.presell-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }
  .value {
    display: flex;
    flex-flow: column;
    color: $text-gray;
    font-size: $font-size-sm;
    line-height: 1.4;
  }

  .value-title {
    line-height: 48rpx;
  }

  .item .title {
    width: auto;
    font-size: $font-size;
    color: $red;
  }

  .item .name {
    color: $text-gray;
    font-size: $font-size-sm;
    line-height: 1.4;
  }
  .list{
    width: 100%;
    height: 70vh;
    overflow-y: auto;
  }
}
</style>
