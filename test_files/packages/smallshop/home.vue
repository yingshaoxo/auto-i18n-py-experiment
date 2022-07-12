<!-- 微商店铺首页商品列表吧 -->
<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="headers">
      <shop-header :items="headerItems" :info="info" />
      <lk-search
        v-model="params.search_text"
        placeholder="商品名稱"
        action="搜索"
        @search="onSearch"
      />
      <tab-sort-screen :isSelect="true" @change="onTabSort" />
    </view>
    <lk-load-list
      ref="load"
      top="376"
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
            <view
              class="item"
              v-for="(item, index) in leftList"
              :key="item.goods_id"
            >
              <lk-goods-box
                :showWaterfall="true"
                :title="item.goods_name"
                :price="item.price"
                :origin-price="item.market_price"
                :image="item.logo"
                :goods-id="item.goods_id"
                :sales="item.sales"
                :pic-size="item.pic_size"
              >
                <!-- <view slot="bottom">
                  <text class="goods-btn yes" @click.stop="onEdit(item.goods_id)">編輯</text>
                </view> -->
              </lk-goods-box>
            </view>
          </view>
          <view class="right-list" slot="right">
            <view
              class="item"
              v-for="(item, index) in rightList"
              :key="item.goods_id"
            >
              <lk-goods-box
                :showWaterfall="true"
                :title="item.goods_name"
                :price="item.price"
                :origin-price="item.market_price"
                :image="item.logo"
                :goods-id="item.goods_id"
                :sales="item.sales"
                :pic-size="item.pic_size"
              >
                <!-- <view slot="bottom">
                  <text class="goods-btn yes" @click.stop="onEdit(item.goods_id)">編輯</text>
                </view> -->
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
import { WXSHOPCENTER } from "@/common/interface/smallshop";
import { GET_GOODSLIST } from "@/common/interface/goods";
import waterfall from "@/mixins/waterfall";
import loadMixin from "@/mixins/load-list";
import tabSortScreen from "./component/list/tab-sort-screen";
import shopHeader from "./component/header";
export default {
  name: "packages-smallshop-goodslist",
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
      headerItems: {
        params: {},
        style: {},
      },
      info: {},
    };
  },
  mixins: [loadMixin, waterfall],
  onLoad(query) {
    const {
      shop_id,
      search_text,
      category_id,
      text,
      is_recommend_goods,
      wx_id,
    } = query;
    if (text) {
      this.pageStyle.title = text;
    }
    this.params = {
      page_index: 1,
      page_size: 20,
      is_recommend_goods: is_recommend_goods || "",
      order: "",
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
      wx_id: wx_id || "",
    };
    this.getShopInfo(wx_id);
  },
  methods: {
    getShopInfo(wx_id) {
      WXSHOPCENTER({ id: wx_id }).then(({ data }) => {
        this.info = data;
        this.pageStyle.title = this.info.shop_name;
        this.headerItems.style.backgroundimage = data.background;
        this.setWxShare({
          title: this.info.shop_name,
          desc: "我剛剛發現了一個很不錯的店鋪，趕快來看看吧。",
          imgUrl: this.info.shop_logo,
        });
      });
    },
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
    onSearch() {
      this.params.page_index = 1;
      this.params.last_id = "";
      this.params.uuid = "";
      this.start_page = 0;
      this.params.recommend_goods_ids = "";
      this.$refs.waterfallList.clear();
      this.resetList();
    },
    onEdit(goods_id) {
      this.$Navigate.push({
        path: "/packages/smallshop/goodsedit",
        query: {
          goods_id: goods_id,
        },
      });
    },
  },
  components: {
    tabSortScreen,
    shopHeader,
  },
};
</script>

<style lang="scss" scoped>
.headers {
  height: 376rpx;
  position: fixed;
  background: #fff;
  width: 100%;
  z-index: 300;
}

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

    .goods-btn {
      font-size: 24rpx;
      padding: 3rpx 10rpx;
      border-radius: 40rpx;
      float: right;
    }

    .yes {
      color: #d9021d;
      border: 1rpx solid #d9021d;
    }

    .no {
      color: #0000ff;
      border: 1rpx solid #0000ff;
    }
  }
}
</style>
