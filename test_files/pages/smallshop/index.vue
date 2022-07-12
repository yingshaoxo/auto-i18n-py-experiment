<template>
  <page-meta>
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
      route-title
      :background="{ background: nbStyle.background }"
    />
    <!-- #endif -->
    <lk-header-panel
      top-bar
      :avatar="info.logo"
      :name="info.user_name"
      margin-bottom="-80"
    >
      <view class="info">
        <view class="text-item">
          <text style="padding-right: 30rpx;">會員ID:{{ info.uid }}</text>
        </view>

        <view class="text-item"> 加入時間 {{ info.become_time }} </view>
      </view>
    </lk-header-panel>
    <view class="card-group-box">
      <lk-cell
        icon="balance-o"
        titleRight="更多"
        title="我的資產"
        :to="'/packages/smallshop/asset?wx_id=' + wx_id"
      ></lk-cell>
      <view class="card-panel">
        <view class="item">
          <text class="num">{{ info.bouns || 0 }}</text>
          <text class="text">累計傭金</text>
        </view>
        <view class="item">
          <text class="num">{{ info.withdraw || 0 }}</text>
          <text class="text">已提領傭金</text>
        </view>
        <view class="item">
          <text class="num">{{ info.balance || 0 }}</text>
          <text class="text">總資產</text>
        </view>
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
import { mapActions } from "vuex";
import navbarStyle from "@/mixins/navbar-style";
import { WXSHOPCENTER } from "@/common/interface/smallshop";
export default {
  name: "pages-smallshop-index",
  data() {
    return {
      pageStyle: {
        background: "",
        title: "",
      },
      info: {},
      wx_id: "",
    };
  },
  computed: {
    cardItems() {
      if (this.wx_id) {
        return [
          {
            title: "商品庫",
            icon: "apps-o",
            to: "/packages/smallshop/goodslist",
          },
          {
            title: "訂單管理",
            icon: "bars",
            to: "/packages/smallshop/orderlist?wx_id=" + this.wx_id,
          },
          {
            title: "資產管理",
            icon: "balance-o",
            to: "/packages/smallshop/asset?wx_id=" + this.wx_id,
          },
          // {
          //   title: "流水記錄",
          //   icon: "records",
          //   to: "/packages/smallshop/data",
          // },
          {
            title: "數據統計",
            icon: "bar-chart-o",
            to: "/packages/smallshop/statistics",
          },
          {
            title: "我的店鋪",
            icon: "shop-o",
            to:
              "/packages/smallshop/home?wx_id=" +
              this.wx_id +
              "&previous_route=myShop",
          },
          // {
          //   title: "收藏店鋪",
          //   icon: "like-o",
          //   to: "/packages/smallshop/shopcollection",
          // },
        ];
      } else {
        return [
          {
            title: "商品庫",
            icon: "apps-o",
            to: "/packages/smallshop/goodslist",
          },
          {
            title: "數據統計",
            icon: "bar-chart-o",
            to: "/packages/smallshop/data",
          },
        ];
      }
    },
  },
  mixins: [navbarStyle],

  onLoad() {
    this.getMemberInfo({ update: true }).then((info) => {
      this.wx_id = info.wx_id;
      if (info.frozen == 1) {
        this.$Prompt.toast("已凍結").then(() => {
          setTimeout(() => {
            this.$Navigate.replace("/pages/member/index");
          }, 500);
        });
        return false;
      }
      //   is_wx_status=-1非微商，0審核中，1審核通過並且wx_id有值是微商id，2拒絕審核
      if (info.is_wx_status === -1) {
        this.$Prompt.toast("請先成為微商").then(() => {
          this.$Navigate.replace("/packages/smallshop/apply");
        });
      } else if (info.is_wx_status === 0) {
        this.$Prompt
          .modal("審核中")
          .then(() => {
            this.$Navigate.replace("/pages/member/index");
          })
          .catch(() => {
            this.$Navigate.replace("/pages/member/index");
          });
      } else if (info.is_wx_status === 1) {
        this.getData(info.wx_id);
      } else if (info.is_wx_status === 2) {
        this.$Prompt
          .modal("拒絕審核,是否重新申請")
          .then(() => {
            this.$Navigate.replace("/packages/smallshop/apply");
          })
          .catch(() => {
            this.$Navigate.replace("/pages/member/index");
          });
      }
    });
  },
  methods: {
    ...mapActions(["getMemberInfo"]),
    getData(wx_id) {
      WXSHOPCENTER({ id: wx_id })
        .then((res) => {
          this.info = res.data;
        })
        .catch(() => {
          this.$Prompt.toast("請先成為微商").then(() => {
            this.$Navigate.replace("/packages/smallshop/apply");
          });
        });
    },
    toLink(link) {
      this.$Navigate.push(link);
    },
  },
  components: {},
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
</style>
