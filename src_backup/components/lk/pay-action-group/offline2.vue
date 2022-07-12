<template>
  <view>
    <view class="opayBox">
      <view class="opayCode">
        <lk-cell>
            <view>銀行分行:{{offline_pay.pay_bank}}
              <lk-icon
                @click="onCopy(offline_pay.pay_bank)"
                name="v-icon-copy"
                size="10"
                color="inherit"
                class-prefix="v-icon"
              />
            </view>
            <view>行用戶名:{{offline_pay.pay_bank_name}}
              <lk-icon
                @click="onCopy(offline_pay.pay_bank_name)"
                name="v-icon-copy"
                size="10"
                color="inherit"
                class-prefix="v-icon"
              />
            </view>
            <view>銀行卡號:{{offline_pay.pay_bank_number}}
              <lk-icon
                @click="onCopy(offline_pay.pay_bank_number)"
                name="v-icon-copy"
                size="10"
                color="inherit"
                class-prefix="v-icon"
              />
            </view>
            <view>真實姓名:{{offline_pay.pay_bank_user}}
              <lk-icon
                @click="onCopy(offline_pay.pay_bank_user)"
                name="v-icon-copy"
                size="10"
                color="inherit"
                class-prefix="v-icon"
              />
            </view>
            <view>備注:{{offline_pay.pay_memo}}
              <lk-icon
                @click="onCopy(offline_pay.pay_memo)"
                name="v-icon-copy"
                size="10"
                color="inherit"
                class-prefix="v-icon"
              />
            </view>
        </lk-cell>
      </view>
      <view class="opayVoucher">
        <lk-upload
          uploadText="請上傳轉賬憑證"
          height="250"
          width="600"
          :maxCount="1"
          @on-success="voucherSuccess"
        ></lk-upload>
      </view>

      <view class="opaytext">{{ offline_pay.collection_memo }}</view>
    </view>
  </view>
</template>

<script>
import $System from "@/api/system";
export default {
  props: {
    offline_pay: {
      type: Object,
    },
  },
  methods: {
    voucherSuccess(e) {
      this.$emit("pay_voucher_src", e.src);
    },
    onCopy(data) {
      $System.setClipboardData(data);
    }
  },
};
</script>

<style lang="scss" scoped>
.opayBox {
  background-color: #fff;
  padding: 10rpx 0 120rpx 0;
  .opayCode {
    width: 400rpx;
    margin: 20rpx auto;
    image {
      width: 100%;
    }
  }
  .opayVoucher {
    width: 600rpx;
    margin: 20rpx auto;
  }
  .opaytext {
    width: 500rpx;
    margin: 40rpx auto;
    color: #666;
  }
}
</style>
