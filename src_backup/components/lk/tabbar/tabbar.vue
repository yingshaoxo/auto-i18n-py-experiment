<template>
  <view class="tabbar" v-show="showTabbar">
    <view class="wrap">
      <view class="tabbar-border"></view>
      <view
        class="item"
        v-for="(item, index) in list"
        :key="item.pagePath"
        @click="switchTab(item, index)"
      >
        <view class="bd">
          <view class="badge" v-if="item.badge && item.badge > 0">{{
            item.badge
          }}</view>
          <view class="icon" v-if="item.iconPath">
            <image
              :src="
                routeInfo.path == item.path
                  ? item.selectedIconPath
                  : item.iconPath
              "
              mode="aspectFit"
            />
          </view>
          <view class="label">
            {{ item.text }}
          </view>
        </view>
      </view>
    </view>
    <view class="placeholder" />
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { isTabbarRoute } from "@/common/utils/navigate";
export default {
  data() {
    return {};
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      tabbar: ({ config }) => config.tabbar,
      cartNum: ({ config }) => config.cartNum
    }),
    ...mapGetters({
      routeInfo: "route"
    }),
    showTabbar() {
      return this.show || !!this.routeInfo.meta.isTabBar;
    },
    list() {
      this.tabbar.list.forEach(e => {
        if (e.pagePath == "pages/mall/cart") {
          e.badge = this.cartNum;
        }
      });
      return this.tabbar.list;
    }
  },
  methods: {
    switchTab(item, index) {
      if (this.routeInfo.path == item.path) {
        return false;
      }
      this.$Navigate.replaceAll(item.path);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabbar {
  position: relative;
}
.wrap {
  display: block;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 998;
}
.tabbar * {
  box-sizing: border-box;
}
.wrap {
  background-color: #ffffff;
  display: flex;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.tabbar-border {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 2rpx;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: $border-color;
}
.placeholder {
  width: 100%;
  height: 100rpx;
  box-sizing: content-box;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.item {
  flex-direction: column;
  flex: 1;
  font-size: 0;
  text-align: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
}
.item .bd {
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;

  position: relative;
  height: 100rpx;
  flex-direction: column;
  cursor: pointer;
}
.item .icon {
  position: relative;
  display: inline-block;
  margin-top: 10rpx;
  width: 48rpx;
  height: 48rpx;
}
.item .icon image {
  width: 100%;
  height: 100%;
}
.item .label {
  position: relative;
  text-align: center;
  font-size: 20rpx;
  line-height: 1.8;
  color: $text-color;
  max-width: 140rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.item .badge {
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
  font-size: $font-size-xs;
}
</style>
