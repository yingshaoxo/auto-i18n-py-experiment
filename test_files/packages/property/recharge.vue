<template>
  <view class="pages">
    <view>
      <lk-field
        v-model="params.recharge_money"
        label="充值金額"
        type="digit"
        placeholder="请输入充值金額"
      />
    </view>
    <view class="foot-btn-group">
      <lk-wx-open-subscribe node_id="16" @success="success">
        <view slot="btn-subscribe">
          <lk-button
            block
            round
            type="danger"
            theme-color
            :loading="isLoading"
            @click="onRecharge"
          >
            充值
          </lk-button>
        </view>
      </lk-wx-open-subscribe>
    </view>
  </view>
</template>

<script>
import {
  RECHARGE_ASSETBALANCELOG,
  CREATE_ASSETRECHARORDER
} from "@/common/interface/property";
import { mapActions } from "vuex";

export default {
  name: "packages-property-recharge",
  data() {
    return {
      isLoading: false,
      isProceeds: false, //貨款充值
      params: {
        recharge_money: "",
        out_trade_no: ""
      }
    };
  },
  computed: {},
  onLoad(query) {
    this.isProceeds = query.hash === "proceeds";
  },
  methods: {
    ...mapActions(["setSubscribe"]),
    success() {
      this.onRecharge();
    },

    getData() {
      RECHARGE_ASSETBALANCELOG()
        .then(({ data }) => {
          this.params.out_trade_no = data.out_trade_no;
        })
        .catch(() => {});
    },
    onRecharge() {
      const value = this.params.recharge_money;
      if (this.isProceeds) {
        this.params.type = 5; //渠道商貨款充值类型
      }
      if (isNaN(parseFloat(value))) {
        this.$Prompt.toast("请输入充值金額！");
        return false;
      }
      if (value <= 0) {
        this.$Prompt.toast("充值金額不能低于0！");
        return false;
      }
      this.isLoading = true;
      RECHARGE_ASSETBALANCELOG()
        .then(({ data }) => {
          this.params.out_trade_no = data.out_trade_no;
          CREATE_ASSETRECHARORDER(this.params)
            .then(res => {
              // 發送訂閱消息
              this.setSubscribe({ node_id: 16 }).then(() => {
                this.$Navigate
                  .push({
                    path: "/pay/payment",
                    query: {
                      out_trade_no: res.data.out_trade_no,
                      hash: "recharge"
                    }
                  })
                  .then(() => {
                    this.isLoading = false;
                  });
              });
            })
            .catch(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
