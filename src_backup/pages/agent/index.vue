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
        <view v-if="info.level_name" @click="toLink('/packages/agent/level')">
          {{ info.level_name }}
        </view>
        <view v-if="info.referee_name">推薦人：{{ info.referee_name }}</view>
        <view v-if="info.become_agent_distributor_time">
          加入時間：{{ info.become_agent_distributor_time }}
        </view>
      </view>
      <view slot="right">
        <lk-button
          size="small"
          round
          plain
          :color="theme.color"
          to="/packages/agent/detail"
        >
          {{ texts.commission }}詳情
        </lk-button>
      </view>
    </lk-header-panel>
    <view class="card-panel card-group-box">
      <view class="item">
        <text class="num">{{ info.commission || 0 }}</text>
        <text class="text">{{ texts.withdrawable_commission }}</text>
      </view>
      <view class="item">
        <text class="num">{{ info.withdrawals || 0 }}</text>
        <text class="text">{{ texts.withdrawals_commission }}</text>
      </view>
      <view class="item">
        <text class="num">{{ info.total_commission || 0 }}</text>
        <text class="text">{{ texts.total_commission }}</text>
      </view>
      <view class="item">
        <lk-button
          size="small"
          round
          :color="theme.gradient"
          @click="onWithdraw"
        >
          提現
        </lk-button>
      </view>
    </view>
    <lk-grid-panel
      card
      cols="5"
      icon-prefix="v-icon"
      icon-size="22"
      :icon-color="theme.color"
      :items="orderCardItems"
    />
    <lk-grid-panel card cols="4" :items="usuallyCardItems" />
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import navbarStyle from "@/mixins/navbar-style";
export default {
  name: "pages-agent-index",
  data() {
    return {
      info: {
        is_purchase: null
      }
    };
  },
  mixins: [navbarStyle],
  computed: {
    ...mapState({
      texts: ({ distribute }) => distribute.texts,
      addons: ({ config }) => config.addons
    }),
    ...mapGetters(["token", "static"]),
    orderCardItems() {
      let channelOrderItem = [
        {
          title: "采購訂單",
          icon: "v-icon-form",
          to: "/packages/agent/order/list?type=purchase"
        },
        {
          title: "提貨訂單",
          icon: "v-icon-form",
          to: "/packages/agent/order/list?type=pickupgoods"
        },
        {
          title: "出貨訂單",
          icon: "v-icon-form",
          to: "/packages/agent/order/list?type=output"
        },
        {
          title: "零售訂單",
          icon: "v-icon-form",
          to: "/packages/agent/order/list?type=retail"
        }
      ];
      let items = [
        {
          title: "分傭訂單",
          icon: "v-icon-form",
          to: "/packages/agent/order/list?type=commission"
        }
      ];
      if (this.info.is_purchase == 1) {
        items.unshift(...channelOrderItem);
      }
      return items;
    },
    usuallyCardItems() {
      let items = [
        {
          title: "雲倉管理",
          icon: this.static.baseImgPath + "icons/home-02.png",
          to: "/packages/agent/depot/index"
        },
        {
          title: "雲倉采購",
          icon: this.static.baseImgPath + "icons/cart-02.png",
          to: "/packages/agent/goods?type=purchase"
        },
        {
          title: "雲倉提貨",
          icon: this.static.baseImgPath + "icons/yun-02.png",
          to: "/packages/agent/goods?type=pickupgoods"
        },
        {
          title: "采購業績",
          icon: this.static.baseImgPath + "icons/yeji-02.png",
          to: "/packages/agent/achieve"
        },
        {
          title: "我的團隊",
          icon: this.static.baseImgPath + "icons/team-02.png",
          to: "/packages/agent/team"
        },
        {
          title: "我的客戶",
          icon: this.static.baseImgPath + "icons/customer.png",
          to: "/packages/agent/customer"
        },
        {
          title: "排行榜",
          icon: this.static.baseImgPath + "icons/tddz.png",
          to: "/packages/agent/ranking"
        },
        {
          title: "推廣碼",
          icon: this.static.baseImgPath + "icons/qr.png",
          to: "/packages/agent/qrcode"
        }
      ];
      if (this.info.is_performance_award == 1) {
        items.push({
          title: "業績獎",
          icon: this.static.baseImgPath + "icons/yeji-02.png",
          to: "/packages/agent/achievereward"
        });
      }
      if (this.addons.credential) {
        items.push({
          title: "授權證書",
          icon: this.static.baseImgPath + "icons/certify.png",
          to: "/packages/agent/credential"
        });
      }
      return items;
    }
  },
  onPullDownRefresh() {
    this.getData();
  },
  onLoad() {},
  onShow() {
    this.getData();
  },
  methods: {
    ...mapActions(["getDistributeInfo"]),
    getData() {
      if (this.token) {
        this.getDistributeInfo({ update: true })
          .then(info => {
            this.info = info;
          })
          .catch(info => {
            if (info.isagent != 2) {
              uni.redirectTo({
                url: "/packages/agent/apply"
              });
            }
          });
      }
    },
    onWithdraw() {
      if (this.info.is_datum == 2) {
        this.$Prompt.toast("請先完善資料！").then(() => {
          this.$Navigate.push({
            path: "/packages/agent/apply",
            query: {
              hash: "replenish"
            }
          });
        });
        return false;
      }
      const commission = this.info.commission || 0;
      if (!commission) {
        return this.$Prompt.toast(
          "提現" + this.texts.commission + "為0，不可提現"
        );
      }
      this.$Navigate.push("/packages/agent/withdraw");
    },
    toLink(link) {
      this.$Navigate.push(link);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.info {
  padding-bottom: 40rpx;
  height: 160rpx;
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
    font-size: $font-size;
  }
  .num {
    color: $red;
  }
}

.ranking-box {
  display: flex;
  flex-flow: column;
  height: 150rpx;
  margin: 20rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
