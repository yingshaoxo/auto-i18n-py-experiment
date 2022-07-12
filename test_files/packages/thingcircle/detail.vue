<template>
  <view class="pages">
    <detail-navbar
      v-if="activeItem"
      :active="active"
      :type="pageType"
      :info="activeItem"
      @action="onBarAction"
      @click-share="isShowSharePopup = true"
    />
    <detail-swiper
      v-if="items[active]"
      :type="pageType"
      :items="items"
      @change="onChange"
    />
    <detail-goods-group
      v-model="showGoods"
      :type="pageType"
      :list="goodsList"
    />
    <detail-info-group
      v-if="activeItem"
      :type="pageType"
      :info="activeItem"
      @show-goods-popup="onShowGoodsPopup"
    />
    <view v-if="activeItem && pageType == 'imgtext'">
      <lk-load-list
        ref="load"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
      >
        <view>
          <comment-item
            v-for="(item, index) in list"
            :key="index"
            :items="item"
            :name="index"
            :thing-info="activeItem"
            @get-more="getMoreReply"
            @init-list="resetList"
            @reply="onShowPopup"
          />
        </view>
      </lk-load-list>
    </view>
    <view v-if="activeItem && pageType == 'video'">
      <lk-popup
        v-model="showCommentPopup"
        title="全部評論"
        round
        closeable
        position="bottom"
      >
        <view class="comment-list">
          <lk-load-list-view
            ref="load"
            :fixed="false"
            @init="loadInit"
            :down="downOption"
            @down="downCallback"
            :up="upOption"
            @up="upCallback"
          >
            <comment-item
              v-for="(item, index) in list"
              :key="index"
              :items="item"
              :name="index"
              :thing-info="activeItem"
              @get-more="getMoreReply"
              @init-list="resetList"
              @reply="onShowPopup"
            />
          </lk-load-list-view>
        </view>
      </lk-popup>
    </view>
    <detail-send-popup
      v-model="showPopup"
      :options="popupOptions"
      @init-list="resetList"
    />
    <detail-foot-side-bar
      v-if="activeItem"
      :active="active"
      :type="pageType"
      :info="activeItem"
      @action="onBarAction"
      @say="onShowPopup"
      @show-comment="onCommentPopup"
    />
    <detail-share-popup
      v-if="activeItem"
      v-model="isShowSharePopup"
      :info="activeItem"
    />
  </view>
</template>

<script>
import {
  GET_THINGCIRCLEDETAIL,
  GET_COMMENTLIST
} from "@/common/interface/thingcircle";
import detailNavbar from "./component/detail/navbar";
import detailSwiper from "./component/detail/swiper";
import detailInfoGroup from "./component/detail/info-group";
import detailFootSideBar from "./component/detail/foot-side-bar";
import commentItem from "./component/detail/comment-item";
import detailSendPopup from "./component/detail/send-popup";
import detailGoodsGroup from "./component/detail/goods-group";
import detailSharePopup from "./component/detail/share-popup";
import loadMixin from "@/mixins/load-list";
import thingcircleMixin from "@/mixins/thingcircle";
import { mapState } from "vuex";
export default {
  name: "packages-thingcircle-detail",
  data() {
    return {
      /**
       * 頁面類型
       * imgtext 圖文
       * video 視頻
       */
      pageType: "imgtext",
      thing_id: "", //當前好物id

      active: 0,

      items: [],

      commentParams: {
        page_index: 1,
        page_size: 20,
        thing_id: ""
      },

      showGoods: false,

      showPopup: false,
      popupOptions: {
        content: ""
      },
      showCommentPopup: false,
      upOption: {
        auto: true
      },
      isShowSharePopup: false
    };
  },
  mixins: [loadMixin, thingcircleMixin],
  computed: {
    activeItem() {
      const active = this.active;
      let item = this.items[active];
      return item;
    },
    goodsList() {
      return this.activeItem ? this.activeItem.recommend_goods_list || [] : [];
    }
  },
  onLoad(query) {
    this.pageType = query.type;
    this.thing_id = query.thing_id;
    this.params = {
      thing_id: query.thing_id
    };
    this.commentParams.thing_id = query.thing_id;
    if (query.uid) {
      this.params.uid = decodeURIComponent(query.uid);
    }
    if (this.pageType == "video") {
      this.params.page_index = 1;
      this.params.page_size = 10;
      this.upOption.auto = false;
    }
    this.getData();
  },
  onShow() {
    if (this.pageType == "video") {
      // #ifndef H5
      // 保持屏幕常亮
      uni.setKeepScreenOn({
        keepScreenOn: true
      });
      // #endif
    }
  },
  onHide() {
    if (this.pageType == "video") {
      // #ifndef H5
      uni.setKeepScreenOn({
        keepScreenOn: false
      });
      // #endif
    }
  },
  methods: {
    getData() {
      GET_THINGCIRCLEDETAIL(this.params, { pageType: this.pageType })
        .then(({ data }) => {
          this.items = this.pageType == "video" ? data.data || [] : [data];
        })
        .catch(() => {});
    },
    onChange(index) {
      this.active = index;
      this.thing_id = this.activeItem.id;
      this.params.thing_id = this.activeItem.id;
      this.commentParams.thing_id = this.activeItem.id;
      this.setThingcircleShare();
    },
    onBarAction(index, data) {
      let item = this.items[this.active];
      for (const key in data) {
        item[key] = data[key];
      }
    },
    upCallback(page) {
      this.commentParams.page_index = page.num;
      GET_COMMENTLIST(this.commentParams)
        .then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    getMoreReply(index, data) {
      let item = this.list[index];
      item.reply_list = data;
    },
    onShowPopup(data) {
      this.popupOptions = data;
      this.showPopup = true;
    },
    onCommentPopup() {
      this.showCommentPopup = true;
      this.resetList();
    },
    onShowGoodsPopup() {
      this.showGoods = true;
    }
  },
  components: {
    detailNavbar,
    detailSwiper,
    detailInfoGroup,
    detailFootSideBar,
    commentItem,
    detailSendPopup,
    detailGoodsGroup,
    detailSharePopup
  }
};
</script>

<style lang="scss" scoped>
.comment-list {
  width: 100%;
  height: 70vh;
  overflow-y: auto;
}
</style>
