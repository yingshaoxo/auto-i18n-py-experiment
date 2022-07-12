<template>
  <page-meta
    :background-color="pageStyle.background"
    :page-style="'background:' + pageStyle.background"
  >
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="reform-view">
      <shop-header :items="headerItems" :info="info" />
      <shop-reform-group :show="show" :items="items" />
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import shopHeader from "./component/header";
import shopReformGroup from "./component/shop-reform-group";
import reformLoad from "@/mixins/reform-load";
import { GET_SHOPINFO } from "@/common/interface/shop";
export default {
  name: "packages-shop-home",
  data() {
    return {
      show: false,
      pageStyle: {
        background: "",
        title: ""
      },
      headerItems: {
        params: {},
        style: {}
      },
      info: {}
    };
  },
  mixins: [reformLoad],
  onPullDownRefresh() {
    this.getItems("refresh");
    this.getShopInfo();
  },
  onLoad() {
    this.getItems();
    this.getShopInfo();
  },
  methods: {
    ...mapActions(["getCustom"]),
    getShopInfo() {
      GET_SHOPINFO({ shop_id: this.routeQuery.shop_id }).then(({ data }) => {
        this.info = data;
        this.pageStyle.title = this.info.shop_name;
        this.setWxShare({
          title: this.info.shop_name,
          desc: "我剛剛發現了一個很不錯的店鋪，趕快來看看吧。",
          imgUrl: this.info.shop_logo
        });
      });
    },
    getItems(refresh) {
      if (refresh) {
        this.show = false;
      }
      this.getCustom({ type: 2, shop_id: this.routeQuery.shop_id }).then(
        ({ items, page }) => {
          this.show = true;
          refresh && this.resetItems();
          const newItems = this.initCustomData(items);
          this.pageStyle.background = page.background;
          this.initLoadItems(newItems);
        }
      );
    },
    initCustomData(templateItems = {}) {
      let newItems = {};
      const arr = ["shop_head"];
      for (let key in templateItems) {
        const item = templateItems[key];
        if (arr.indexOf(item.id) != -1) {
          this.headerItems = item;
        } else {
          newItems[key] = item;
        }
      }
      return newItems;
    }
  },
  components: {
    shopHeader,
    shopReformGroup
  }
};
</script>

<style lang="scss" scoped></style>
