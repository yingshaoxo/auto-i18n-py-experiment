<template>
  <view class="panel-group">
    <lk-cell>
      <view slot="title" class="title">價格庫存</view>
    </lk-cell>
    <view
      class="cell-group"
      v-for="(item,index) in list"
      :key="index"
    >
      <lk-cell :title="item.sku_name" v-if="item.sku_name" />
      <lk-field v-model="item.price" required label="銷售價" type="number" placeholder="请输入銷售價" />
      <lk-field
        v-model="item.market_price"
        label="市場價"
        type="number"
        placeholder="请输入市場價"
        disabled
      />
      <lk-field v-model="item.cost_price" disabled label="成本價" type="number" placeholder="请输入成本價" />
      <lk-field v-model="item.guidance_price" disabled label="指導價" type="number" placeholder="请输入指導價" />
    </view>
    
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
  },
  computed: {
    ...mapState({
      list: ({ smallshop }) => smallshop.editGoodsSkuList
    }),
    showQrIcon() {
      let iconName = "qr1";
      return iconName;
    }
  },
  methods: {

  },
  components: {}
};
</script>

<style scoped lang="scss">
.title {
  font-weight: 800;
}

.panel-group {
  margin-top: 20rpx;
  padding-bottom: 100rpx;
}

.cell-group {
  margin-bottom: 20rpx;
}
</style>