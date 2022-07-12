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
      :name="info.member_name"
    >
      <view class="info">
        <view v-if="info.shopkeeper_level_name">
          等級：{{ info.shopkeeper_level_name }}
        </view>
        <view v-if="info.become_shopkeeper_time">
          加入時間：{{ info.become_shopkeeper_time }}
        </view>
      </view>
      <view slot="right">
        <lk-button
          size="small"
          round
          plain
          :color="theme.color"
          to="/packages/microshop/profit/detail"
        >
          我的收益
        </lk-button>
      </view>
    </lk-header-panel>
    <lk-cell
      title="等級中心"
      is-link
      :title-right="info.shopkeeper_time_text"
      to="/packages/microshop/level"
    />
    <view class="card-panel card-group-box">
      <view class="item">
        <text class="num">{{ info.profit || 0 }}</text>
        <text class="text">可提現</text>
      </view>
      <view class="item">
        <text class="num">{{ info.withdrawals || 0 }}</text>
        <text class="text">成功提現</text>
      </view>
      <view class="item">
        <text class="num">{{ info.total_profit || 0 }}</text>
        <text class="text">累計收益</text>
      </view>
      <view class="item">
        <lk-button
          size="small"
          round
          :color="theme.gradient"
          to="/packages/microshop/profit/withdraw"
        >
          提現
        </lk-button>
      </view>
    </view>
    <lk-grid-panel card cols="3" :items="cardItems" />
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import navbarStyle from "@/mixins/navbar-style";
export default {
  name: "pages-microshop-index",
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
    cardItems() {
      let items = [
        {
          title: "微店管理",
          icon: this.static.baseImgPath + "icons/shop.png",
          to: "/packages/microshop/set/index"
        },
        {
          title: "挑選商品",
          icon: this.static.baseImgPath + "icons/goods.png",
          to: "/packages/microshop/goods/category"
        },
        {
          title: "預攬微店",
          icon: this.static.baseImgPath + "icons/preview.png",
          to: "/packages/microshop/home"
        },
        {
          title: "分享微店",
          icon: this.static.baseImgPath + "icons/qr.png",
          to: "/packages/microshop/qrcode"
        }
      ];
      if (this.addons.credential) {
        items.push({
          title: "授權證書",
          icon: this.static.baseImgPath + "icons/certify.png",
          to: "/packages/microshop/credential"
        });
      }
      return items;
    }
  },
  onLoad() {
    this.getMicroshopInfo({ update: true }).then(info => {
      //是否為店主
      if (info.isshopkeeper) {
        this.info = info;
      } else {
        this.$Navigate.replace("/packages/microshop/apply");
      }
    });
  },
  methods: {
    ...mapActions(["getMicroshopInfo"])
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}

.card-panel {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background: #fff;
  .item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 30rpx 0;
    line-height: 40rpx;
  }
  .text {
    font-size: $font-size-sm;
  }
  .num {
    color: $red;
  }
}
</style>
