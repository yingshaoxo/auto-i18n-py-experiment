<template>
  <lk-popup v-model="show" position="bottom" title="已選商品" round closeable>
    <view class="list">
      <lk-goods-card
        v-for="(item, index) in list"
        :key="index"
        cell-padding
        :image="item.goods_picture"
        :title="item.goods_name"
        :desc="item.sku_name"
      >
        <view slot="titleRight" class="price-color first-letter">
          {{ item.priceText }}
        </view>
        <view slot="bottom" class="info-foot">
          <lk-stepper
            v-model="item.num"
            integer
            async-change
            @blur="onNumChange(item)"
            @minus="onNumChange(item)"
            @plus="onNumChange(item)"
            :max="item.quota"
          />
          <view class="del" @click="onRemove(item.sku_id)">
            <lk-icon name="delete" square />
          </view>
        </view>
      </lk-goods-card>
    </view>
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :disabled="disabled"
        @click="submit"
      >
        {{ submitText }}
      </lk-button>
    </view>
  </lk-popup>
</template>

<script>
import {
  REMOVE_CARTGOODS,
  EDIT_CARTGOODSNUM
} from "@/common/interface/channel";
export default {
  data() {
    return {};
  },
  props: {
    value: Boolean,
    buy_type: String,
    disabled: {
      type: Boolean,
      default: false
    },
    submitText: String,
    list: Array
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {
    onNumChange(data) {
      let params = {};
      params.sku_id = data.sku_id;
      params.num = data.num || 1;
      params.channel_info = data.channel_info;
      params.buy_type = this.buy_type;
      EDIT_CARTGOODSNUM(params)
        .then(res => {
          this.$emit("init");
        })
        .catch(() => {});
    },
    onRemove(sku_id) {
      this.$Prompt
        .modal({
          title: "提示",
          content: "確定移除該商品？"
        })
        .then(() => {
          REMOVE_CARTGOODS({
            sku_id,
            buy_type: this.buy_type
          })
            .then(({ message }) => {
              this.$emit("init");
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    submit() {
      this.$emit("submit");
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: calc(70vh - 148rpx);
  overflow-y: auto;
  .cell {
    padding: $cell-padding;
  }
}
.price-text {
  color: $red;
  font-size: $font-size-sm;
  font-weight: 700;
  line-height: 1.2;
}
.shop-title-rigth {
  padding: 8rpx;
  color: $red;
}

.info-foot {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .del {
    display: flex;
    align-items: center;
  }
  .text {
    color: $text-gray;
  }
}
</style>
