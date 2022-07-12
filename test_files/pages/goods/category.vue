<template>
  <view class="pages">
    <!-- #ifndef APP-PLUS -->
    <v-google-translate
      v-show="false"
      :languages="[
        {
          code: 'en',
          name: 'English',
          cname: '英语',
          ename: 'English',
        },
        {
          code: 'zh-TW',
          name: 'Chinese (Traditional)',
          cname: '中文 (繁体)',
          ename: 'Chinese (Traditional)',
        },
      ]"
    ></v-google-translate>
    <!--  #endif -->
    <view class="header">
      <lk-search disabled placeholder="請輸入關鍵詞" @click="click" />
    </view>
    <div class="viewContainer">
      <view class="theCategoryContainer">
        <view v-for="(child, c) in category_items" :key="c">
          <view
            class="oneItem"
            @click="
              toList(child.category_id, child.short_name || child.category_name)
            "
          >
            <view class="oneItemImage">
              <img :src="child.category_pic" />
            </view>
            <view class="oneItemText">
              {{ child.short_name || child.category_name }}
            </view>
          </view>
        </view>
      </view>
    </div>
    <!-- <lk-category-nav v-model="active" :navs="navs" top="54">
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
    </lk-category-nav> -->
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapState } from "vuex";
import { GET_GOODSCATEGORY } from "@/common/interface/goods";
export default {
  name: "pages-goods-category",
  data() {
    return {
      active: 0,
      navs: [],
      category_items: [],
    };
  },
  computed: {
    content() {
      return this.navs[this.active]
        ? this.navs[this.active].second_category
        : [];
    },
  },
  onLoad() {},
  onShow() {
    GET_GOODSCATEGORY()
      .then(({ data }) => {
        data.forEach((e) => {
          e.name = e.short_name || e.category_name;
        });
        this.navs = data;
        this.category_items = this.getAllContentItems(data);
      })
      .catch(() => {});
  },
  methods: {
    click(e) {
      this.$Navigate.push({
        path: "/packages/mall/search",
        query: {
          type: "goods",
        },
      });
    },
    toList(id, name) {
      this.$Navigate.push({
        path: "/pages/goods/list",
        query: {
          category_id: id,
          text: name,
        },
      });
    },
    getAllContentItems(theData) {
      if (!theData) {
        return [];
      } else {
        // third_category
        let items = [];
        for (const each of Object.values(theData)) {
          const second = each.second_category;
          if (second) {
            for (const each2 of second) {
              items = [...items, ...each2.third_category];
            }
          }
        }
        return items;
      }
    },
  },
  components: {},
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

.theCategoryContainer {
  position: relative;
  overflow-y: scroll;

  height: 100%;
  width: 100%;

  padding-top: 100px;
  padding-bottom: 50px;

  display: grid;
  grid-template-columns: auto auto auto;
  row-gap: 20px;
  column-gap: 20px;

  .oneItem {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    .oneItemImage {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
    }

    img {
      width: 100%; /* or any custom size */
      height: 100%;
      object-fit: contain;
    }

    .oneItemText {
      // width: 100%;
      // height: 100%;
    }
  }
}

.viewContainer {
}
</style>
