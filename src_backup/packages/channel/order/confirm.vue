<template>
  <view class="pages">
    <lk-choice-address
      v-if="buy_type == 'pickupgoods'"
      :info="address"
      @select="onAddress"
    />
    <view class="items card-group-box">
      <lk-cell icon="shop-o" :title="items.shop_name" />
      <lk-goods-card
        v-for="(item, index) in items.shop_list"
        :key="index"
        cell-padding
        :image="item.goods_picture"
        :title="item.goods_name"
        :desc="item.sku_name"
        :price="buy_type == 'purchase' ? item.price : ''"
        :num="item.num"
      >
        <view slot="tags" class="text-right" v-if="buy_type == 'purchase'">
          采購於：{{ item.purchase_to }}
        </view>
      </lk-goods-card>
      <lk-cell
        title="配送方式"
        v-if="buy_type == 'pickupgoods'"
        :value="items.totalShippingFeeText"
      />
      <lk-field
        v-if="buy_type == 'pickupgoods'"
        label="買家留言"
        v-model="items.buyer_message"
        type="textarea"
        placeholder="選填：留言內容盡量和商家溝通"
        rows="1"
        autosize
      />
      <lk-cell>
        <view class="shop-foot">
          <text>共</text>
          <view class="num">
            {{ items.total_quantity }}
          </view>
          <text>件商品，小計：</text>
          <view class="price first-letter">
            {{ countTotalAmount | yuan }}
          </view>
        </view>
      </lk-cell>
    </view>
    <lk-submit-bar
      :price="countTotalAmount"
      :disabled="isDisabled"
      :loading="isLoading"
      label="合計金額："
      button-text="提交訂單"
      @submit="onSubmit"
    />
  </view>
</template>

<script>
import {
  GET_ORDERINFO,
  CREATE_ORDER,
  COUNT_FREIGHT
} from "@/common/interface/channel";
function filterShipping(value) {
  let text = "快遞 ¥" + value;
  if (parseFloat(value) == 0) {
    text = "快遞 包郵";
  }
  return value == undefined || value == null ? "未選擇收貨地址" : text;
}
export default {
  name: "packages-channel-order-confirm",
  data() {
    return {
      buy_type: "",
      address: {},
      items: {},
      isLoading: false
    };
  },
  computed: {
    isDisabled() {
      return this.items.total_money >= 0 && this.items.total_money !== undefined
        ? false
        : true;
    },
    // 計算結算金額
    countTotalAmount() {
      let total_money = 0;
      let shop_total_amount = 0;
      if (this.items.shop_list) {
        let total_shipping_fee = parseFloat(this.items.total_shipping_fee); // 運費
        this.items.shop_list.forEach(e => {
          shop_total_amount += parseFloat(e.price) * parseInt(e.num);
        });
        total_money = shop_total_amount + total_shipping_fee;
      }
      return total_money;
    }
  },
  onLoad(query) {
    this.buy_type = query.type;
    this.getData();
  },
  methods: {
    onAddress(address) {
      this.address = address;
      let goods_info = "";
      let arr = [];
      this.items.shop_list.forEach(e => {
        arr.push(e.goods_id + ":" + e.num);
      });
      goods_info = arr.join(",");
      COUNT_FREIGHT({ address_id: address.id, goods_info }).then(({ data }) => {
        this.items.totalShippingFeeText = filterShipping(data.free_money);
        this.items.total_shipping_fee=data.free_money
      });
    },
    getData() {
      GET_ORDERINFO({ buy_type: this.buy_type })
        .then(({ data }) => {
          let items = data;
          if (this.buy_type == "pickupgoods") {
            this.address = {
              name: data.consigner,
              tel: data.mobile,
              id: data.address_id,
              address: data.address_info
            };
            items.buyer_message = "";
          }
          items.totalShippingFeeText = filterShipping(items.total_shipping_fee);
          this.items = items;
        })
        .catch(() => {});
    },
    onSubmit() {
      const params = {};
      params.buy_type = this.buy_type;
      if (this.buy_type == "pickupgoods") {
        if (!this.address.id) {
          this.$Prompt.toast("請選擇收貨地址！");
          return false;
        }
        params.address_id = this.address.id;
        params.buyer_message = this.items.buyer_message;
      }
      // return console.log(params);
      this.isLoading = true;
      CREATE_ORDER(params)
        .then(({ data }) => {
          uni.$emit("refreshCgannel", { msg: "提交訂單成功！" });
          this.$Navigate.replace({
            path: "/pay/payment",
            query: {
              out_trade_no: data.out_trade_no,
              hash: "channel"
            }
          });
        })
        .catch(error => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 100rpx;
  .shop-foot {
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
    .num,
    .price {
      padding: 0 8rpx;
    }
    .price {
      color: $red;
    }
  }
}
</style>
