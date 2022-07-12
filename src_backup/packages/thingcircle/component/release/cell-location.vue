<template>
  <lk-cell is-link @click="toLink">
    <view class="icon" slot="icon">
      <lk-icon class-prefix="v-icon" name="v-icon-location03" size="20" :color="stateStyle.color" />
    </view>
    <view class="title" slot="title" :style="{ color: stateStyle.color }">
      <view class="text">{{ stateStyle.title }}</view>
      <view class="title-right" v-if="!info.title">讓附近更多的人髮現你</view>
    </view>
  </lk-cell>
</template>

<script>
export default {
  data() {
    return {
      info: {
        title: ""
      }
    };
  },
  props: {},
  computed: {
    stateStyle() {
      let obj = {
        color: this.info.title ? "#f44" : "#909399",
        title: this.info.title || "添加定位"
      };
      return obj;
    }
  },
  mounted() {
    uni.$on("get-release-location", data => {
      this.info = data;
      this.$emit("get-info", data);
    });
  },
  destroyed() {
    uni.$off("get-release-location");
  },
  methods: {
    toLink() {
      this.$Navigate.push({
        path: "/packages/thingcircle/release/location"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  margin-right: 12rpx;
  display: flex;
  align-items: center;
}
.title {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  color: $text-light;
  .title-right {
    font-size: $font-size-sm;
  }
}
.list {
  width: 100%;
  height: 65vh;
  overflow-y: auto;
  padding-bottom: 160rpx;
}
</style>
