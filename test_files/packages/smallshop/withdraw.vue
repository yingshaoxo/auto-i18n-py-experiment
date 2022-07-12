<template>
  <view class="pages">
    <view>
      <lk-cell field :title="'可提現利潤'">
        <view class="price-color">{{ f_money | yuan }}</view>
      </lk-cell>
      <lk-field
        v-model="params.money"
        label="提現金額"
        type="digit"
        placeholder="请输入提現金額"
      />
      <!-- <lk-cell title="請上傳轉賬憑證" field required>
        <lk-upload
          uploadText="上傳"
          height="250"
          width="250"
          :maxCount="1"
          @on-success="voucherSuccess"
        ></lk-upload>
      </lk-cell> -->
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
            提現
          </lk-button>
        </view>
      </lk-wx-open-subscribe>
    </view>
  </view>
</template>

<script>
import { ADDWITHDRAW } from "@/common/interface/smallshop";
export default {
  name: "packages-smallshop-withdraw",
  data() {
    return {
      isLoading: false,
      f_money: "",
      params: {
        money: "",
      },
    };
  },

  onLoad(query) {
    this.f_money = query.money;
  },
  methods: {
    success() {
      this.onRecharge();
    },

    onRecharge() {
      const value = this.params.money;
      if (this.isProceeds) {
        this.params.type = 5; //渠道商貨款充值類型
      }
      if (isNaN(parseFloat(value))) {
        this.$Prompt.toast("请输入提現金額！");
        return false;
      }
      if (value <= 0) {
        this.$Prompt.toast("提現金額不能低于0！");
        return false;
      }
      if (value > parseFloat(this.f_money)) {
        this.$Prompt.toast("提現金額不能大于最大可提現利潤！");
        return false;
      }

      this.isLoading = true;
      ADDWITHDRAW(this.params)
        .then(({ data }) => {
          this.$Prompt.toast({ title: "提交成功", icon: "success" });
          setTimeout(() => {
            this.$Navigate.push("/pages/smallshop/index");
          }, 500);
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
