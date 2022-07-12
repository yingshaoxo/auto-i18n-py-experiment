<template>
  <view class="pages">
    <view>
      <lk-cell field :title="'可提現' + texts.balance_style">
        <view class="price-color first-letter">{{ can_use_money | yuan }}</view>
      </lk-cell>
      <lk-cell-withdraw-account-popup :account-id="params.bank_account_id" @select="onSelectAccount"
        :withdraw-type="withdrawType" />
      <lk-field :label="'提現' + texts.balance_style" type="digit" :placeholder="'请输入提現' + texts.balance_style"
        v-model="params.cash" />
    </view>
    <lk-modal-pay-password ref="modalPayPassword" v-model="isShowModalPayPassword" type="2" :money="payMoney"
      @confirm="onPayPassword" @cancel="isLoading = false" />

    <view class="foot-btn-group">
      <!-- <wx-open-subscribe
        v-if="templateIds.length > 0 && isWeixinshow"
        :template="templateIds"
        id="subscribe-btn"
        @success="success"
        style="width:100%;height:100%;position:absolute;opacity: 1;"
      >
        <script type="text/wxtag-template">
          <style>.open-subscribe1 { width: 100%; height: 50px;}</style>
           <button class='open-subscribe1' :style="{backgroundColor:theme.gradient;color:theme.color}" >提現</button>
        </script>
      </wx-open-subscribe> -->

      <lk-wx-open-subscribe node_id="17" @success="success">
        <view slot="btn-subscribe">
          <lk-button block round type="danger" theme-color :disabled="isWithdraw" :loading="isLoading"
            @click="onWithdraw">
            {{ withdrawBtnText }}
          </lk-button>
        </view>
      </lk-wx-open-subscribe>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import {
  GET_ASSETWITHDRAWINFO,
  APPLY_ASSETWITHDRAW
} from "@/common/interface/property";
import { isWeixin } from "@/common/utils";
export default {
  name: "packages-property-withdraw",
  data () {
    return {
      templateIds: [], //公眾號訂閱通知
      can_use_money: 0,
      withdraw_cash_min: 0,
      is_start: 0,
      wx_openid: "",
      is_alipay: false,
      is_wpy: false,

      params: {
        bank_account_id: "",
        cash: "",
        type: null,
        password: ""
      },

      isLoading: false
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      texts: ({ member }) => member.texts,
      withdrawType: ({ config }) => config.withdraw_conf.withdraw_message
    }),
    isWeixinshow () {
      return isWeixin();
    },
    isWithdraw () {
      return this.is_start && this.is_start == 1
        ? this.can_use_money && this.can_use_money > 0
          ? false
          : true
        : true;
    },
    withdrawBtnText () {
      return this.is_start && this.is_start == 1
        ? this.can_use_money && this.can_use_money > 0
          ? "提現"
          : "可用" + this.texts.balance_style + "為0，不可提現"
        : "未开启提現";
    },
    payMoney () {
      let money = null;
      this.params.cash && (money = parseFloat(this.params.cash));
      return money;
    }
  },

  onLoad () {
    this.getData();
  },
  methods: {
    ...mapActions(["setSubscribe"]),
    getData () {
      GET_ASSETWITHDRAWINFO()
        .then(({ data }) => {
          this.can_use_money = parseFloat(data.balance || 0);
          this.is_start = data.is_start;
          this.is_alipay = data.is_alipay == 1;
          this.is_wpy = data.is_wpy == 1;
          // this.wx_openid = data.wx_openid;
          this.withdraw_cash_min = parseFloat(data.withdraw_cash_min || 0);
        })
        .catch(() => { });
    },
    success (e) {
      this.onWithdraw();
    },
    openSubscribeError (e) {
      console.log(e, "失敗");
      const that = this;
      that.$Prompt.toast(JSON.stringify(e, "失敗"));
    },
    onPayPassword (password) {
      this.params.password = password;
      this.onWithdraw();
    },
    onSelectAccount (item) {
      this.params.bank_account_id = item.id;
      this.params.type = item.type;
    },
    onWithdraw () {
      const $this = this;
      if (!this.params.bank_account_id && this.params.type != 2) {
        this.$Prompt.toast("请选择提現账户！");
        return false;
      }
      if (isNaN(parseFloat(this.params.cash))) {
        this.$Prompt.toast("请输入提現金额！");
        return false;
      }
      if (parseFloat(this.params.cash) <= 0) {
        this.$Prompt.toast("提現金额不能低于0！");
        return false;
      }
      if (parseFloat(this.params.cash) < this.withdraw_cash_min) {
        this.$Prompt.toast("提現金额不可低于最小提現金额！");
        return false;
      }
      if (parseFloat(this.params.cash) > this.can_use_money) {
        this.$Prompt.toast(
          "提現金额高于可提現" + this.texts.balance_style + "！"
        );
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.params.password)
        .then(() => {
          APPLY_ASSETWITHDRAW({
            ...this.params,
            bank_account_id:
              this.params.type == 2 ? "" : this.params.bank_account_id
          })
            .then(({ message }) => {
              this.setSubscribe({ node_id: 17 }).then(() => {
                this.isLoading = false;
                this.$Prompt
                  .toast({ title: message, icon: "success" })
                  .then(() => {
                    setTimeout(function () {
                      $this.$Navigate.back();
                    }, 500);
                  });
              });
            })
            .catch(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          this.isLoading = false;
          this.params.password = "";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
