<template>
  <view class="pages">
    <view class="header-search">
      <lk-search
        v-model="params.search_text"
        placeholder="請輸入搜索關鍵字"
        action="搜索"
        @search="onSearch"
      />
    </view>
    <view class="placeholder"></view>
    <view class="tabs" v-if="topicType == 2">
      <view class="box">
        <view
          class="item"
          v-for="(item, index) in tabs"
          :key="index"
          @click="onTabChange(index)"
        >
          <image class="image" :src="item.topic_pic" />
          <view class="text">{{ item.topic_title }}</view>
        </view>
      </view>
    </view>
    <view class="cell-group">
      <lk-cell title="不參與任何話題" clickable @click="onSelect(-1)">
        <view slot="icon" class="left-icon"></view>
      </lk-cell>
      <lk-load-list
        ref="load"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
        @emptyclick="emptyClick"
      >
        <view class="list">
          <lk-cell
            v-for="(item, index) in list"
            :key="index"
            :title="item.topic_title"
            clickable
            icon-prefix="v-icon"
            icon="v-icon-huati1"
            @click="onSelect(index)"
          >
          </lk-cell>
        </view>
      </lk-load-list>
    </view>
  </view>
</template>

<script>
import {
  GET_TOPICLIST,
  GET_NEXTTOPICLIST
} from "@/common/interface/thingcircle";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-thingcircle-release-topic",
  data() {
    return {
      topicType: 0, //話題類型 ， 1級話題，2級話題
      tabs: [],
      params: {
        page_index: 1,
        page_size: 20,
        search_text: "",
        superiors_id: ""
      },
      upOption: {
        auto: false,
        empty: {
          tip: "暫無話題"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_TOPICLIST({
        search_text: this.params.search_text
      }).then(({ data }) => {
        this.tabs = data.data || [];
        this.topicType = data.topic_state == 1 ? 2 : 1;
        if (this.topicType == 1) {
          this.concatList(this.tabs, this.tabs.length);
        } else {
          this.$load.triggerUpScroll();
        }
      });
    },
    loadInitEnd() {},
    upCallback(page) {
      this.params.page_index = page.num;
      GET_NEXTTOPICLIST(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onSearch(e) {
      this.params.params = e;
      this.resetList();
    },
    onTabChange(index) {
      this.params.superiors_id = this.tabs[index].topic_id;
      this.resetList();
    },
    onSelect(index) {
      const item = this.list[index];
      uni.$emit("get-release-topic", {
        title: index === -1 ? "" : item.topic_title,
        id: index === -1 ? "" : item.topic_id
      });
      this.$Navigate.back();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.header-search {
  width: 100%;
  position: fixed;
  left: 0;
  height: 108rpx;
  z-index: 10;
}
.placeholder {
  width: 100%;
  height: 108rpx;
}
.tabs {
  padding: 20rpx 10rpx;
  background-color: #fff;
  height: 168rpx;
  .box {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto hidden;
  }
  .item {
    display: flex;
    flex-flow: column;
    width: 180rpx;
    margin: 0 16rpx;
    .image {
      border-radius: 8rpx;
      width: 180rpx;
      height: 80rpx;
      background-color: $image-background;
    }
    .text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 48rpx;
    }
  }
}
.cell-group {
  margin: 20rpx 0;
}
.item-topic-f {
  font-size: $font-size-lg;
  width: 40rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
}
.left-icon {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 1px solid #494848;
  margin-top: 8rpx;
  position: relative;
  margin-right: 10rpx;
}

.left-icon::before {
  content: "";
  width: 100%;
  height: 2rpx;
  background-color: #494848;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
</style>
