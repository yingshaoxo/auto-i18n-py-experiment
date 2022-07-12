<template>
  <view class="pages">
    <view class="MyScreen Rows">
      <view class="Center matrix">
        <view class="Rows">
          <view class="Columns SpaceBetween">
            <view class="Rows Center">
              <view>今日營業額</view>
              <view>{{ summaryData.today_money }}</view>
            </view>
            <view class="Rows Center">
              <view>昨日營業額</view>
              <view>{{ summaryData.yesterday_money }}</view>
            </view>
            <view class="Rows Center">
              <view>本月營業額</view>
              <view>{{ summaryData.thismonth_money }}</view>
            </view>
          </view>

          <view class="Columns SpaceBetween">
            <view class="Rows Center">
              <view>今日訂單數</view>
              <view>{{ summaryData.today_order_count }}</view>
            </view>
            <view class="Rows Center">
              <view>昨日訂單數</view>
              <view>{{ summaryData.yesterday_order_count }}</view>
            </view>
            <view class="Rows Center">
              <view>本月訂單數</view>
              <view>{{ summaryData.thismonth_order_count }}</view>
            </view>
          </view>

          <view class="Columns SpaceBetween">
            <view class="Rows Center">
              <view>粉絲數</view>
              <view>{{ summaryData.collection }}</view>
            </view>
            <view class="Rows Center">
              <view>商品數</view>
              <view>{{ summaryData.goods_count }}</view>
            </view>
            <view class="Rows Center">
              <view>總傭金</view>
              <view>{{ summaryData.bonus }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="list">
        <view class="Rows">
          <view class="theListTitle">明細</view>
          <lk-load-list ref="load" top="0" @init="loadInit" :down="downOption" @down="downCallback" :up="upOption"
            @up="upCallback">
            <view class="list">
              <view class="item card-group-box">
                <view class="Columns SpaceBetween eachCell" :style="{
                  paddingLeft: '15px',
                  paddingRight: '15px'
                }">
                  <view>日期</view>
                  <view>訂單</view>
                  <view>成交量</view>
                </view>
              </view>
              <view class="item card-group-box" v-for="(item, index) in listOfData" :key="index">
                <view class="Columns SpaceBetween eachCell">
                  <view class="subCell">{{ item.days }}</view>
                  <view class="subCell">{{ item.count }}</view>
                  <view class="subCell">{{ item.pay_money }}</view>
                </view>
              </view>
            </view>
          </lk-load-list>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { PAYLOG } from "@/common/interface/smallshop";
import { GET_SHOP_STATISTICS_DATA, GET_SHOP_STATISTICS_LIST_DATA } from "@/common/interface/shop";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";

export default {
  name: "packages-smallshop-log",
  data () {
    return {
      isProceeds: false,
      params: {
        page_index: 1,
        page_size: 20,
        order_status: "",
        search_text: ""
      },
      upOption: {
        empty: {
          type: "order",
          tip: "暫無訂單"
        }
      },
      summaryData: {
        today_money: 0,
        yesterday_money: 0,
        thismonth_money: 0,
        today_order_count: 0,
        yesterday_order_count: 0,
        thismonth_order_count: 0,
        collection: 0,
        goods_count: 0,
        bonus: 0
      },
      listOfData: [
        // {
        //   days: '日期',
        //   count: '订单',
        //   pay_money: '成交额'
        // },
      ]
    };
  },
  onLoad (query) {
    // this.isProceeds = query.hash == "proceeds";

    GET_SHOP_STATISTICS_DATA({}).then(({ data }) => {
      this.summaryData = {
        ...data
      }
    })
    // .catch(() => {
    //   this.$load.endErr();
    // });

    GET_SHOP_STATISTICS_LIST_DATA({}).then(({ data }) => {
      this.listOfData = data
    })
    // .catch(() => {
    //   this.$load.endErr();
    // });
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts
    })
  },
  methods: {
    upCallback (page) {
      this.params.page_index = page.num;
      setTimeout(() => {
        PAYLOG(this.params).then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.positive {
  color: #4b0;
}

.label,
.time {
  font-size: $font-size-sm;
  color: $text-light;
}

.negative {
  color: #ff454e;
}

.text-through {
  text-decoration: line-through;
}

.Rows {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.Columns {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.Center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.SpaceBetween {
  justify-content: space-between !important;
}

.MyScreen {
  height: 100vh;
}

.matrix {
  height: 30vh !important;
  background-color: #046f47;
  color: white;
}

.theListTitle {
  margin-top: 40px;
  padding: 10px;
  padding-left: 30px;
  margin-left: 30px;
  margin-right: 30px;

  font-weight: bold;

  border: 0.5px solid #ccc !important;
  border-color: rgba(0, 0, 0, 0.8) !important;

  border-radius: 20px;
}

.list {
  flex: auto;
  overflow-y: scroll;
}

.eachCell {
  padding: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.subCell {
  width: 180px;
  text-align: center;
}
</style>