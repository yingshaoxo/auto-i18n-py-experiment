<template>
  <view class="pages">
    <view>
      <lk-field
        v-model="params.money"
        label="充值金額"
        type="digit"
        placeholder="请输入充值金額"
      />
      <lk-cell title="請上傳轉賬憑證" field required>
        <lk-upload
          uploadText="上傳"
          height="250"
          width="250"
          :maxCount="1"
          @on-success="voucherSuccess"
        ></lk-upload>
      </lk-cell>
      
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

import { addCash } from "@/common/interface/smallshop";
export default {
    
  name: "packages-smallshop-recharge",
  data() {
    return {
      isLoading: false,

      params: {
        money: "",
        voucher: ""
      }
    };
  },

  onLoad(query) {
    
  },
  methods: {

    success() {
      this.onRecharge();
    },
    voucherSuccess(e){
  this.params.voucher = e.src
    },
    onRecharge() {
      const value = this.params.money;
      if (this.isProceeds) {
        this.params.type = 5; //渠道商貨款充值類型
      }
      if (isNaN(parseFloat(value))) {
        this.$Prompt.toast("请输入充值金額！");
        return false;
      }
      if (value <= 0) {
        this.$Prompt.toast("充值金額不能低于0！");
        return false;
      }
      if (!this.params.voucher) {
        this.$Prompt.toast("請上傳轉賬憑證！");
        return false;
      }
      this.isLoading = true;
      addCash(this.params)
        .then(({ data }) => {
          
                this.$Navigate
                  .push('/pages/smallshop/index')

              }).catch(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
