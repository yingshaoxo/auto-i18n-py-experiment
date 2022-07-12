<template>
  <view class="pages">
    <view class="header">
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        nav-per-view="3"
        @change="onTab"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          {{ tab.name }}
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-load-list
      ref="load"
      top="88"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell
        class="item"
        v-for="(item, index) in list"
        :key="index"
        :label="item.text"
        :to="item.to"
      >
        <view slot="title" class="title-date">
          <view class="title">
            <text :class="item.countClass">{{ item.cash }}</text>
            <text class="line">|</text>
            <text :class="item.statusClass">
              {{ item.status_name }}
            </text>
          </view>
          <view class="date">{{ item.create_time }}</view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_BLOCKCHAINLOGLIST } from "@/common/interface/blockchain";
export default {
  name: "packages-blockchain-trade-log",
  data() {
    return {
      tabs: [
        { name: "進行中", type: 0 },
        { name: "已完成", type: 1 },
        { name: "失敗", type: 2 }
      ],
      params: {
        page_index: 1,
        page_size: 20,
        status: 0,
        symbol: ""
      }
    };
  },
  mixins: [loadMixin],
  onLoad(query) {
    this.pageType = query.type;
    this.params.symbol = query.type
      ? String(query.type).toLocaleUpperCase()
      : "";
  },
  methods: {
    onTab(index) {
      this.params.status = this.tabs[index].type;
      this.resetList();
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_BLOCKCHAINLOGLIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          list.forEach(e => {
            e.countClass = parseFloat(e.count) > 0 ? "positive" : "negative";
            e.statusClass = e.status == 1 ? "positive" : "negative";
            e.to = {
              path: "/packages/blockchain/trade/detail",
              query: {
                type: this.pageType,
                id: e.id
              }
            };
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

<style lang="scss" scoped>
.header {
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 10;
}
.title-date {
  display: flex;
  justify-content: space-between;
  .title {
    display: flex;
  }
  .date {
    font-size: $font-size-sm;
    color: $text-light;
  }
}
.line {
  padding: 0 8rpx;
}
.positive {
  color: $green;
}
.negative {
  color: $red;
}
</style>
