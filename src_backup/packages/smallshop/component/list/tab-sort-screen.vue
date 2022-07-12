<template>
  <view
    class="header"
    :class="{ 'tab-top': isCurrent }"
    :style="fixed ? 'position:fixed;' : 'position:relative'"
  >
    <lk-tabs
      slot-title
      :active-color="theme.color"
      :line-color="theme.color"
      :nav-per-view="isSelect ? '5' : '4'"
      :line="false"
    >
      <lk-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :disabled="tab.disabled"
      >
        <view
          class="tab-item"
          :class="tab.disabled ? 'disabled-color' : ''"
          @click="onSort(index)"
        >
          <text>{{ tab.name }}</text>
          <view
            v-if="tab.icon"
            :style="{
              transform:
                tab.sort_type == 'DESC' ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          >
            <lk-icon :name="tab.icon" class-prefix="v-icon" />
          </view>
        </view>
      </lk-tab>
    </lk-tabs>
    <lk-popup v-model="show" position="right">
      <view class="screen-popup">
        <view class="theCategoryContainer">
          <view v-for="(child, c) in category_items" :key="c">
            <view class="oneItem" @click="onOonfirm(child.category_id)">
              <view class="oneItemImage">
                <img :src="child.category_pic" />
              </view>
              <view class="oneItemText">
                {{ child.short_name || child.category_name }}
              </view>
            </view>
          </view>
        </view>
        <!-- <lk-category-nav v-model="active" :navs="navs" top="54">
          <view class="content">
            <view class="item" v-for="(item, i) in content" :key="i">
              <view class="item-head">
                <text @click="onOonfirm(item.category_id)">{{
                  item.short_name || item.category_name
                }}</text>
              </view>
              <view class="item-main">
                <view
                  class="item-child"
                  v-for="(child, c) in item.third_category"
                  :key="c"
                >
                  <view class="box" @click="onOonfirm(item.category_id)">
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
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { GET_MEMBERSETTEXT } from "@/common/interface/member";
import { GET_GOODSCATEGORY } from "@/common/interface/goods";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      url_wx_id: "",
      category_items: [],
      tabs: [
        {
          name: "默認",
          sort: "",
        },
        {
          name: "銷售量",
          icon: "v-icon-sort2",
          sort: "sales",
          sort_type: "DESC",
        },
        {
          name: "價格",
          icon: "v-icon-sort2",
          sort: "price",
          sort_type: "DESC",
        },
        {
          name: "分類",
          icon: "v-icon-screen",
          disabled: true,
          sort: false,
        },
      ],
      show: false,
      tags: [
        {
          name: "推薦",
          type: "is_recommend",
          selected: false,
        },
        {
          name: "新品",
          type: "is_new",
          selected: false,
        },
        {
          name: "熱賣",
          type: "is_hot",
          selected: false,
        },
        {
          name: "促銷",
          type: "is_promotion",
          selected: false,
        },
        {
          name: "包郵",
          type: "is_shipping_free",
          selected: false,
        },
      ],
      tagParams: {
        min_price: "",
        max_price: "",
        is_recommend: 0,
        is_new: 0,
        is_hot: 0,
        is_promotion: 0,
        is_shipping_free: 0,
        category_id: "",
      },
      active: 0,
      navs: [],
    };
  },
  props: {
    fixed: {
      type: Boolean,
      default: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      wx_id_from_vuex: (object) => {
        return object.member.info.wx_id;
      },
    }),
    content() {
      return this.navs[this.active]
        ? this.navs[this.active].second_category
        : [];
    },
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.url_wx_id = urlParams.get("wx_id"); //this.routeInfo.query.wx_id

    if (this.isSelect) {
      if (this.shouldShowSelectedButton()) {
        this.tabs.splice(3, 0, {
          name: "已挑選",
          icon: "",
          sort: false,
        });
      }
    }

    // setTimeout(() => {
    //   if (!this.isMyShop()) {
    //     this.tabs = this.tabs.filter((e) => e.name != "已挑選");
    //   }
    // }, 500);

    GET_MEMBERSETTEXT().then((res) => {
      if (res.config.addons.membercard == 1) {
        this.tags.push({
          name: res.data.plus,
          type: "is_plus_member",
          selected: false,
        });
      }
    });
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
    isMyShop() {
      return this.url_wx_id == this.wx_id_from_vuex;
    },
    shouldShowSelectedButton() {
      const urlParams = new URLSearchParams(window.location.search);
      const previous_route = urlParams.get("previous_route");
      if (
        previous_route == "home" ||
        previous_route == "guangguang" ||
        previous_route == "collection" ||
        previous_route == "myShop"
      ) {
        return false;
      } else {
        return true;
      }
    },
    // 商品排序
    onSort(index) {
      if (index == 0) {
        //默认, 清空选项
        let params = {};
        this.$emit("change", params);

        this.onReset();
        this.tagParams.category_id = 0;
        this.$emit("change", this.tagParams);
      }

      if (index == this.tabs.length - 1) {
        this.show = true;
        return;
      }
      if (index == 3) {
        this.$emit("change", { type: 2 });
        return;
      }
      let params = {};
      params.order = this.tabs[index].sort;
      if (this.tabs[index].sort_type) {
        //升序降序
        params.sort = this.tabs[index].sort_type;
        if (this.tabs[index].sort_type == "DESC") {
          this.tabs[index].sort_type = "ASC";
        } else {
          this.tabs[index].sort_type = "DESC";
        }
      } else {
        // 默認
        params.sort = "";
      }

      this.$emit("change", params);
    },
    // 選擇標籤
    tagSelect(index, flag) {
      this.tags[index].selected = !flag;
      this.tagParams[this.tags[index].type] = this.tags[index].selected ? 1 : 0;
    },
    // 重置篩選
    onReset() {
      this.tagParams.min_price = "";
      this.tagParams.max_price = "";
      this.tagParams.is_recommend = 0;
      this.tagParams.is_new = 0;
      this.tagParams.is_hot = 0;
      this.tagParams.is_promotion = 0;
      this.tagParams.is_shipping_free = 0;
      this.tags.forEach((e) => {
        e.selected = false;
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
    // 確認篩選
    onOonfirm(category_id) {
      this.tagParams.min_price = this.tagParams.min_price
        ? parseFloat(this.tagParams.min_price)
        : "";
      this.tagParams.max_price = this.tagParams.max_price
        ? parseFloat(this.tagParams.max_price)
        : "";
      this.tagParams.category_id = category_id;
      this.show = false;
      this.$emit("change", this.tagParams);
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}

.tab-top {
  top: 0;
}

.tab-item {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.disabled-color {
  color: $text-color;
}

.screen-popup {
  position: relative;
  width: 100vw;
  height: 100%;
  background: #ffffff;
  // overflow: hidden;

  .condition-group {
    display: flex;
    padding: 20rpx;
    border-bottom: 2rpx solid #ddd;
  }

  .btn-group {
    display: flex;
    flex-wrap: wrap;
    padding: 10rpx;
    border-bottom: 2rpx solid #ddd;
  }

  .btn-group .btn-box {
    width: 50%;
    padding: 10rpx;
  }

  .btn-group .btn.selected {
    background: $red;
    color: #ffffff;
  }

  .price-range {
    padding: 30rpx 20rpx 0px;
    color: $text-gray;
  }

  .input-group {
    display: flex;
    align-items: center;
    flex-flow: row;
  }

  .input-group .input-group-addon {
    padding: 20rpx;
    color: $text-gray;
  }

  .foot {
    position: absolute;
    bottom: 0;
    display: flex;
    z-index: 1;
    width: 100%;
    align-items: center;
  }

  .foot .btn {
    flex: 1;
    text-align: center;
    line-height: 100rpx;
    height: 100rpx;
  }

  .foot .btn.reset {
    background: #f8f8f8;
    color: $text-gray;
  }

  .foot .btn.sub {
    background: $red;
    color: #ffffff;
  }
}

.theCategoryContainer {
  overflow-y: scroll;
  height: 100vh;
  width: 100vw;

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
</style>
