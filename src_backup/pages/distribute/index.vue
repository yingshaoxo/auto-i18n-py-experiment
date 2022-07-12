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
    <!-- #ifndef H5 -->
    <lk-navbar
      immersive
      :title-color="nbStyle.color"
      :back-icon-color="nbStyle.color"
      :title="pageStyle.title"
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
        <view
          v-if="info.level_name"
          @click="toLink('/packages/distribute/level')"
        >
          {{ info.level_name }}
        </view>
        <view v-if="info.referee_name">推薦人：{{ info.referee_name }}</view>
        <view v-if="info.become_distributor_time">
          加入時間：{{ info.become_distributor_time }}
        </view>
      </view>
      <view slot="right">
        <lk-button
          size="small"
          round
          plain
          :color="theme.color"
          to="/packages/distribute/detail"
        >
          {{ texts.commission }}詳情
        </lk-button>
        <view class="qr-box">
          <lk-icon
            name="qr"
            square
            size="30"
            color="#ffffff"
            @click="clickShowPoster"
          />
        </view>
      </view>
    </lk-header-panel>
    <view class="card-panel card-group-box" style="margin-bottom:0;">
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
    <view class="reform-view">
      <distribute-reform-group :show="show" :items="items" />
    </view>
    <view
      class="popup-poster"
      @touchmove.stop.prevent="e => e.preventDefault()"
      v-show="showPoster"
    >
      <share-poster ref="share-poster" show-close @close="showPoster = false">
      </share-poster>
    </view>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import distributeReformGroup from "@/components/custom/distribute-reform-group";
import reformLoad from "@/mixins/reform-load";
import sharePoster from "./component/share-poster";
import navbarStyle from "@/mixins/navbar-style";
export default {
  name: "pages-distribute-index",
  data() {
    return {
      show: false,
      pageStyle: {
        background: "",
        title: ""
      },
      showPoster: false
    };
  },
  mixins: [reformLoad, navbarStyle],
  computed: {
    ...mapState({
      info: ({ distribute }) => distribute.info,
      texts: ({ distribute }) => distribute.texts,
      addons: ({ config }) => config.addons
    }),
    ...mapGetters(["token", "static"]),
    cardItems() {
      let items = [
        {
          title: "訂單",
          icon: this.static.baseImgPath + "icons/order.png",
          to: "/packages/distribute/order",
          text:
            this.info.agentordercount != undefined
              ? this.info.agentordercount + "單"
              : ""
        },
        {
          title: "我的團隊",
          icon: this.static.baseImgPath + "icons/team-02.png",
          to: "/packages/distribute/team",
          text:
            this.info.agentcount != undefined ? this.info.agentcount + "人" : ""
        },
        {
          title: "我的客戶",
          icon: this.static.baseImgPath + "icons/customer.png",
          to: "/packages/distribute/customer",
          text:
            this.info.customcount != undefined
              ? this.info.customcount + "人"
              : ""
        },
        {
          title: "推廣碼",
          icon: this.static.baseImgPath + "icons/qr.png",
          to: "/packages/distribute/qrcode"
        }
      ];
      if (this.addons.credential) {
        items.push({
          title: "授權證書",
          icon: this.static.baseImgPath + "icons/certify.png",
          to: "/packages/distribute/credential"
        });
      }
      return items;
    }
  },
  onPullDownRefresh() {
    if (this.token) {
      this.getDistributeInfo({ update: true }).then(() => {
        this.getItems("refresh");
      });
    } else {
      this.getItems("refresh");
    }
  },
  onLoad() {},
  onShow() {
    if (this.token) {
      this.getDistributeInfo({ update: true })
        .then(() => {
          this.getItems();
        })
        .catch(info => {
          if (info.isdistributor != 2) {
            uni.redirectTo({
              url: "/packages/distribute/apply"
            });
          }
        });
    } else {
      this.getItems();
    }
  },
  methods: {
    ...mapActions(["getCustom", "getDistributeInfo"]),
    getItems(refresh) {
      if (refresh) {
        this.show = false;
      }
      this.getCustom({ type: 5 }).then(({ items, page }) => {
        refresh && this.resetItems();
        this.show = true;
        const newItems = this.initCustomData(items);
        this.initLoadItems(newItems);
        this.pageStyle.title = page.title;
        this.pageStyle.background = page.background;
        this.setWxShare({
          title: page.title
        });
      });
    },
    initCustomData(templateItems = {}) {
      let newItems = {};
      const arr = ["commission_fixed"];
      for (let key in templateItems) {
        const item = templateItems[key];
        if (arr.indexOf(item.id) != -1) {
          this.headerItems = item;
        } else {
          newItems[key] = item;
        }
        if (item.id == "menu") {
          for (let j in item.data) {
            const o = {
              "/commission/order": {
                label:
                  this.info.agentordercount != undefined
                    ? this.info.agentordercount + "單"
                    : ""
              },
              "/commission/team": {
                label:
                  this.info.agentcount != undefined
                    ? this.info.agentcount + "人"
                    : ""
              },
              "/commission/customer": {
                label:
                  this.info.customcount != undefined
                    ? this.info.customcount + "人"
                    : ""
              },
              "/packages/distribute/order": {
                label:
                  this.info.agentordercount != undefined
                    ? this.info.agentordercount + "單"
                    : ""
              },
              "/packages/distribute/team": {
                label:
                  this.info.agentcount != undefined
                    ? this.info.agentcount + "人"
                    : ""
              },
              "/packages/distribute/customer": {
                label:
                  this.info.customcount != undefined
                    ? this.info.customcount + "人"
                    : ""
              }
            };
            const link = item.data[j].linkurl;
            if (o[link] != undefined) {
              item.data[j].label = o[link].label;
            }
          }
        }
      }
      return newItems;
    },
    onWithdraw() {
      if (this.info.is_datum == 2) {
        this.$Prompt.toast("請先完善資料！").then(() => {
          this.$Navigate.push({
            path: "/packages/distribute/apply",
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
      this.$Navigate.push("/packages/distribute/withdraw");
    },
    toLink(link) {
      this.$Navigate.push(link);
    },
    clickShowPoster() {
      this.showPoster = true;
      this.$refs["share-poster"].init();
    }
  },
  components: {
    distributeReformGroup,
    sharePoster
  }
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

.qr-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

.popup-poster {
  position: absolute;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
</style>
