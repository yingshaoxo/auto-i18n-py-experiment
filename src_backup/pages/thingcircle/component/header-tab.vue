<template>
  <view class="header">
    <view class="icon-tabs-group">
      <view class="icon-box"> </view>
      <view class="tabs-box">
        <view class="tabs">
          <lk-tabs
            v-model="active"
            :active-color="theme.color"
            :line-color="theme.color"
            slot-title
            nav-per-view="3"
            @change="onChange"
          >
            <lk-tab v-for="(tab, index) in tabs" :key="index">
              <text>{{ tab.name }}</text>
            </lk-tab>
          </lk-tabs>
        </view>
      </view>
      <view class="icon-box">
        <lk-icon
          name="chat-o"
          size="20"
          @click="toLink('/pages/message/index')"
        />
      </view>
    </view>
    <lk-search
      v-model="search_text"
      placeholder="大家都在搜"
      @confirm="onSearch"
    />
  </view>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      active: 1,
      tabs: [
        {
          name: "關注"
        },
        {
          name: "發現"
        },
        {
          name: "附近"
        }
      ],
      search_text: ""
    };
  },
  methods: {
    ...mapActions(["getLocation"]),
    onChange(index) {
      if (index === 2) {
        this.getLocation().then(res => {
          this.$emit("change", {
            follow: index === 0 ? 1 : 0,
            lat: res.lat,
            lng: res.lng
          });
        });
      } else {
        this.$emit("change", { follow: index === 0 ? 1 : 0, lat: "", lng: "" });
      }
    },
    onSearch(e) {
      this.$emit("change", { search_text: e });
    },
    toLink(to) {
      this.$Navigate.push(to);
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 196rpx;
  z-index: 99;
}
.icon-tabs-group {
  display: flex;
  flex-flow: row;
  background: #ffffff;
  .tabs-box {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .tabs {
  }
  .icon-box {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
