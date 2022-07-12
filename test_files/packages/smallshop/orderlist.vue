<template>
  <view class="pages">
    <view class="header">
      <lk-search v-model="params.search_text" placeholder="訂單號/店鋪名稱/商品名稱" action="搜索" @search="onSearch" />
      <lk-tabs v-model="active" :active-color="theme.color" :line-color="theme.color" slot-title @change="onTabChange">
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          <text>{{ tab.name }}</text>
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-load-list ref="load" top="196" @init="loadInit" :down="downOption" @down="downCallback" :up="upOption"
      @up="upCallback">
      <view class="list">
        <view class="item card-group-box" v-for="(items, index) in list" :key="index">
          <lk-cell icon="shop-o" :title="items.shop_name">
            <view class="price-color">{{ items.status_name }}</view>
          </lk-cell>
          <lk-goods-card v-for="(item, goods_index) in items.order_goods" :key="goods_index" cell-padding lazyLoad
            :to="item.to" :desc="item.spec | filterSpec" :num="item.num" :price="item.price" :title="item.goods_name"
            :image="item.pic_cover" :point="item.goods_point">
            <view slot="footer">
              <block v-if="item.member_operation && item.member_operation.length">
                <lk-button size="mini" round v-for="(btn, btn_index) in item.member_operation" v-if="btn.no == 'detail'"
                  :key="btn_index" @click="onResult(index, item.order_goods_id)">
                  {{ btn.name }}
                </lk-button>
              </block>
            </view>
          </lk-goods-card>
          <lk-cell>
            <view class="cell-pay-text">
              <view v-if="items.order_status != 0 && items.order_status != 5">
                {{ items.pay_type_name }}
              </view>
              <view>{{ items.order_status === 0 ? "待支付" : "實付" }}</view>
              <view class="price-color">{{ items.payText }}</view>
            </view>
          </lk-cell>
          <lk-cell>
            <foot-operate :info="items" :wx_id="params.id" @init="resetList" />
          </lk-cell>
        </view>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
function getTabActive (query) {
  let index = 0;
  if (!isEmpty(query)) {
    const status = parseInt(query.status);
    if (!isNaN(status)) {
      if (status === 0) {
        index = 1;
      } else if (status === 1) {
        index = 2;
      } else if (status === 2) {
        index = 3;
      } else if (status === -2) {
        index = 4;
      } else if (status === -1) {
        index = 5;
      }
    }
  }
  return index;
}

import loadMixin from "@/mixins/load-list";
import { isEmpty, yuan } from "@/common/utils";
import { GET_ORDERLIST } from "@/common/interface/order";
import { mapState } from "vuex";
import footOperate from "./component/foot-operate";
export default {
  name: "packages-smallshop-orderlist",
  data () {
    return {
      active: 0,
      params: {
        page_index: 1,
        page_size: 20,
        id: 0,
        order_status: "",
        search_text: ""
      },
      upOption: {
        empty: {
          type: "order",
          tip: "暫無訂單"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts,
      info: ({ member }) => member.info,
    }),
    tabs () {
      return [
        {
          name: "全部",
          status: ""
        },
        {
          name: `待付款(${this.info.wx_unpaidOrder | 0})`,
          status: 0
        },
        {
          name: `待發貨(${this.info.wx_shipmentPendingOrder | 0})`,
          status: 1
        },
        {
          name: `待收貨(${this.info.wx_goodsNotReceivedOrder | 0})`,
          status: 2
        },
        {
          name: `待評價(${this.info.wx_un_evaluate | 0})`,
          status: -2
        },
        {
          name: `售後(${this.info.wx_refundOrder | 0})`,
          status: -1
        }
      ]
    }
  },
  filters: {
    // 過濾規格數組
    filterSpec (value) {
      if (isEmpty(value)) return "";
      let newArr = [];
      value.forEach(e => {
        let str = e.spec_name + " " + e.spec_value_name;
        newArr.push(str);
      });
      return newArr.join(" , ");
    }
  },
  onLoad (options) {
    const { status, wx_id } = options;
    this.params.order_status = status == undefined ? "" : status;
    this.params.id = wx_id == undefined ? "" : parseInt(wx_id);
    this.active = getTabActive(options);
  },
  methods: {
    upCallback (page) {
      this.params.page_index = page.num;
      GET_ORDERLIST(this.params)
        .then(({ data }) => {
          let list = data.order_list.map(e => {
            e.order_goods = e.order_item_list;
            e.order_goods.forEach(g => {
              g.to = "/packages/order/detail?order_id=" + e.order_id + "&wx_id=" + this.params.id;
            });
            e.payText = this.getPayText(e);
            return e;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTabChange (index) {
      const status = this.tabs[index].status;
      this.params.order_status = status;
      this.resetList();
    },
    onSearch (text) {
      this.params.search_text = text;
      this.resetList();
    },
    getPayText (items) {
      let text = "";
      let { order_type, order_money, order_real_money, order_point } = items;
      if (order_type == 10) {
        // 積分商城的訂單
        let money = parseFloat(order_money) ? yuan(order_money) + " + " : "";
        let point = order_point
          ? order_point + this.memberTexts.point_style
          : "";
        text = money + point;
      } else {
        // 普通訂單
        text = order_real_money;
      }
      return text;
    },
    // 退款/退貨
    onResult (pindex, order_goods_id) {
      const { unrefund, unrefund_reason } = this.list[pindex];
      if (unrefund == 1) {
        return this.$Prompt.modal({
          content: unrefund_reason,
          showCancel: false
        });
      }
      this.$Navigate.push({
        path: "/packages/order/post",
        query: {
          order_goods_id
        }
      });
    }
  },
  components: {
    footOperate
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 196rpx;
  position: fixed;
  width: 100%;
  z-index: 10;
}

.price-color {
  color: $red;
}

.cell-pay-text {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  color: $text-light;
  font-size: $font-size-sm;

  view {
    margin-left: 20rpx;
  }

  .price-color {
    font-size: $font-size;
    color: $red;
  }
}
</style>
