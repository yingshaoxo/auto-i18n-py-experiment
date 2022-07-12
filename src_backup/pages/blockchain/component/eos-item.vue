<template>
  <view class="card-group-box">
    <lk-cell center title="EOS" :is-link="isHasWallet" @click="onClick">
      <lk-icon
        class="cell-icon"
        slot="icon"
        class-prefix="v-icon"
        name="v-icon-eos"
        size="28"
        square
        color="#ff8f00"
      />
      <view class="transfer-price" v-if="isHasWallet">
        <view class="before-price">{{ info.balance }}</view>
        <view class="after-price">≈ {{ info.money_text }}</view>
      </view>
      <view
        :class="createFlag == 3 || createFlag == 4 ? 'text-red' : ''"
        v-else
        >{{ createText }}</view
      >
    </lk-cell>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import { yuan } from "@/common/utils";
export default {
  data() {
    return {
      success: false,
      info: {},
      isHasWallet: false,
      createFlag: 0,
      createText: "錢包信息加載中..."
    };
  },
  mounted() {
    this.getEosInfo()
      .then(({ code, data, message }) => {
        this.success = true;
        this.createFlag = code;
        if (code == 1) {
          this.info = data;
          this.isHasWallet = true;
        }
        this.createText = code == 2 ? "創建錢包" : message;
      })
      .catch(() => {
        this.createText = "錢包信息加載失敗";
      });
  },
  methods: {
    ...mapActions(["getEosInfo"]),
    onClick() {
      if (!this.success) {
        return false;
      }
      if (this.createFlag == 2 || this.createFlag == 4) {
        return this.$Navigate.push("/pay/wallet");
      }
      if (this.isHasWallet) {
        return this.$Navigate.push({
          path: "/packages/blockchain/index",
          query: {
            type: "eos"
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-icon {
  margin-right: 20rpx;
}

.transfer-price {
  display: flex;
  flex-direction: column;
  line-height: 1.6;
}

.before-price {
  color: $text-gray;
}

.after-price {
  color: $text-light;
  font-size: $font-size-sm;
}
</style>
