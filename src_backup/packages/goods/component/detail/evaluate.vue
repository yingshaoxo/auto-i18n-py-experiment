<template>
  <view class="evaluate card-group-box">
    <lk-cell
      :title="titleText"
      :title-right="cellTitle.rightText"
      :is-link="cellTitle.isLink"
      :border="false"
      :to="cellTitle.to"
    />
    <view class="list" v-if="list.length">
      <view class="items lk-cell" v-for="(item, index) in list" :key="index">
        <lk-cell :border="false" :title="item.name" :label="item.explainText">
          <image class="image" :src="item.image" slot="icon" />
          <view class="time" slot="rightIcon">{{ item.time }}</view>
        </lk-cell>
        <view class="item">
          <view class="content">{{ item.content }}</view>
          <view class="imgs" v-if="item.images[0]">
            <lk-cell-image-panel :list="item.images" />
          </view>
        </view>
        <view class="item" v-if="item.explain_first">
          <view class="title">[商家回復]：</view>
          <view class="content">{{ item.explain_first }}</view>
        </view>
        <view class="item" v-if="item.again_content || item.again_images[0]">
          <view class="title">追評：</view>
          <view class="content">{{ item.again_content }}</view>
          <view class="imgs" v-if="item.again_images[0]">
            <lk-cell-image-panel :list="item.again_images" />
          </view>
        </view>
        <view class="item" v-if="item.again_explain">
          <view class="title">[追評回复]：</view>
          <view class="content">{{ item.again_explain }}</view>
        </view>
      </view>
    </view>
    <view class="empty" v-else>暫無評價</view>
  </view>
</template>

<script>
function explainText(value) {
  let text = "";
  if (value == 5) {
    text = "好評";
  } else if (value == 3) {
    text = "中評";
  } else if (value == 1) {
    text = "差評";
  }
  return text;
}

import { GET_GOODSEVALUATE } from "@/common/interface/goods";
import { formatDate } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    const goods_id = this.info.goods_id || null;
    return {
      evaluate_count: 0,
      imgs_count: 0,
      praise_count: 0,
      center_count: 0,
      bad_count: 0,

      list: [],

      params: {
        goods_id,
        page_index: 1,
        page_size: 20,
        is_image: null,
        explain_type: null
      }
    };
  },
  props: {
    info: Object
  },
  watch: {
    // params: {
    //   deep: true,
    //   handler(n, o) {
    //     this.loadData();
    //   }
    // }
  },
  computed: {
    ...mapGetters(["static"]),
    tabs() {
      return [
        {
          name: "全部",
          type: null,
          count: this.evaluate_count,
          title: `全部(${this.evaluate_count})`
        },
        {
          name: "圖片",
          type: true,
          count: this.imgs_count,
          title: `圖片(${this.imgs_count})`
        },
        {
          name: "好評",
          type: 5,
          count: this.praise_count,
          title: `好評(${this.praise_count})`
        },
        {
          name: "中評",
          type: 3,
          count: this.center_count,
          title: `中評(${this.center_count})`
        },
        {
          name: "差評",
          type: 1,
          count: this.bad_count,
          title: `差評(${this.bad_count})`
        }
      ];
    },
    titleText() {
      return `商品評價(${this.evaluate_count || 0})`;
    },
    cellTitle() {
      return {
        rightText: this.list.length ? "查看全部" : "",
        isLink: !!this.list.length,
        to: this.list.length
          ? "/packages/goods/evaluate?goods_id=" + this.params.goods_id
          : ""
      };
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      GET_GOODSEVALUATE(this.params)
        .then(({ data }) => {
          this.list = this.filterList(data.review_list);
          this.evaluate_count = data.evaluate_count;
          this.imgs_count = data.imgs_count;
          this.praise_count = data.praise_count;
          this.center_count = data.center_count;
          this.bad_count = data.bad_count;
        })
        .catch(e => {});
    },
    onTab(index) {
      const type = this.tabs[index].type;
      if (type === true) {
        this.params.is_image = true;
        this.params.explain_type = null;
      } else {
        this.params.is_image = null;
        this.params.explain_type = type;
      }
    },
    filterList(list = []) {
      let arr = [];
      list.forEach((item, index) => {
        if (index < 3) {
          arr.push({
            ...item,
            image: item.user_img || this.static.noAvatar,
            name: item.user_name || item.nick_name || "匿名",
            explainText: explainText(item.explain_type),
            time: formatDate(item.addtime)
          });
        }
      });
      return arr;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.evaluate {
  background: #fff;
  .items {
    position: relative;
    display: flex;
    flex-flow: column;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    color: $text-color;
    font-size: $font-size;
    line-height: 48rpx;
    background-color: #fff;
    padding: 0;
    .image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: block;
      overflow: hidden;
      margin-right: 20rpx;
    }
    .time {
      font-size: $font-size-sm;
    }
    .item {
      padding: 20rpx 30rpx;
      .title {
        font-size: $font-size-sm;
        color: #af7119;
      }
    }
  }
}
</style>
