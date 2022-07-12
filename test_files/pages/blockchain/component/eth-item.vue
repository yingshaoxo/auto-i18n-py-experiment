<template>
  <view class="card-group-box">
    <lk-cell center title="ETH" :is-link="isHasWallet" @click="onCreate">
      <lk-icon
        class="cell-icon"
        slot="icon"
        class-prefix="v-icon"
        name="v-icon-eth"
        size="28"
        square
        color="#f52929"
      />
      <view class="transfer-price" v-if="isHasWallet">
        <view class="before-price">{{ info.balance }}</view>
        <view class="after-price">≈ {{ info.money_text }}</view>
      </view>
      <view v-else>{{ createText }}</view>
    </lk-cell>
    <lk-modal-pay-password
      v-if="showModalPay"
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      title="請輸入支付密碼，創建ETH錢包"
      @confirm="onPayPassword"
    />
  </view>
</template>

<script>
import { CREAT_BLOCKCHAINETHACCOUNT } from "@/common/interface/blockchain";
import { mapActions } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import { yuan } from "@/common/utils";
export default {
  data() {
    return {
      success: false,
      isHasWallet: false,
      showModalPay: false,
      info: {
        balance: 0,
        money: 0
      },
      createFlag: 0,
      createText: "錢包信息加载中...",
      password: ""
    };
  },
  mixins: [mixinPayPassword],
  mounted() {
    this.getEthInfo()
      .then(({ code, data }) => {
        this.success = true;
        this.createFlag = code;
        if (code == 1) {
          this.info = data || {};
          this.isHasWallet = true;
        }
        if (code == 2) {
          this.showModalPay = true;
          this.createText = "創建錢包";
        }
      })
      .catch(() => {
        this.createText = "錢包信息加载失败";
      });
  },
  methods: {
    ...mapActions(["getEthInfo", "getblockchainSet"]),
    // 支付密碼設置完成重新獲取相關設置
    initBlockchainSetData() {
      this.getblockchainSet();
    },
    onPayPassword(e) {
      this.password = e;
      this.onCreate();
    },
    onCreate() {
      if (!this.success) {
        return false;
      }
      if (this.isHasWallet) {
        return this.$Navigate.push({
          path: "/packages/blockchain/index",
          query: {
            type: "eth"
          }
        });
      }
      this.validPayPassword(this.password, true)
        .then(() => {
          CREAT_BLOCKCHAINETHACCOUNT({ password: this.password })
            .then(({ message }) => {
              this.$Prompt
                .toast({ title: message, icon: "success" })
                .then(() => {
                  this.$router.push({
                    path: "/packages/blockchain/index",
                    query: {
                      type: "eth"
                    }
                  });
                });
            })
            .catch(() => {
              this.password = "";
            });
        })
        .catch(() => {
          this.password = "";
        });
    }
  },
  components: {}
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
