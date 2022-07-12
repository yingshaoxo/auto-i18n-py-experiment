<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加載中</text></lk-loading>
      </view>
      <block v-if="viewLoaded">
        <view v-for="(item, index) in list" :key="index">
          <shop-panel-group
            :to="item.to"
            :logo="item.logo"
            :title="item.title"
            :score="item.score"
            :distance="item.distance"
            :desc="item.desc"
            :goods="item.goods"
            :collection="item.collection"
            :fictitious_collection="item.fictitious_collection"
            :goods_count="item.goods_count"
            :fictitious_order="item.fictitious_order"
            :backgroundImage="item.background"
          >
          </shop-panel-group>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain } from "@/common/utils";
import { GET_STORELIST } from "@/common/interface/store";
import shopPanelGroup from "@/pages/store/component/panel-group";

export default {
  data() {
    return {
      isShopStore: false,
      params: {
        page_index: 1,
        page_size: 20,
        order: "distance",
        sort: "ASC",
        lng: "",
        lat: "",
        search_text: "",
      },
      list: [],
    };
  },
  mixins: [reform],
  computed: {},
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getLocation().then((res) => {
        this.params.lat = res.lat;
        this.params.lng = res.lng;
        this.getStoreList()
          .then((list) => {
            this.viewLoading = false;
            console.log(list);
            this.list = list;
            this.viewLoaded = true;
          })
          .catch(() => {
            this.viewLoading = false;
            this.viewError = true;
          });
      });
    });
  },
  methods: {
    ...mapActions(["getLocation"]),
    getStoreList() {
      return new Promise((resolve, reject) => {
        GET_STORELIST(this.params, { isShopStore: this.isShopStore })
          .then(({ data }) => {
            let num = parseInt(this.items.params.recommendnum);
            let list = [];
            data.store_list.forEach((e, i) => {
              let goods = [];
              if (this.items.params.show_goods == 1) {
                e.goods.forEach((g) => {
                  goods.push({
                    goods_id: g.goods_id,
                    image: g.pic_cover_small,
                    price: g.price,
                  });
                });
              }
              if (i < num) {
                list.push({
                  to:
                    "/packages/smallshop/home?wx_id=" +
                    e.id +
                    "&previous_route=home",
                  title: e.shop_name,
                  logo: e.logo,
                  background: e.background,
                  goods: goods,
                  collection: e.collection,
                  goods_count: e.goods_count,
                  fictitious_collection: e.fictitious_collection,
                  fictitious_order: e.fictitious_order,
                });
              }
            });
            resolve(list);
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
  components: {
    shopPanelGroup,
  },
};
</script>

<style scoped lang="scss"></style>
