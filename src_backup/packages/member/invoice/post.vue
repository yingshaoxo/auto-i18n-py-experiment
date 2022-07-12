<template>
  <view class="pages">
    <lk-cell title="發票類型" field>
      <lk-radio-group
        v-model="invoice"
        :active-color="theme.color"
        @change="onTypeChange"
      >
        <lk-radio :name="0">
          <text>電子普通發票</text>
        </lk-radio>
        <lk-radio :name="1">
          <text>增值稅專用發票</text>
        </lk-radio>
      </lk-radio-group>
    </lk-cell>
    <view v-if="invoice == 0">
      <lk-cell title="發票抬頭" field>
        <lk-radio-group
          v-model="company"
          :active-color="theme.color"
          @change="onTypeinvoice"
        >
          <lk-radio :name="0">
            <text>個人</text>
          </lk-radio>
          <lk-radio :name="1">
            <text>公司</text>
          </lk-radio>
        </lk-radio-group>
      </lk-cell>
      <lk-field
        v-model="electronic_invoice.title_name"
        label="抬頭名稱"
        placeholder="请输入抬頭名稱"
        required
      />

      <lk-field
        v-if="company == 1"
        v-model="electronic_invoice.taxpayer_no"
        label="納稅人識別號"
        placeholder="请输入納稅人識別號"
        required
      />
      <lk-cell center title="设置默認發票抬頭">
        <switch
          :checked="!!electronic_invoice.is_default"
          slot="rightIcon"
          @change="
            electronic_invoice.is_default = !electronic_invoice.is_default
          "
        />
      </lk-cell>
    </view>
    <!-- 增值稅發票 -->
    <view v-if="invoice == 1">
      <lk-field
        v-model="added_value.company_name"
        label="公司名稱"
        placeholder="请输入公司名稱"
        required
      />

      <lk-field
        v-model="added_value.taxpayer_no"
        label="納稅人識別號"
        placeholder="请输入納稅人識別號"
        required
      />

      <lk-field
        v-model="added_value.company_addr"
        label="注冊地址"
        placeholder="请输入注冊地址"
        required
      />

      <lk-field
        v-model="added_value.mobile"
        label="注冊電話"
        type="number"
        placeholder="请输入注冊電話"
        required
      />

      <lk-field
        v-model="added_value.bank"
        label="開戶銀行"
        placeholder="请输入開戶銀行"
        required
      />
      <lk-field
        v-model="added_value.card_no"
        label="銀行賬戶"
        type="number"
        placeholder="请输入銀行賬戶"
        required
      />

      <lk-cell center title="設置默認收貨地址">
        <switch
          :checked="!!added_value.is_default"
          slot="rightIcon"
          @change="added_value.is_default = !added_value.is_default"
        />
      </lk-cell>
    </view>
    <view class="foot-btn-group">
      <lk-button round block theme-color :loading="isLoading" @click="onSave">
        保存
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  ADDUSERINVOICE,
  GET_USERINVOICEINFOBYCOND //獲取用戶發票信息
} from "@/common/interface/member";
export default {
  data() {
    return {
      isLoading: false,
      invoice: 0, //發票類型
      company: 0, //個人 公司
      //普通電子發票
      electronic_invoice: {
        type: 1,
        title: 1, // 發票抬頭 1個人 2 公司
        title_name: "", //抬頭名稱
        taxpayer_no: "", //納粹人識別號
        is_default: 0
      },
      //增值稅專用發票
      added_value: {
        type: 2,
        company_name: "", //公司名稱
        company_addr: "", //公司地址
        taxpayer_no: "", //納稅人識別號
        bank: "", //開戶銀行
        card_no: "", //銀行賬戶
        mobile: "", //注冊電話
        is_default: 0
      }
    };
  },
  onLoad(query) {
    if (query.user_invoice_id) this.getUserInvoiceInfo(query.user_invoice_id);
  },
  methods: {
    getUserInvoiceInfo(user_invoice_id) {
      GET_USERINVOICEINFOBYCOND({ user_invoice_id: user_invoice_id }).then(
        ({ data }) => {
          this.invoice = data.type - 1;
          this.company = data.title - 1;
          this.electronic_invoice = data;
          this.added_value = data;
        }
      );
    },
    onTypeChange() {},
    onTypeinvoice(e) {
      this.electronic_invoice.title = e + 1;
    },
    onSave() {
      if (this.invoice == 0) {
        if (!this.electronic_invoice.title_name) {
          this.$Prompt.toast("请输入抬頭名稱");
          return false;
        }
        if (
          this.electronic_invoice.title == 2 &&
          !this.electronic_invoice.taxpayer_no
        ) {
          this.$Prompt.toast("请输入納粹人識別號");
          return false;
        }
      }

      if (this.invoice == 1) {
        if (!this.added_value.company_name) {
          this.$Prompt.toast("请输入公司名稱");
          return false;
        }
        if (!this.added_value.company_addr) {
          this.$Prompt.toast("請輸入公司地址");
          return false;
        }
        if (!this.added_value.taxpayer_no) {
          this.$Prompt.toast("请输入納稅人識別號");
          return false;
        }
        if (!this.added_value.card_no) {
          this.$Prompt.toast("请输入銀行賬戶");
          return false;
        }
        if (!this.added_value.bank) {
          this.$Prompt.toast("请输入開戶銀行");
          return false;
        }
        if (!this.added_value.mobile) {
          this.$Prompt.toast("请输入注冊電話");
          return false;
        }
      }
      this.isLoading = true;
      let params =
        this.invoice == 1 ? this.added_value : this.electronic_invoice;
      ADDUSERINVOICE(params)
        .then(res => {
          this.isLoading = false;
          this.$Navigate.back();
        })
        .catch(error => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style></style>
