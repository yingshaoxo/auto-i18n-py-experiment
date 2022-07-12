
<template>
  <view>
    <view class="pages">
      <view>
        <lk-cell field title="可提現餘額">
          <view class="price-color first-letter">￥{{bonus}}</view>
        </lk-cell>
        <view class="cell-group">
          <lk-cell title="提現方式" field>
            <lk-radio-group v-model="action" :active-color="theme.color">
              <lk-radio :name="index" v-for="(item,index) in typepay " :key="index">{{item.pay}}</lk-radio>
            </lk-radio-group>
          </lk-cell>
        </view>
        <lk-field label="提現金額" type="digit" placeholder="請輸入提現佣金 " v-model="paramswithdraw.cash" />
      </view>
      <view v-show="showAuccount">
        <lk-cell-withdraw-account-popup
          :account-id="paramswithdraw.account_id"
          :withdraw-type="withdrawals_type"
          @select="onSelectAccount"
        />
      </view>
      <lk-cell field title="提現明細" to="/packages/merchant/log"></lk-cell>
      <view class="foot-btn-group">
        <lk-button
          bing-mobile
          block
          round
          type="danger"
          :disabled="bonus?false:true"
          :color="theme.gradient"
          :loading="isLoading"
          @click="onRecharge"
        >{{bonus?'提現':'餘額為0，不可提現'}}</lk-button>
      </view>
      <lk-modal-pay-password
        ref="modalPayPassword"
        v-model="isShowModalPayPassword"
        :money="paramswithdraw.cash"
        @confirm="onPayPassword"
        @cancel="isLoading = false"
      />
    </view>
  </view>
</template>
<script>
import {
  GET_ACHIEVEMENTWITHDRAWALSHOW,
  GET_ACHIEVEMENTWITHDRAWAL,
} from "@/common/interface/merchants";
import mixinPayPassword from "@/mixins/valid-pay-password";
export default {
  name: "packages-merchant-withdraw",
  data() {
    return {
      action: 0,
      paramswithdraw: {
        cash: "",
        account_id: "",
      },
      typepay: [],
      withdrawals_type: [],
      bonus: "",
      isLoading: false,
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    showAuccount() {
      const flag = this.typepay[this.action]
        ? this.typepay[this.action].showAuccount
        : false;
      // 餘額提現account_id為-1
      this.paramswithdraw.account_id = !flag ? "-1" : "";
      return flag;
    },
  },
  onLoad() {
    this.achievementlist();
    this.paytype();
  },
  onShow() {},
  methods: {
    achievementlist() {
      //提現数据
      GET_ACHIEVEMENTWITHDRAWALSHOW().then(({ data }) => {
        this.withdrawals_type = data.withdrawals_type;
        this.typepay = this.paytype(data.withdrawals_type);
        this.bonus = data.bonus;
      });
    },
 
    // 獲取選中賬戶id
    onSelectAccount({ id, type }) {
      // 微信提現account_id為-2
      this.paramswithdraw.account_id = type == 2 ? "-2" : id;
    },
    paytype(withdrawalstype) {
      let arrpaytype = [];
      const withdrawals_type = withdrawalstype || [];
      if (withdrawals_type.some((e) => e == "5")) {
        arrpaytype.push({
          showAuccount: false,
          pay: "餘額",
        });
      }
      if (
        withdrawals_type.some(
          (e) => e == "1" || e == "2" || e == "3" || e == "4"
        )
      ) {
        arrpaytype.push({
          showAuccount: true,
          pay: "第三方",
        });
      }
      return arrpaytype;
    },
    onPayPassword(e) {
      this.password = e;
      this.onRecharge();
    },
    onRecharge() {
      const $this = this;
      if (!$this.paramswithdraw.cash || $this.paramswithdraw.cash < 0) {
        $this.$Prompt.toast("請輸入正確的數值！");
        return false;
      }
      if (!$this.paramswithdraw.account_id && $this.showAuccount) {
        $this.$Prompt.toast("请选择提現账户！");
        return false;
      }
      if ($this.bonus == 0) {
        $this.$Prompt.toast("可提現佣金為0！");
        return false;
      }
      $this.isLoading = true;
      $this
        .validPayPassword(this.password)
        .then((res) => {
          $this.$Prompt.loading("提現中");
          GET_ACHIEVEMENTWITHDRAWAL(this.paramswithdraw)
            .then(({message}) => {
              $this.$Prompt.toast({title: message, icon: "success" });
              $this.paramswithdraw.cash = "";
              $this.isLoading = false;
              $this.password = "";
              $this.$Prompt.clear(); 
          GET_ACHIEVEMENTWITHDRAWALSHOW().then(({ data }) => {
              $this.bonus = data.bonus;
      });
            })
            .catch(() => {
              $this.$Prompt.clear();
              $this.password = "";
              $this.paramswithdraw.cash = "";
              $this.isLoading = false;
            });
        })
        .catch(() => {
          $this.$Prompt.clear();
          $this.password = "";
          $this.paramswithdraw.cash = "";
          $this.isLoading = false;
        });
    },
  },
};
</script>

<style>
</style>
