<template>
  <action-btn-confirm
    v-if="action"
    :action="action"
    :btn-type="btnType"
    @click="click"
  />
  <view class="sku-action-group" v-else>
    <view class="action-btn" v-if="showCart">
      <lk-button square type="warning" :color="theme.cart" @click="addCart">
        {{ cartBtnText }}
      </lk-button>
    </view>
    <view class="action-btn">
      <lk-button
        square
        type="danger"
        :color="theme.gradient"
        @click="seckill"
        :disabled="btnDisabled"
      >
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import actionBtnConfirm from "./action-btn-confirm";
export default {
  data() {
    return {};
  },
  props: {
    // 活動相關參數
    params: Object,
    // 商品基本信息
    info: Object,
    action: String,
    cartBtnText: {
      type: String,
      default: "加入購物車"
    },
    buyBtnText: {
      type: String,
      default: "馬上搶"
    }
  },
  computed: {
    /**
     *  秒殺狀態
     *  ing => 正在進行
     *  not => 未開始
     *  end => 已結束
     */
    state() {
      let state = "";
      if (this.params.seckill_status == "going") {
        state = "ing";
      } else if (this.params.seckill_status == "unstart") {
        state = "not";
      } else if (this.params.seckill_status == "ended") {
        state = "end";
      }
      return state;
    },
    btnText() {
      let text = "";
      if (this.params.seckill_id) {
        if (this.state == "ing") {
          text = this.buyBtnText;
        } else if (this.state == "not") {
          text = "未開始";
        } else if (this.state == "end") {
          text = "已結束";
        }
      }
      return text;
    },
    btnDisabled() {
      let flag = true;
      if (this.params.seckill_id) {
        if (this.state == "ing") {
          flag = false;
        }
      }
      return flag;
    },
    btnType() {
      return this.action == "addCart" ? "warning" : "danger";
    },
    showCart() {
      return !(
        this.info.goodsType == 0 ||
        this.info.goodsType == 3 ||
        this.info.goodsType == 4
      );
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    addCart() {
      this.$emit("click", "addCart", {
        seckill_id: this.params.seckill_id
      });
    },
    seckill() {
      this.$emit("click", "seckill", {
        seckill_id: this.params.seckill_id
      });
    }
  },
  components: {
    actionBtnConfirm
  }
};
</script>

<style scoped></style>
