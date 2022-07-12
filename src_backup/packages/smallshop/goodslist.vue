<!-- 微商管理处商品列表 -->
<template>
  <page-meta>
    <navigation-bar front-color="#000000" background-color="#FFFFFF" :title="pageStyle.title" />
  </page-meta>
  <view class="pages">
    <view class="header">
      <lk-search v-model="params.search_text" placeholder="商品名稱" action="搜索" @search="onSearch" />
      <tab-sort-screen :isSelect="true" @change="onTabSort" />
    </view>
    <lk-load-list ref="load" top="176" @init="loadInit" :down="downOption" @down="downCallback" :up="upOption"
      @up="upCallback" @emptyclick="emptyClick">
      <view class="list">
        <lk-waterfall v-model="list" ref="waterfallList" @get-list="getList">
          <view class="left-list" slot="left">
            <view class="item" v-for="(item, index) in leftList" :key="item.goods_id">
              <lk-goods-box to="no" :showWaterfall="true" :title="item.goods_name" :price="item.price"
                :origin-price="item.market_price" :image="item.pic_cover" :goods-id="item.goods_id" :sales="item.sales"
                :pic-size="item.pic_size">
                <view slot="bottom">
                  <text v-if="item.id" class="goods-btn yes" @click.stop="onEdit(item.goods_id)">編輯</text>
                  <text v-if="(!item.is_recommend) && item.id" class="goods-btn no"
                    @click.stop="setRec(item.goods_id, 1)">置頂</text>
                  <text v-if="item.is_recommend" class="goods-btn yes" @click.stop="setRec(item.goods_id, 0)">已置頂</text>
                  <text v-if="item.id" class="goods-btn yes"
                    @click.stop="onSelect(item.goods_id, leftList, index)">已挑選</text>
                  <text v-else class="goods-btn no" @click.stop="onNoSelect(item.goods_id, leftList, index)">未挑選</text>
                </view>
              </lk-goods-box>
            </view>
          </view>
          <view class="right-list" slot="right">
            <view class="item" v-for="(item, index) in rightList" :key="item.goods_id">
              <lk-goods-box to="no" :showWaterfall="true" :title="item.goods_name" :price="item.price"
                :origin-price="item.market_price" :image="item.pic_cover" :goods-id="item.goods_id" :sales="item.sales"
                :pic-size="item.pic_size">
                <view slot="bottom">
                  <text v-if="item.id" class="goods-btn yes" @click.stop="onEdit(item.goods_id)">編輯</text>
                  <text v-if="(!item.is_recommend) && item.id" class="goods-btn no"
                    @click.stop="setRec(item.goods_id, 1)">置頂</text>
                  <text v-if="item.is_recommend" class="goods-btn yes" @click.stop="setRec(item.goods_id, 0)">已置頂</text>
                  <text v-if="item.id" class="goods-btn yes"
                    @click.stop="onSelect(item.goods_id, rightList, index)">已挑選</text>
                  <text v-else class="goods-btn no" @click.stop="onNoSelect(item.goods_id, rightList, index)">未挑選</text>
                </view>
              </lk-goods-box>
            </view>
          </view>
        </lk-waterfall>
      </view>
    </lk-load-list>
    <div class="tiaoxuan" @click="onTiaoXuan">
      一鍵挑選
    </div>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import {
  GET_GOODSLIST,
  SELECTGOODS,
  DELGOODS,
  SETREC,
} from "@/common/interface/smallshop";
import waterfall from "@/mixins/waterfall";
import loadMixin from "@/mixins/load-list";
import tabSortScreen from "./component/list/tab-sort-screen";

export default {
  name: "packages-smallshop-goodslist",
  data () {
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
  onLoad (query) {
    const {
      shop_id,
      search_text,
      category_id,
      text,
      is_recommend_goods,
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
    };
  },
  methods: {
    upCallback (page) {
      if (this.start_page && page.num > 1) {
        this.params.page_index = page.num - this.start_page;
      } else {
        this.params.page_index = page.num;
      }
      GET_GOODSLIST(this.params)
        .then(({ data }) => {
          let list = data.data;
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
    downCallback () {
      this.params.last_id = "";
      this.params.uuid = "";
      this.$load.resetUpScroll();
    },
    onTabSort (e) {
      e.page_index = 1;
      this.params.type = "";
      console.log(e);
      this.params = Object.assign({ ...this.params }, { ...e });
      this.params.last_id = "";
      this.params.uuid = "";

      this.start_page = 0;
      this.params.recommend_goods_ids = "";
      this.$refs.waterfallList.clear();
      this.resetList();
    },
    onSearch () {
      this.params.page_index = 1;
      this.params.last_id = "";
      this.params.uuid = "";
      this.start_page = 0;
      this.params.recommend_goods_ids = "";
      this.$refs.waterfallList.clear();
      this.resetList();
    },
    onSelect (goods_id, list, index) {
      this.$Prompt.loading();
      DELGOODS({ goods_id })
        .then((res) => {
          list[index].id = 0;
          this.$Prompt.clear();
        })
        .catch(() => {
          this.$Prompt.clear();
        });
    },
    onNoSelect (goods_id, list, index) {
      this.$Prompt.loading();
      SELECTGOODS({ goods_id })
        .then((res) => {
          list[index].id = 1;
          this.$Prompt.clear();
        })
        .catch(() => {
          this.$Prompt.clear();
        });
    },
    onTiaoXuan () {
      this.$Prompt.loading();
      let _arr = this.list.map((item) => {
        return item.goods_id;
      });
      SELECTGOODS({ goods_id: _arr })
        .then((res) => {
          this.$Prompt.clear();
          this.params.page_index = 1;
          this.params.last_id = "";
          this.params.uuid = "";
          this.start_page = 0;
          this.params.recommend_goods_ids = "";
          this.$refs.waterfallList.clear();
          this.resetList();
        })
        .catch(() => {
          this.$Prompt.clear();
          this.params.page_index = 1;
          this.params.last_id = "";
          this.params.uuid = "";
          this.start_page = 0;
          this.params.recommend_goods_ids = "";
          this.$refs.waterfallList.clear();
          this.resetList();
        });
    },
    onEdit (goods_id) {
      this.$Navigate.push({
        path: "/packages/smallshop/goodsedit",
        query: {
          goods_id: goods_id,
        },
      });
    },
    setRec (goods_id, status) {
      const self = this
      SETREC({ goods_id: goods_id, status: status }).then(async (res) => {
        self.$refs.waterfallList.clear();
        self.resetList().then(() => {
          self.$forceUpdate();
        });
      });
    },
  },
  components: {
    tabSortScreen,
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 176rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}

.tiaoxuan {
  position: fixed;
  padding-top: 10rpx;
  top: 400rpx;
  right: 10rpx;
  width: 80rpx;
  height: 70rpx;
  text-align: center;
  line-height: 30rpx;
  background-color: #1a73e8;
  color: #fff;
  border-radius: 40rpx;
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
      margin-right: 5rpx;
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
