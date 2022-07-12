<template>
  <view class="cell-image-panel">
    <view class="item" v-for="(item,index) in list" :key="index">
      <lk-icon v-if="showDelete" name="close" class-name="btn-del" @click="del(index)" />
      <view class="box">
        <image :src="item.pic_cover || item" class="image" mode="widthFix" @click="preview(index)" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "cell-image-panel",
  data() {
    return {};
  },
  props: {
    list: Array,
    // 是否顯示刪除
    showDelete: {
      type: Boolean,
      default: false
    },
    // 是否預攬圖片
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    del(i) {
      this.$Prompt
        .showModal(`確定刪除該圖片？`)
        .then(() => {
          this.list.splice(i, 1);
          this.$emit("delete", this.list, index);
        })
        .catch(() => {});
    },
    preview(i) {
      if (this.isPreview) {
        console.log("預攬");
      }
    }
  }
};
</script>

<style scoped lang="scss" >
.cell-image-panel {
  margin: 0 -8rpx;
  overflow: hidden;
  display: flex;
  flex-flow: wrap;
  .item {
    position: relative;
    width: calc(20% - 16rpx);
    margin: 8rpx;
  }
  .btn-del {
    position: absolute;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 100%;
    right: -16rpx;
    color: #ffffff;
    top: -16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-xs;
    width: 40rpx;
    height: 40rpx;
    padding: 8rpx;
    transform: scale(0.5);
  }
  .box {
    height: 0;
    width: 100%;
    padding: 50% 0;
    overflow: hidden;
    background: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
    .image {
      display: flex;
      max-width: 100%;
      height: auto;
    }
  }
}
</style>