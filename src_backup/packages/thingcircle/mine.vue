<template>
  <view class="pages">
    <lk-header-panel :avatar="info.user_headimg" :name="info.thing_user_name">
      <view class="info">
        <view class="num-text" v-if="info.thing_circle_uid">
          好物圈號：{{ info.thing_circle_uid }}
        </view>
      </view>
      <view slot="right">
        <view class="btn-set" @tap="toLink('/pages/message/index')">
          <lk-icon name="chat-o" square size="20" color="#ffffff" />
        </view>
      </view>
    </lk-header-panel>
    <view class="header-tab">
      <view class="item" @click="toLink('/packages/thingcircle/follow')">
        <view>關注</view>
        <view class="num">{{ info.attentText || 0 }}</view>
      </view>
      <view class="item" @click="toLink('/packages/thingcircle/fans')">
        <view>粉絲</view>
        <view class="num">{{ info.fansText || 0 }}</view>
      </view>
      <view class="item">
        <view>獲贊</view>
        <view class="num">{{ info.likesText || 0 }}</view>
      </view>
    </view>
    <lk-tabs
      v-model="active"
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="3"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">
        <text>{{ tab.name }}</text>
      </lk-tab>
    </lk-tabs>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <block v-if="showType == 1">
          <daily-column
            v-for="(items, index) in list"
            :key="index"
            :items="items"
          ></daily-column>
        </block>
        <block v-if="showType == 2">
          <lk-waterfall v-model="list" ref="waterfallList" @get-list="getList">
            <view class="left-list" slot="left">
              <diallel-column
                v-for="(items, index) in leftList"
                :key="index"
                :items="items"
              />
            </view>
            <view class="right-list" slot="right">
              <diallel-column
                v-for="(items, index) in rightList"
                :key="index"
                :items="items"
              />
            </view>
          </lk-waterfall>
        </block>
      </view>
    </lk-load-list>
    <footer-tab :active="2" />
  </view>
</template>

<script>
import {
  GET_THINGCIRCLEUSERINFO,
  GET_THINGCIRCLEUSERLIST
} from "@/common/interface/thingcircle";
import footerTab from "@/pages/thingcircle/component/footer-tab";
import diallelColumn from "@/pages/thingcircle/component/diallel-column";
import dailyColumn from "./component/daily-column";
import { wan } from "@/common/utils";
import loadMixin from "@/mixins/load-list";
import thingcircleMixin from "@/mixins/thingcircle";
export default {
  name: "packages-thingcircle-mine",
  data() {
    return {
      showType: 1, //顯示類型，1單排，2兩列
      info: {},

      active: 0,
      tabs: [
        { name: "乾貨", type: "" },
        { name: "收藏", type: 2 },
        { name: "點贊", type: 3 }
      ],
      params: {
        page_index: 1,
        page_size: 10,
        thing_option: ""
      },
      leftList: [],
      rightList: []
    };
  },
  mixins: [loadMixin, thingcircleMixin],
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_THINGCIRCLEUSERINFO().then(({ data }) => {
        data.attentText = wan(data.attentions);
        data.fansText = wan(data.fans);
        data.likesText = wan(data.likes);
        data.thing_user_name = data.thing_user_name || "匿名";
        this.info = data;
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_THINGCIRCLEUSERLIST(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.showType = data.display_model == 1 ? 2 : 1;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      this.params.thing_option = this.tabs[index].type;
      if (this.showType == 2) {
        this.$refs.waterfallList.clear();
      }
      this.resetList();
    },
    getList(lists) {
      this.leftList = lists.left;
      this.rightList = lists.right;
    },
    toLink(to) {
      this.$Navigate.push(to);
    }
  },
  components: {
    footerTab,
    diallelColumn,
    dailyColumn
  }
};
</script>

<style lang="scss" scoped>
.num-text {
  font-size: $font-size-sm;
}
.header-tab {
  display: flex;
  flex-flow: row;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 20rpx;
  .item {
    flex: 1;
    line-height: 40rpx;
    padding: 20rpx;
    font-size: $font-size-sm;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    color: $text-gray;
    .num {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100rpx;
      padding: 0 8rpx;
    }
  }
}
</style>
