<template>
  <view class="pages">
    <!-- #ifndef H5 -->
    <lk-navbar
      immersive
      route-title
      :title-color="nbStyle.color"
      :back-icon-color="nbStyle.color"
      :background="{ background: nbStyle.background }"
    />
    <!-- #endif -->
    <lk-header-panel
      top-bar
      :avatar="info.user_headimg"
      :name="info.name"
      margin-bottom="-80"
    >
      <view class="info">
        <view class="text-item">
          <view v-if="info.channel_grade_name">
            等級：{{ info.channel_grade_name }}
          </view>
          <view v-if="info.referee_name">推薦人：{{ info.referee_name }}</view>
          <view v-if="info.to_channel_time">
            加入時間：{{ info.to_channel_time }}
          </view>
        </view>
      </view>
    </lk-header-panel>
    <lk-grid-panel
      card
      cols="4"
      icon-prefix="v-icon"
      icon-size="22"
      :icon-color="theme.color"
      :items="orderCardItems"
    />
    <lk-grid-panel card cols="3" :items="cardItems" />
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { GET_CENTREINFO } from "@/common/interface/channel";
import { formatDate } from "@/common/utils";
import navbarStyle from "@/mixins/navbar-style";
export default {
  name: "pages-channel-index",
  data() {
    return {
      info: {}
    };
  },
  mixins: [navbarStyle],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    ...mapGetters(["static"]),
    orderCardItems() {
      return [
        {
          title: "采購訂單",
          icon: "v-icon-form",
          to: "/packages/channel/order/list?type=purchase"
        },
        {
          title: "提貨訂單",
          icon: "v-icon-form",
          to: "/packages/channel/order/list?type=pickupgoods"
        },
        {
          title: "出貨訂單",
          icon: "v-icon-form",
          to: "/packages/channel/order/list?type=output"
        },
        {
          title: "零售訂單",
          icon: "v-icon-form",
          to: "/packages/channel/order/list?type=retail"
        }
      ];
    },
    cardItems() {
      let items = [
        {
          title: "雲倉采購",
          icon: this.static.baseImgPath + "icons/cart-02.png",
          to: "/packages/channel/goods?type=purchase"
        },
        {
          title: "雲倉提貨",
          icon: this.static.baseImgPath + "icons/yun-02.png",
          to: "/packages/channel/goods?type=pickupgoods"
        },
        {
          title: "雲倉管理",
          icon: this.static.baseImgPath + "icons/home-02.png",
          to: "/packages/channel/depot/index"
        },
        {
          title: "財務管理",
          icon: this.static.baseImgPath + "icons/money-02.png",
          to: "/packages/channel/finance"
        },
        {
          title: "我的業績",
          icon: this.static.baseImgPath + "icons/yeji-02.png",
          to: "/packages/channel/achieve"
        },
        {
          title: "我的團隊",
          icon: this.static.baseImgPath + "icons/team-02.png",
          to: "/packages/channel/team"
        }
      ];
      if (this.addons.credential) {
        items.push({
          title: "授權證書",
          icon: this.static.baseImgPath + "icons/certify.png",
          to: "/packages/channel/credential"
        });
      }
      return items;
    }
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_CENTREINFO()
        .then(({ code, data }) => {
          if (code === 0) {
            return this.$Navigate.replace("/pages/member/index");
          }
          if (!data.is_channel) {
            return this.$Navigate.replace("/packages/channel/apply");
          }
          this.info = data;
          this.info.to_channel_time = formatDate(data.to_channel_time);
        })
        .catch(() => {});
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.info {
  padding-bottom: 40rpx;
  height: 160rpx;
}
.text-item {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
</style>
