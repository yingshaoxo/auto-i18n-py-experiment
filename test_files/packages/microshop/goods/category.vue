<template>
  <view class="pages">
    <view class="header">
      <lk-search disabled placeholder="請輸入關鍵詞" @click="click" />
    </view>
    <lk-category-nav v-model="active" :navs="navs" top="54">
      <view class="content">
        <view class="item" v-for="(item, i) in content" :key="i">
          <view class="item-head">
            <text
              @click="
                toList(item.category_id, item.short_name || item.category_name)
              "
              >{{ item.short_name || item.category_name }}</text
            >
          </view>
          <view class="item-main">
            <view
              class="item-child"
              v-for="(child, c) in item.third_category"
              :key="c"
            >
              <view
                class="box"
                @click="
                  toList(
                    child.category_id,
                    child.short_name || child.category_name
                  )
                "
              >
                <view class="image-box">
                  <image class="image" :src="child.category_pic" />
                </view>
                <view class="name">
                  {{ child.short_name || child.category_name }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </lk-category-nav>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { GET_GOODSCATEGORY } from "@/common/interface/microshop";
export default {
  name: "packages-microshop-goods-category",
  data() {
    return {
      active: 0,
      navs: [],
      shopkeeper_id: ""
    };
  },
  computed: {
    content() {
      return this.navs[this.active]
        ? this.navs[this.active].second_category
        : [];
    }
  },
  onLoad(query) {
    if (query.shopkeeper_id) {
      this.shopkeeper_id = query.shopkeeper_id;
    }
  },
  onShow() {
    GET_GOODSCATEGORY()
      .then(({ data }) => {
        data.forEach(e => {
          e.name = e.short_name || e.category_name;
        });
        this.navs = data;
      })
      .catch(() => {});
  },
  methods: {
    click(e) {
      let query = {
        type: "microshopgoods"
      };
      if (this.shopkeeper_id) {
        query.shopkeeper_id = this.shopkeeper_id;
      }
      this.$Navigate.push({
        path: "/packages/mall/search",
        query
      });
    },
    toList(id, name) {
      let query = {
        category_id: id,
        text: name
      };
      if (this.shopkeeper_id) {
        query.shopkeeper_id = this.shopkeeper_id;
      }
      this.$Navigate.push({
        path: "/packages/microshop/goods/list",
        query
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
}
.content {
  .item {
    margin: 0px 8rpx 40rpx;
    .item-head {
      color: $text-gray;
      font-weight: 800;
      display: flex;
      align-items: center;
      height: 92rpx;
      padding: 0 10rpx;
      text {
        padding: 12rpx 20rpx;
      }
    }
    .item-main {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      .item-child {
        width: 33.333334%;
        text-align: center;
        .box {
          margin: 8rpx;
        }
        .image-box {
          height: 0;
          width: 100%;
          padding: 50% 0;
          overflow: hidden;
          position: relative;
          .image {
            display: flex;
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
        .name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 12rpx 8rpx 16rpx;
        }
      }
    }
  }
}
</style>
