<template>
  <view class="bg-white card-group-box">
    <lk-cell icon="orders-o" title="訂單信息" />
    <lk-cell-info-list :list="columns" />
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
const orderStatusText = {
  0: "待付款",
  1: "待發貨",
  2: "已發貨",
  3: "已收貨",
  4: "已完成",
  5: "已關閉",
  "-1": "售後中"
};
export default {
  data() {
    return {};
  },
  props: {
    buy_type: String,
    detail: Object
  },
  computed: {
    columns() {
      const type = this.buy_type;
      const {
        who_purchase,
        who_purchase_grade,
        shop_name,
        order_no,
        order_status,
        payment_name,
        create_time
      } = this.detail;
      let arr = [
        { title: "訂單編號", value: order_no },
        { title: "訂單狀態", value: orderStatusText[order_status] },
        {
          title: "創建時間",
          value: create_time
            ? formatDate(create_time, "YYYY-MM-DD hh:mm:ss")
            : ""
        }
      ];
      if (type == "output") {
        arr.unshift({
          title: "采購代理",
          value: who_purchase + "(" + who_purchase_grade + ")"
        });
      } else {
        arr.unshift({ title: "商家店鋪", value: shop_name });
      }
      if (
        (type == "purchase" || type == "output") &&
        order_status &&
        payment_name
      ) {
        arr.push({
          title: "支付方式",
          value: payment_name,
          color: "#f44"
        });
      }
      return arr;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
