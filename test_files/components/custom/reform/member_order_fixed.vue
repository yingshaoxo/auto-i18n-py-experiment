<template>
  <view :class="items.id">
    <lk-grid-panel
      card
      :cols="panelItems.length"
      icon-prefix="v-icon"
      icon-size="22"
      :icon-color="theme.color"
      :items="panelItems"
    >
      <lk-cell
        slot="header"
        is-link
        :title="items.params.title"
        :title-right="items.params.remark"
        to="/pages/order/list"
      >
      </lk-cell>
    </lk-grid-panel>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  mixins: [reform],
  computed: {
    ...mapState(["member"]),
    panelItems() {
      const { info } = this.member;
      const { data } = this.items;
      const arr = [];
      for (let i in data) {
        if (data[i].is_show == "1") {
          let obj = {};
          switch (data[i].key) {
            case "unpaid":
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.unpaidOrder || "",
                link: "/pages/order/list?status=0",
                to: "/pages/order/list?status=0",
                status: 0
              };
              arr.push(obj);
              break;
            case "unshipped":
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.shipmentPendingOrder || "",
                link: "/pages/order/list?status=1",
                to: "/pages/order/list?status=1",
                status: 1
              };
              arr.push(obj);
              break;
            case "unreceived":
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.goodsNotReceivedOrder || "",
                link: "/pages/order/list?status=2",
                to: "/pages/order/list?status=2",
                status: 2
              };
              arr.push(obj);
              break;
            case "unevaluated":
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.un_evaluate_num || "",
                link: "/pages/order/list?status=-2",
                to: "/pages/order/list?status=-2",
                status: -2
              };
              arr.push(obj);
              break;
            case "aftersale":
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.refundOrder || "",
                link: "/pages/order/list?status=-1",
                to: "/pages/order/list?status=-1",
                status: -1
              };
              arr.push(obj);
              break;
          }
        }
      }
      return arr;
    }
  },
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.head-text {
  font-size: $font-size-sm;
}
.box {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  line-height: 40rpx;
  padding: 20rpx 0;
  .title {
  }
  .text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 40rpx;
  }
}
</style>
