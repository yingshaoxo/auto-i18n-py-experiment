<template>
  <view class="pages">
    <view>
      <lk-cell field title="可提現金額">
        <view class="price-color">{{ profit | yuan }}</view>
      </lk-cell>
      <lk-cell field title="提現方式">
        <lk-radio-group v-model="active" :active-color="theme.color">
          <lk-radio
            :name="index"
            v-for="(item, index) in typeList"
            :key="index"
          >
            {{ item.text }}
          </lk-radio>
        </lk-radio-group>
      </lk-cell>
      <view v-show="showAuccount">
        <lk-cell-withdraw-account-popup
          :account-id="params.account_id"
          :withdraw-type="withdrawType"
          @select="onSelectAccount"
        />
      </view>
      <lk-field
        label="提現金額"
        type="digit"
        placeholder="请输入提現金額"
        v-model="params.cash"
      />
    </view>
    <view class="cell-group">
      <lk-cell title="提現明細" to="/packages/microshop/profit/log" is-link />
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      type="7"
      :money="payMoney"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :disabled="isDisabled"
        :loading="isLoading"
        @click="onWithdraw"
      >
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import mixinPayPassword from "@/mixins/valid-pay-password";
import {
  GET_WITHDRAWSINFO,
  APPLY_WITHDRAW
} from "@/common/interface/microshop";
export default {
  name: "packages-microshop-profit-withdraw",
  data() {
    return {
      profit: 0,
      withdrawals_min: 0,

      active: 0,

      params: {
        cash: "",
        account_id: "",
        password: ""
      },

      withdrawType: [],

      isLoading: false
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts
    }),
    showAuccount() {
      const flag = this.typeList[this.active]
        ? this.typeList[this.active].showAuccount
        : false;
      // 餘額提現account_id為-1
      this.params.account_id = !flag ? "-1" : "";
      return flag;
    },
    typeList() {
      const withdrawTypeArr = this.withdrawType || [];
      const arr = [];
      if (withdrawTypeArr.some(e => e == 5)) {
        arr.push({
          showAuccount: false,
          text: this.memberTexts.balance_style
        });
      }
      if (withdrawTypeArr.some(e => e == 1 || e == 2 || e == 3 || e == 4)) {
        arr.push({
          showAuccount: true,
          text: "第三方"
        });
      }
      return arr;
    },
    isDisabled() {
      return this.profit <= 0 ? true : false;
    },
    btnText() {
      return this.profit <= 0 ? "提現金額為0，不可提現" : "提現";
    },
    payMoney() {
      let money = null;
      this.params.cash && (money = parseFloat(this.params.cash));
      return money;
    }
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_WITHDRAWSINFO()
        .then(({ data }) => {
          this.profit = parseFloat(data.profit);
          this.withdrawals_min = data.withdrawals_min
            ? parseFloat(data.withdrawals_min)
            : 0;
          this.withdrawType = data.withdrawals_type;
        })
        .catch(() => {});
    },
    // 獲取選中賬戶id
    onSelectAccount({ id, type }) {
      // 微信提現account_id為-2
      this.params.account_id = type == 2 ? "-2" : id;
    },
    // 獲取支付密碼
    onPayPassword(password) {
      this.params.password = password;
      this.onWithdraw();
    },
    onWithdraw() {
      const $this = this;
      if (!$this.params.account_id && this.showAuccount) {
        $this.$Prompt.toast("请选择提現账户！");
        return false;
      }
      if (isNaN(parseFloat($this.params.cash))) {
        $this.$Prompt.toast("请输入提現金額！");
        return false;
      }
      if (parseFloat($this.params.cash) <= 0) {
        $this.$Prompt.toast("提現金額不能低于0！");
        return false;
      }
      if (parseFloat($this.params.cash) < $this.withdrawals_min) {
        $this.$Prompt.toast("提現金額不能低于最低提現额度！");
        return false;
      }
      if (parseFloat($this.params.cash) > $this.profit) {
        $this.$Prompt.toast("提現金額不可高于可提現金額！");
        return false;
      }
      $this.isLoading = true;
      $this
        .validPayPassword($this.params.password)
        .then(() => {
          APPLY_WITHDRAW($this.params)
            .then(({ message }) => {
              $this.$Prompt
                .toast({ title: message, icon: "success" })
                .then(() => {
                  setTimeout(function() {
                    $this.$Navigate.back();
                  }, 500);
                });
            })
            .catch(() => {
              $this.isLoading = false;
            });
        })
        .catch(() => {
          $this.isLoading = false;
          $this.params.password = "";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
</style>
