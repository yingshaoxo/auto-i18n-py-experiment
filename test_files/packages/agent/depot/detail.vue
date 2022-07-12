<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="4"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view
        class="item card-group-box"
        v-for="(item, index) in list"
        :key="index"
      >
        <lk-cell :title="item.titleText" :title-right="item.totalNumText" />
        <lk-cell v-if="params.tag_status == 1">
          <view>采購單價：{{ item.price | yuan }}</view>
          <view>折扣：{{ item.channel_purchase_discount | rate }}</view>
          <view>商品售價：{{ item.platform_price | yuan }}</view>
        </lk-cell>
        <lk-cell v-else-if="params.tag_status == 2">
          <view>出貨單價：{{ item.price | yuan }}</view>
          <view>采購單價：{{ item.purchase_price | yuan }}</view>
          <view>商品售價：{{ item.platform_price | yuan }}</view>
        </lk-cell>
        <lk-cell v-else-if="params.tag_status == 3">
          <view>采購單價：{{ item.purchase_price | yuan }}</view>
          <view>折扣：{{ item.channel_purchase_discount | rate }}</view>
          <view>商品售價：{{ item.platform_price | yuan }}</view>
        </lk-cell>
        <lk-cell v-else-if="params.tag_status == 4">
          <view>采購單價：{{ item.purchase_price | yuan }}</view>
          <view>零售單價：{{ item.retail_price | yuan }}</view>
          <view>實收金額：{{ item.real_money | yuan }}</view>
        </lk-cell>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_DEPOTDETAIL } from "@/common/interface/agent";
import loadMixin from "@/mixins/load-list";
const titleObj = {
  1: {
    text: "采購時間"
  },
  2: {
    text: "出貨時間"
  },
  3: {
    text: "提貨時間"
  },
  4: {
    text: "零售時間"
  }
};

export default {
  name: "packages-agent-depot-detail",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20,
        sku_id: "",
        tag_status: 1
      },
      tabs: [
        {
          name: "采購",
          type: 1
        },
        {
          name: "出貨",
          type: 2
        },
        {
          name: "提貨",
          type: 3
        },
        {
          name: "零售",
          type: 4
        }
      ]
    };
  },
  filters: {
    rate(value) {
      return parseFloat(value) * 100 + "%";
    }
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.params.sku_id = query.sku_id || "";
  },
  methods: {
    onTab(index) {
      this.params.tag_status = this.tabs[index].type;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_DEPOTDETAIL(this.params)
        .then(({ data }) => {
          let list = data.channel_goods_info || [];
          list.forEach(e => {
            e.titleText = titleObj[e.tag_status].text + e.create_time_date;
            e.totalNumText = `數量：${e.total_num}`;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
