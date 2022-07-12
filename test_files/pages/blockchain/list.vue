<template>
  <view class="pages">
    <view class="cell-group">
      <view class="card-group-box" v-for="(item, index) in list" :key="index">
        <lk-cell
          center
          icon-size="28"
          :icon="item.logo"
          :title="item.symbol"
          :is-link="!!item.isHasWallet"
          @click="click(item)"
        >
          <view class="transfer-price" v-if="item.isHasWallet">
            <view class="before-price">{{ item.balance }}</view>
            <view class="after-price">≈ {{ item.money_text }}</view>
          </view>
          <view v-else>{{ item.createText }}</view>
        </lk-cell>
      </view>
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      :title="modalTitle"
      @confirm="onPayPassword"
    />
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapActions } from "vuex";
import { yuan } from "@/common/utils";
import {
  GET_BLOCKCHAINBILIST,
  CREAT_BLOCKCHAINETHACCOUNT
} from "@/common/interface/blockchain";
import mixinPayPassword from "@/mixins/valid-pay-password";
export default {
  name: "pages-blockchain-list",
  data() {
    return {
      showEth: false,
      showEos: false,
      list: [],
      createEthSymbolText: ""
    };
  },
  computed: {
    modalTitle() {
      return `請輸入支付密碼，創建${String(
        this.createEthSymbolText
      ).toLocaleUpperCase()}錢包`;
    }
  },
  onLoad(query) {},
  onShow() {
    GET_BLOCKCHAINBILIST({}, { loadingText: "加載中" })
      .then(({ data }) => {
        if (data.length == 0) {
          this.$Prompt
            .modal({
              content: "暫無貨幣",
              showCancel: false
            })
            .then(res => {
              this.$Navigate.back();
            });
        }
        let arr = data || [];
        arr.forEach(e => {
          e.isHasWallet = e.state_code == 1;
          e.money_text = yuan(e.money);
          e.createText = e.isHasWallet ? "" : "創建錢包";
          e.symbol_type = String(e.symbol).toLocaleLowerCase();
          if (e.symbol_type == "eos" && e.state_code != 1) {
            e.createText = e.state_message;
          }
        });
        this.list = arr;
      })
      .catch(() => {});
  },
  mixins: [mixinPayPassword],
  methods: {
    ...mapActions(["getBlockchainSet"]),
    click(item) {
      const type = item.symbol_type;
      const state = item.state_code;
      if (type == "eos" && state != 1) {
        // eos 錢包需要审核,3為審核中，其他情况进入創建錢包
        if (state == 3) {
          this.$Prompt.toast(item.state_message);
        } else {
          this.$Navigate.push("/pay/wallet");
        }
        return;
      }
      if (state != 1) {
        this.createEthSymbolText = type;
        return this.createEth();
      }
      this.$Navigate.push({
        path: "/packages/blockchain/index",
        query: {
          type: type
        }
      });
    },
    onPayPassword(e) {
      this.password = e;
      this.createEth();
    },
    createEth() {
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
                      type: this.createEthSymbolText
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
