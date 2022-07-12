<template>
  <view class="panel-group card-group-box">
    <lk-cell
      :to="to"
      clickable
      class="info-box"
      :style="'background-image: url(' + backgroundImage + ');'"
    >
      <view class="info">
        <view class="logo-box">
          <view class="logo">
            <image class="image" :src="logo" mode="aspectFit" />
          </view>
        </view>
        <view class="text-box">
          <view>
            <view class="title">
              {{ title }}
            </view>
            <view class="score">
              <lk-star :value="5" />
              <view class="distance" v-if="distance">{{ distance }}</view>
            </view>
            <view class="Columns">
              <view class="boldText"
                >粉絲數: {{ collection | 0 }}人 已售:
                {{ fictitious_order | 0 }}單</view
              >
              <view class="boldText">商品數: {{ goods_count | 0 }}件</view>
            </view>
          </view>
          <slot name="tag">
            <view class="desc">{{ desc }}</view>
          </slot>
        </view>
      </view>
    </lk-cell>
    <lk-cell v-if="goods.length">
      <view class="goods-list">
        <view class="item" v-for="(item, index) in goods" :key="index">
          <lk-goods-box
            :image="item.image"
            :price="item.price"
            :goods-id="item.goods_id"
          >
            <view slot="info" class="price">{{ item.price | yuan }}</view>
          </lk-goods-box>
        </view>
      </view>
    </lk-cell>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    to: [Object, String],
    logo: [Number, String],
    title: [Number, String],
    distance: [Number, String],
    desc: [Number, String],
    score: [Number, String],
    collection: [Number, String],
    fictitious_collection: [Number, String],
    fictitious_order: [Number, String],
    goods_count: [Number, String],
    goods: {
      type: Array,
      default: () => [],
    },
    backgroundImage: [String],
  },
  components: {},
};
</script>

<style scoped lang="scss">
.panel-group {
  .info-box {
    background-position: 0% 0%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .info {
    display: flex;
    align-items: center;
  }

  .info .logo-box {
    margin-right: 20rpx;
    width: 200rpx;
  }

  .info .logo {
    padding-bottom: 56%;
    width: 100%;
    position: relative;
    // background: #fafafa;
    margin-right: 20rpx;
  }

  .info .logo .image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // background: $image-background;
  }

  .info .text-box {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    flex: 1;
  }

  .info .tag {
    line-height: 1.2;
  }

  .info .score {
    line-height: 32rpx;
    height: 32rpx;
    display: flex;
    justify-content: space-between;
  }

  .info .distance {
    font-size: $font-size-sm;
    color: $text-light;
  }

  .info .desc {
    font-size: $font-size-sm;
    color: $text-gray;
    line-height: 40rpx;
  }

  .info .group-name {
    color: #666;
  }

  .goods-list {
    margin: 0 -8rpx;
    overflow: hidden;
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;

    .item {
      position: relative;
      width: calc(25% - 16rpx);
      margin: 8rpx;
      font-size: $font-size-sm;

      .price {
        color: $red;
      }
    }
  }
}

.boldText {
  // font-weight: bold;
}
</style>
