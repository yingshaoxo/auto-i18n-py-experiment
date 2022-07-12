<template>
  <view class="pages">
    <view class="cell-group">
      <lk-cell :title="item.title" v-for="(item, index) in items" :key="index">
        <view>
          <text :style="{ color: item.color }" @click="toLink(item.link)"
            >{{ item.value }}
          </text>
        </view>
      </lk-cell>
    </view>
  </view>
</template>

<script>
import { GET_BLOCKCHAINLOGDETAIL } from "@/common/interface/blockchain";
export default {
  name: "packages-blockchain-trade-detail",
  data() {
    return {
      params: {
        id: ""
      },
      items: []
    };
  },
  onLoad(query) {
    this.params.id = query.id || "";
    this.getData();
  },
  methods: {
    getData() {
      GET_BLOCKCHAINLOGDETAIL(this.params).then(({ data }) => {
        let arr = [];
        var trade_no = {
            title: "交易流水號",
            value: data.trade_no
          },
          hash = {
            title: "Hash值",
            link: data.hash_url,
            value: data.hash,
            color: "#1989fa"
          },
          status_name = {
            title: "交易狀態",
            value: data.status_name,
            color: data.status == 1 ? "#4b0" : "#ff454e"
          },
          coin_name = {
            title: "交易幣種",
            value: data.coin_name
          },
          type_name = {
            title: "交易類型",
            value: data.type_name
          },
          to_address = {
            title: "收款方",
            value: data.to_address
          },
          cash = {
            title: "變動資金",
            value: data.count
          },
          gasPrice = {
            title: "手續費",
            value: data.gasPrice
          },
          ask_for_date = {
            title: "交易時間",
            value: data.ask_for_date
          },
          reason = {
            title: "原因",
            value: data.reason
          };
        arr.push(trade_no);
        if (data.hash) {
          arr.push(hash);
        }
        arr.push(
          status_name,
          coin_name,
          type_name,
          to_address,
          cash,
          gasPrice,
          ask_for_date
        );
        if (data.reason) {
          arr.push(reason);
        }
        this.items = arr;
      });
    },
    toLink(link) {
      if (link) {
        this.$Navigate.push(link);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
