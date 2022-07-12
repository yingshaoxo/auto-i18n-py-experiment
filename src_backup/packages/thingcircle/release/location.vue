<template>
  <view class="pages">
    <view class="header-search">
      <lk-search
        v-model="params.query"
        placeholder="請輸入搜索關鍵字"
        action="搜索"
        @search="onSearch"
      />
    </view>
    <view class="placeholder"></view>
    <view class="cell-group">
      <lk-cell title="不顯示位置" clickable @click="onSelect(-1)">
        <view slot="icon" class="left-icon"></view>
      </lk-cell>
      <!-- <lk-load-list
        ref="load"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
        @emptyclick="emptyClick"
      > -->
      <view class="list">
        <lk-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.name"
          :label="item.address"
          clickable
          @click="onSelect(index)"
        >
        </lk-cell>
      </view>
      <!-- </lk-load-list> -->
    </view>
  </view>
</template>

<script>
import { GET_THINGCIRCLEAREA } from "@/common/interface/thingcircle";
// import loadMixin from "@/mixins/load-list";
import { mapActions } from "vuex";
export default {
  name: "packages-thingcircle-release-location",
  data() {
    return {
      tabs: [],
      list: [],
      params: {
        page_index: 1,
        page_size: 30,
        lat: "",
        lng: "",
        query: ""
      },
      upOption: {
        auto: false,
        empty: {
          tip: "暫無位置"
        }
      }
    };
  },
  // mixins: [loadMixin],
  onLoad() {
    this.getList();
  },
  methods: {
    ...mapActions(["getLocation"]),
    getList() {
      this.getLocation({ showLoading: true }).then(res => {
        this.params.lat = res.lat;
        this.params.lng = res.lng;
        let query = ["公司企業", "交通設施", "教育培訓", "金融"].join("$");
        if (this.params.query) {
          query = this.params.query;
        }
        GET_THINGCIRCLEAREA(
          {
            ...this.params,
            query: query
          },
          { isShowLoading: true }
        )
          .then(({ data }) => {
            let list = data.results || [];
            this.list = list;
          })
          .catch(() => {});
      });
    },
    loadInitEnd() {
      this.getLocation({ showLoading: true }).then(res => {
        this.params.lat = res.lat || "23.130747";
        this.params.lng = res.lng || "113.401879";
        this.$load.triggerUpScroll();
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      let query = ["公司企業", "交通設施", "教育培訓", "金融"].join("$");
      if (this.params.query) {
        query = this.params.query;
      }
      GET_THINGCIRCLEAREA({
        ...this.params,
        query: query
      })
        .then(({ data }) => {
          let list = data.results || [];
          this.concatList(list, data.total);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onSearch(e) {
      this.params.query = e;
      this.getList();
    },
    onSelect(index) {
      const item = this.list[index];
      uni.$emit("get-release-location", {
        title: index === -1 ? "" : item.name,
        lat: index === -1 ? "" : item.location.lat,
        lng: index === -1 ? "" : item.location.lng
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
.cell-group {
  margin: 20rpx 0;
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
