<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <tab-sort-screen @change="onTabSort" />
    <lk-load-list
      ref="load"
      top="88"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @emptyclick="emptyClick"
    >
      <view class="list">
        <lk-waterfall v-model="list" ref="waterfallList" @get-list="getList">
          <view class="left-list" slot="left">
            <view class="item" v-for="(item, index) in leftList" :key="index">
              <lk-goods-box
                :showWaterfall="true"
                :title="item.goods_name"
                :price="item.price"
                :origin-price="item.market_price"
                :image="item.logo"
                :goods-id="item.goods_id"
                :sales="item.sales"
                :pic-size="item.pic_size"
                :shop-name="item.shop_name"
                :shop-icon="item.shop_icon"
                :wx-id="item.wx_id"
              >
              </lk-goods-box>
            </view>
          </view>
          <view class="right-list" slot="right">
            <view class="item" v-for="(item, index) in rightList" :key="index">
              <lk-goods-box
                :showWaterfall="true"
                :title="item.goods_name"
                :price="item.price"
                :origin-price="item.market_price"
                :image="item.logo"
                :goods-id="item.goods_id"
                :sales="item.sales"
                :pic-size="item.pic_size"
                :shop-name="item.shop_name"
                :shop-icon="item.shop_icon"
                :wx-id="item.wx_id"
              >
              </lk-goods-box>
            </view>
          </view>
        </lk-waterfall>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { GET_GOODSLIST } from "@/common/interface/goods";
import waterfall from "@/mixins/waterfall";
import loadMixin from "@/mixins/load-list";
import tabSortScreen from "./component/list/tab-sort-screen";
export default {
  name: "pages-goods-list",
  data() {
    return {
      start_page: 0,
      pageStyle: {
        background: "",
        title: "",
      },
      params: {},
      upOption: {
        empty: {
          type: "goods",
          tip: "暫無商品",
          btnText: "去首頁",
          to: "/pages/mall/index",
        },
      },
    };
  },
  mixins: [loadMixin, waterfall],
  onLoad(query) {
    const { shop_id, search_text, category_id, text, is_recommend_goods } =
      query;
    if (text) {
      this.pageStyle.title = text;
    }
    this.params = {
      page_index: 1,
      page_size: 20,
      is_recommend_goods: is_recommend_goods || "",
      order: "create_time",
      sort: "",
      min_price: "",
      max_price: "",
      is_recommend: 0,
      is_new: 0,
      is_hot: 0,
      recommend_goods_ids: "",
      is_promotion: 0,
      is_shipping_free: 0,
      goods_type: shop_id > 0 ? 2 : shop_id == 0 ? 0 : 1,
      search_text: search_text || "",
      category_id: category_id || "",
      shop_id: shop_id || "",
      last_id: "",
      uuid: "",
    };
  },
  methods: {
    upCallback(page) {
      if (this.start_page && page.num > 1) {
        this.params.page_index = page.num - this.start_page;
      } else {
        this.params.page_index = page.num;
      }
      GET_GOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.goods_list;
          this.params.last_id = data.last_id || "";
          this.params.uuid = data.uuid || "";
          if (data.start_page == 1) {
            this.start_page = 1;
          }
          this.params.recommend_goods_ids = data.recommend_goods_ids;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    downCallback() {
      this.params.last_id = "";
      this.params.uuid = "";
      this.$load.resetUpScroll();
    },
    onTabSort(e) {
      e.page_index = 1;
      this.params = Object.assign({ ...this.params }, { ...e });
      this.params.last_id = "";
      this.params.uuid = "";
      this.start_page = 0;
      this.params.recommend_goods_ids = "";
      this.$refs.waterfallList.clear();
      this.resetList();
    },
  },
  components: {
    tabSortScreen,
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 10rpx;
  .item {
    position: relative;
    // width: calc(50% - 20rpx);
    margin: 10rpx 10rpx;
    background: #ffffff;
    border-radius: 20rpx;
    overflow: hidden;
    -webkit-box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
    font-size: $font-size-lg;
    .sales {
      font-size: $font-size-sm;
      color: $text-gray;
      display: flex;
      flex-flow: row;
    }
  }
}
</style>
