<template>
  <view :class="flexDirectionClass">
    <slot name="image">
      <view
        class="image-box"
        :class="imageShapeClass"
        :style="imageStyles"
        @click="click"
      >
        <image
          :src="image"
          :style="imageStyles"
          class="image"
          :mode="showWaterfall ? 'widthFix' : 'aspectFill'"
        />
        <slot name="imageTags" />
      </view>
    </slot>
    <slot name="info">
      <view class="info">
        <view class="title-cell" v-if="title" @click="click">
          <text class="title-tag" v-if="tag">{{ tag }}</text>
          {{ title }}
        </view>
        <view class="label-cell" @click="click">
          <slot name="label" />
        </view>
        <view class="foot-cell">
          <slot name="desc">
            <view class="price-cell">
              <slot name="price">
                <view class="cell-item-l" v-if="priceText">
                  <view class="price-text" :class="priceClass">{{
                    priceText
                  }}</view>
                  <slot name="originPrice">
                    <view
                      class="cell-item-l originalPrice"
                      v-if="originPriceText"
                    >
                      <view class="text-line-through light-text first-letter">{{
                        originPriceText
                      }}</view>
                    </view>
                  </slot>
                </view>
              </slot>
              <slot name="priceRight">
                <view class="cell-item-r"> </view>
              </slot>
            </view>
            <view class="price-cell">
              <slot name="sales">
                <view class="cell-item-r">
                  <view class="light-text" v-if="salesText">{{
                    salesText
                  }}</view>
                </view>
              </slot>
              <view class="shopInfoArea" @click="goToShop">
                <image
                  v-if="shopIcon"
                  class="shopCircleHead"
                  style="width: 20px; height: 20px; background-color: #eeeeee"
                  :mode="'aspectFit'"
                  :src="shopIcon"
                ></image>
                <view class="shopName">
                  {{ shopName }}
                </view>
              </view>
            </view>
          </slot>
        </view>
        <slot name="bottom" />
      </view>
    </slot>
  </view>
</template>

<script>
import { yuan, isDef, wan } from "@/common/utils";
import mixinPriceText from "@/mixins/price-text";
import { formatClass, formatStyle } from "@/common/utils/stringify";
function countSize(size) {
  var _size = size || "345,345";
  var a = _size.split(",");
  var w = a[0] || 0;
  var h = a[1] || 0;
  var s = w / 345;
  return h / s;
}
export default {
  data() {
    return {
      cname: "goods-box",
    };
  },
  mixins: [mixinPriceText],
  props: {
    shopName: "",
    shopIcon: "",
    wxId: "",
    to: {
      type: [String, Object],
    },
    goodsId: [String, Number],
    // 是否積分商品
    isPointGoods: Boolean,
    image: String,
    // 圖片形狀，矩形=rectangle，正方形=square
    imageShape: {
      type: String,
      default: "square",
    },
    imageHeight: {
      type: [Number, String],
    },
    // 排版
    flexDirection: {
      type: String,
      default: "column",
    },
    picSize: [String],
    title: [String, Number],
    tag: [String, Number],
    price: [String, Number],
    originPrice: [String, Number],
    point: [String, Number],
    sales: [String, Number],
    imageStyle: {
      type: [Object],
      default: () => {},
    },
    showWaterfall: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    priceClass() {
      return formatClass([
        this.firstLetterClass(this.price, this.point),
        this.isPointGoods ? "is-point" : "",
      ]);
    },
    priceText() {
      return this.formatPriceText(this.price, this.point);
    },
    originPriceText() {
      return parseFloat(this.price) >= parseFloat(this.originPrice)
        ? false
        : this.formatPriceText(this.originPrice);
    },
    salesText() {
      return this.sales ? wan(this.sales) + "人付款" : "";
    },
    imageShapeClass() {
      return `image-box-${this.imageShape} ${
        this.imageHeight ? "custom-heihgt" : ""
      }`;
    },
    flexDirectionClass() {
      if (this.showWaterfall) {
        return "goods-box-Waterfall goods-box-" + this.flexDirection;
      } else {
        return "goods-box goods-box-" + this.flexDirection;
      }
    },
    imageStyles() {
      let style = {
        ...this.imageStyle,
      };
      if (this.imageHeight) {
        style.height = this.imageHeight;
      } else if (this.picSize) {
        style.height = countSize(this.picSize) + "rpx";
      }
      return formatStyle(style);
    },
  },
  methods: {
    goToShop() {
      const to =
        "/packages/smallshop/home?wx_id=" +
        this.wxId +
        "&previous_route=homeAndCategory";
      return this.$Navigate.push(to);
    },
    click() {
      if (this.to) {
        if (this.to == "no") return false;
        return this.$Navigate.push(this.to);
      }
      if (this.goodsId) {
        let to = {
          path: this.isPointGoods
            ? "/packages/integral/goods/detail"
            : "/packages/goods/detail",
          query: {
            goods_id: this.goodsId,
          },
        };
        return this.$Navigate.push(to);
      }
      this.$emit("click");
    },
  },
};
</script>

<style scoped lang="scss">
.goods-box {
  display: flex;
  flex-direction: column;
  background: $white;
  font-size: inherit;
  // box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  .image-box {
    height: 0;
    width: 100%;
    padding: 50% 0;
    overflow: hidden;
    position: relative;
    .image {
      display: flex;
      width: 100%;
      height: 100%;
      border: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
    }
  }
  .image-box-square {
    padding: 50% 0;
    .image {
    }
  }
  .image-box-rectangle {
    padding: 25% 0;
  }
  .image-box.custom-heihgt {
    height: auto;
    padding: 0;
    .image {
      position: relative;
    }
    .image-box-square {
      padding: 0;
    }
    .image-box-rectangle {
      padding: 0;
    }
  }
}
.goods-box-Waterfall {
  display: flex;
  flex-direction: column;
  background: $white;
  font-size: inherit;
  // box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  .image-box {
    // height: 0;
    width: 100%;
    // padding: 50% 0;
    // overflow: hidden;
    // position: relative;
    .image {
      // display: flex;
      width: 100%;
      // border: none;
      // position: absolute;
      // top: 0;
      // bottom: 0;
      // left: 0;
      // right: 0;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
    }
  }
  // .image-box-square {
  //   padding: 50% 0;
  //   .image {
  //   }
  // }
  .image-box-rectangle {
    padding: 25% 0;
  }
  .image-box.custom-heihgt {
    height: auto;
    padding: 0;
    .image {
      position: relative;
    }
    .image-box-square {
      padding: 0;
    }
    .image-box-rectangle {
      padding: 0;
    }
  }
}
.info {
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: $font-size;
    line-height: 32rpx;
  }
  .title-tag {
    color: #ffffff;
    line-height: 1;
    padding: 4rpx 8rpx;
    border-radius: 8rpx;
    font-size: $font-size-sm;
    background-color: $red;
    margin-right: 8rpx;
  }
  .promote-cell {
    position: relative;
  }
  .foot-cell {
    position: relative;
  }
  .price-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6rpx;
    .cell-item-l,
    .cell-item-r {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 60%;
    }
  }
}

.price-text {
  font-size: inherit;
  color: $red;
  font-weight: 700;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.is-point.price-text {
  overflow: initial;
  font-weight: 400;
}
.text-line-through {
  text-decoration: line-through;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.light-text {
  font-size: $font-size-sm;
  color: $text-light;
}
.goods-box-row {
  display: flex;
  flex-direction: row;
  .image-box-square {
    padding: 0;
    flex: none;
    width: 240rpx;
    height: 240rpx;

    .image {
      border-top-left-radius: 20rpx;
      border-top-right-radius: 0;
      border-bottom-left-radius: 20rpx;
    }
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.shopInfoArea {
  display: flex;
  justify-content: center;
  align-items: center;

  .shopCircleHead {
    border-radius: 50%;
  }

  .shopName {
    margin-left: 6px;
    font-size: small;
    color: rgba(0, 0, 0, 0.5);
  }
}

.originalPrice {
  margin-left: 20px;
}
</style>
