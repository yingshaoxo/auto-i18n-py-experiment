<template>
  <view class="bg-white card-group-box">
    <lk-cell icon="orders-o" title="訂單信息" />
    <lk-cell-info-list :list="columns" />
    <lk-cell icon="chat-o" v-if="seller_code">
      <text class="kefu-text" @click="toKefu">聯繫客服</text>
    </lk-cell>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "@/common/utils";
import { GET_QLKEFUINFO } from "@/common/interface/message";
export default {
  data() {
    return {
      seller_code: ""
    };
  },
  props: {
    detail: Object
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    columns() {
      const {
        shop_name,
        order_status,
        payment_type_name,
        order_no,
        create_time,
        pay_time,
        consign_time,
        finish_time
      } = this.detail;
      let arr = [
        { title: "商家店鋪", value: shop_name || "" },
        { title: "訂單編號", value: order_no || "" },
        {
          title: "創建時間",
          value: create_time
            ? formatDate(create_time, "YYYY-MM-DD hh:mm:ss")
            : ""
        }
      ];
      if (order_status !== 0 && order_status !== 5) {
        arr.splice(1, 0, {
          title: "支付方式",
          value: payment_type_name || "",
          color: "#f44"
        });
      }
      if (pay_time) {
        arr.push({
          title: "付款時間",
          value: formatDate(pay_time, "YYYY-MM-DD hh:mm:ss")
        });
      }
      if (consign_time) {
        arr.push({
          title: "發貨時間",
          value: formatDate(consign_time, "YYYY-MM-DD hh:mm:ss")
        });
      }
      if (finish_time) {
        arr.push({
          title: "成交時間",
          value: formatDate(finish_time, "YYYY-MM-DD hh:mm:ss")
        });
      }
      return arr;
    }
  },
  mounted() {
    this.getConfig().then(() => {
      if (this.addons.qlkefu) {
        GET_QLKEFUINFO({
          shop_id: this.detail.shop_id,
          goods_id: 0
        }).then(({ data }) => {
          if (data.is_use) {
            this.seller_code = data.seller_code;
          }
        });
      }
    });
  },
  methods: {
    toKefu() {
      this.$Navigate.push({
        path: "/packages/message/chat",
        query: {
          seller_code: this.seller_code
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.kefu-text {
  font-size: $font-size-sm;
  color: $text-gray;
}
</style>
