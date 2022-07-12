<template>
  <view class="btn-group">
    <lk-button
      class="btn"
      size="small"
      round
      :color="item.color"
      v-for="(item, index) in list"
      :key="index"
      @click="onOperation(item.no)"
    >
      {{ item.name }}
    </lk-button>
  </view>
</template>

<script>
import { CLOSE_ORDER } from "@/common/interface/channel";
import { CONFIRM_TAKEDELIVERY } from "@/common/interface/order";
export default {
  data() {
    return {};
  },
  props: {
    list: Array,
    buy_type: String,
    order_id: [String, Number]
  },
  computed: {},
  methods: {
    onOperation(type) {
      const order_id = this.order_id;
      if (type === "pay") {
        // 支付
        this.onPay(order_id);
      } else if (type === "getdelivery") {
        // 確認收貨
        this.onTakeDelivery(order_id);
      } else if (type === "logistics") {
        // 查看物流信息
        this.$Navigate.push({
          path: "/packages/order/logistics",
          query: {
            order_id
          }
        });
      } else if (type === "close") {
        // 關閉訂單
        this.onCloseOrder(order_id);
      } else if (type === "detail") {
        // 訂單詳情
        this.$Navigate.push({
          path: "/packages/channel/order/detail",
          query: {
            type: this.buy_type,
            order_id
          }
        });
      }
    },
    onPay(order_id) {
      let hash = this.buy_type == "purchase" ? "channel" : "order"; // 采購訂單支付hash為channel
      this.$Navigate.push({
        path: "/pay/payment",
        query: { order_id, hash: hash }
      });
    },
    onTakeDelivery(order_id) {
      this.$Prompt
        .modal({
          content: "確定收貨嗎？"
        })
        .then(() => {
          CONFIRM_TAKEDELIVERY({ order_id }).then(res => {
            this.$emit("init", res);
          });
        });
    },
    onCloseOrder(order_id) {
      this.$Prompt
        .modal({
          content: "確定關閉該訂單嗎？"
        })
        .then(() => {
          CLOSE_ORDER({
            order_id,
            order_type: this.buy_type
          }).then(res => {
            this.$emit("init", res);
          });
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: flex-end;
}

.btn-group .btn {
  margin-left: 12rpx;
}
</style>
