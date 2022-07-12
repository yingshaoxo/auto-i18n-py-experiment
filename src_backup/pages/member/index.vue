<template>
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
      :avatar="info.member_img"
      :name="info.name"
      :name-tag="info.level_name"
      name-tag-link="/packages/member/level"
      margin-bottom="-80"
    >
      <view class="info">
        <view class="uid-referee">
          <view v-if="info.uid" class="uid"> 會員ID: {{ info.uid }} </view>
          <view v-if="info.referee_name" class="referee">
            推薦人: <view class="referee-name">{{ info.referee_name }}</view>
          </view>
        </view>
        <!-- <view class="code" v-if="info.extend_code">
          推薦碼：
          <text class="text">{{ info.extend_code }}</text>
          <lk-icon
            @click="onCopy(info.extend_code)"
            name="v-icon-copy"
            size="10"
            color="inherit"
            class-prefix="v-icon"
          />
        </view> -->
      </view>
      <view class="btn-right" slot="right">
        <view
          class="item btn-message"
          @tap="toLink('/packages/message/wxnotice')"
        >
          <!-- <text class="unread-num">{{ info.unread_num | '' }}</text> -->
          <view class="badge" v-if="info.unread_num && info.unread_num > 0">{{
            info.unread_num
          }}</view>
          <lk-icon name="chat-o" square size="20" color="#ffffff" />
          <text class="text">消息</text>
        </view>
        <view class="item btn-set" @tap="toLink('/packages/member/set')">
          <lk-icon name="setting-o" square size="20" color="#ffffff" />
          <text class="text">設置</text>
        </view>
        <view
          class="item btn-card"
          @tap="toLink('/packages/membercard/index')"
          v-if="addons.membercard"
        >
          <lk-icon name="qr" square size="20" color="#ffffff" />
          <text class="text">{{ memberTexts.membercard }}</text>
        </view>
      </view>
    </lk-header-panel>
    <view class="reform-view">
      <member-bind :items="memberItems.member_bind_fixed" />
      <member-order :items="memberItems.member_order_fixed" />
      <member-assets :items="memberItems.member_assets_fixed" />
      <member-reform-group :show="show" :items="items" />
    </view>
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import $System from "@/api/system";
import memberBind from "@/components/custom/reform/member_bind_fixed";
import memberAssets from "@/components/custom/reform/member_assets_fixed";
import memberOrder from "@/components/custom/reform/member_order_fixed";
import memberReformGroup from "@/components/custom/member-reform-group";
import reformLoad from "@/mixins/reform-load";
import navbarStyle from "@/mixins/navbar-style";
import { memberCustomData } from "./data";
export default {
  name: "pages-member-index",
  data() {
    return {
      show: false,
      pageStyle: {
        background: "",
        title: "",
      },
      memberItems: {
        ...memberCustomData.items,
      },
    };
  },
  mixins: [reformLoad, navbarStyle],
  computed: {
    ...mapState({
      info: ({ member }) => member.info,
      addons: ({ config }) => config.addons,
      memberTexts: ({ member }) => member.texts,
    }),
    ...mapGetters(["token"]),
  },
  onPullDownRefresh() {
    if (this.token) {
      this.getMemberInfo({ update: true }).then(() => {
        this.getItems("refresh");
      });
    } else {
      this.getItems("refresh");
    }
  },
  onLoad() {
    this.getItems();
  },
  onShow() {
    if (this.token) {
      this.getMemberInfo({ update: true });
    }
  },
  methods: {
    ...mapActions(["getCustom", "getMemberInfo"]),
    getItems(refresh) {
      if (refresh) {
        this.show = false;
      }
      this.getCustom({ type: 4 })
        .then(({ items, page }) => {
          this.show = true;
          refresh && this.resetItems();
          const newItems = this.initCustomData(items);
          this.initLoadItems(newItems, 4);
          this.pageStyle.background = page.background;
          this.pageStyle.title = page.title;
          this.setWxShare({
            title: page.title,
          });
        })
        .catch((err) => {});
    },
    initCustomData(templateItems = {}) {
      const { items } = memberCustomData; // 默認裝修數據
      let newItems = {};
      const arr = [
        "member_fixed",
        "member_bind_fixed",
        "member_assets_fixed",
        "member_order_fixed",
      ];
      for (let key in templateItems) {
        const item = templateItems[key];
        if (arr.indexOf(item.id) != -1) {
          this.memberItems[item.id] = item;
        } else {
          newItems[key] = item;
        }
      }
      return newItems;
    },
    toLink(link) {
      this.$Navigate.push(link);
    },
    onCopy(data) {
      $System.setClipboardData(data);
    },
  },
  components: {
    memberBind,
    memberAssets,
    memberOrder,
    memberReformGroup,
  },
};
</script>

<style lang="scss" scoped>
.info {
  padding-bottom: 40rpx;
  height: 120rpx;
  font-size: $font-size-sm;
  line-height: 40rpx;
}

.info .code {
  display: inline-flex;
  flex-flow: row;
  align-items: center;
  border-radius: 999rpx;
  font-size: $font-size-xs;
  padding: 0.1em 0.2em;
  line-height: normal;
  vertical-align: middle;
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
}

.info .code .text {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180rpx;
  vertical-align: middle;
}

.info .uid-referee {
  display: flex;
  align-items: center;
  font-size: $font-size-sm;
  white-space: nowrap;

  .referee {
    margin-left: 20rpx;
    display: flex;
  }

  .referee-name {
    max-width: 140rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.btn-right {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: -4rpx;
  // width: 160rpx;
  justify-content: flex-end;
  flex: none;

  > *:first-child {
    margin-right: 10px;
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .text {
    line-height: 1;
    font-size: $font-size-xs;
  }
}

.btn-message {
  position: relative;

  .unread-num {
    position: absolute;
    top: -10rpx;
    right: 3rpx;
    color: red;
  }
}

.badge {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  z-index: 1;
  height: 28rpx;
  min-width: 28rpx;
  max-width: 40rpx;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 28rpx;
  background: red;
  color: #fff;
  font-size: 20px;
}
</style>
