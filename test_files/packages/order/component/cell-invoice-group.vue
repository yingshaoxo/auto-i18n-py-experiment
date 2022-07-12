<template>
  <view v-if="tax_fee && (tax_fee.is_pt_show || tax_fee.is_zy_show)">
    <lk-cell :title="title" is-link :value="value" @click="show = true" />
    <lk-popup v-model="show" :title="title" position="bottom" round closeable>
      <view class="cell-group">
        <view class="cell">
          <view class="cell-title">發票類型</view>
          <view class="check-wrap">
            <text
              :class="is_bill_type_active == 1 ? 'active' : ''"
              :style="
                is_bill_type_active == 1 ? 'background:' + theme.color : ''
              "
              v-if="tax_fee.is_pt_show"
              @click="checkBillType(1)"
              >電子普通發票</text
            >
            <text
              :class="is_bill_type_active == 2 ? 'active' : ''"
              :style="
                is_bill_type_active == 2 ? 'background:' + theme.color : ''
              "
              v-if="tax_fee.is_zy_show"
              @click="checkBillType(2)"
              >增值稅專用發票</text
            >
          </view>
          <view class="text">
            電子普通發票和纸质普通發票具备同等法律效力，可支持報銷入賬，發票開具後可在訂單詳情頁查看。
          </view>
        </view>
        <view class="cell" v-if="is_bill_type_active == 1">
          <view class="cell-title">發票抬頭</view>
          <view class="check-wrap displayflex">
            <view>
              <text
                :class="is_bill_head_active == index ? 'active' : ''"
                :style="
                  is_bill_head_active == index
                    ? 'background:' + theme.color
                    : ''
                "
                v-for="(item, index) in bill_head_list"
                :key="index"
                @click="checkBillHead(index)"
                >{{ item.title }}</text
              ></view
            >

            <lk-icon
              square
              class-prefix="v-icon"
              name="v-icon-menu"
              @click="showinvoicelist"
            />
          </view>

          <view class="input">
            <lk-field
              v-model="headername"
              :border="false"
              label="抬頭名稱"
              placeholder="请输入抬頭名稱"
            />
            <lk-field
              v-model="head_taxpayer_no"
              v-if="is_bill_head_active == 1"
              :border="false"
              label="納稅人識別號"
              placeholder="请输入納稅人識別號"
            />
          </view>
        </view>
        <view class="cell" v-if="is_bill_type_active == 2">
          <view class="cell-title displayflex"
            >公司信息
            <lk-icon
              square
              class-prefix="v-icon"
              name="v-icon-menu"
              @click="showinvoicelist"
            />
          </view>
          <view class="input">
            <lk-field
              v-model="company_name"
              :border="false"
              label="公司名稱"
              placeholder="请输入公司名稱"
            />
            <lk-field
              v-model="com_taxpayer_no"
              :border="false"
              label="納稅人識別號"
              placeholder="请输入納稅人識別號"
            />
            <lk-field
              v-model="logon_addr"
              :border="false"
              label="注冊地址"
              placeholder="请输入注冊地址"
            />
            <lk-field
              v-model="logon_phone"
              type="number"
              :border="false"
              label="注冊電話"
              placeholder="请输入注冊電話"
            />
            <lk-field
              v-model="bank"
              :border="false"
              label="開戶銀行"
              placeholder="请输入開戶銀行"
            />
            <lk-field
              v-model="card_no"
              type="number"
              :border="false"
              label="銀行賬戶"
              placeholder="请输入銀行賬戶"
            />
          </view>
        </view>
        <view class="cell">
          <view class="cell-title">發票內容</view>
          <view class="check-wrap">
            <text
              :class="is_bill_content_active == index ? 'active' : ''"
              :style="
                is_bill_content_active == index
                  ? 'background:' + theme.color
                  : ''
              "
              v-for="(item, index) in bill_content_list"
              :key="index"
              @click="checkGoodsTilte(index)"
              >{{ item.title }}</text
            >
          </view>
          <view class="text">
            {{
              is_bill_content_active == 0
                ? bill_content_list[0].content
                : bill_content_list[1].content
            }}
          </view>
        </view>
      </view>
      <view class="foot-btn-group fixed foot-flex">
        <lk-button
          class="foot-btn"
          block
          round
          plain
          hairline
          type="danger"
          :color="theme.color"
          @click="onCancel"
        >
          不開具發票
        </lk-button>
        <lk-button
          class="foot-btn"
          block
          round
          type="danger"
          :color="theme.gradient"
          @click="onSure"
        >
          確定
        </lk-button>
      </view>
    </lk-popup>

    <!-- 發票抬頭列表 -->
    <lk-popup
      v-model="invoiceshow"
      title="选择發票抬頭"
      position="bottom"
      round
      closeable
    >
      <lk-radio-group
        v-model="defaultId"
        flex-flow="column"
        :active-color="theme.color"
        @change="onDefault"
      >
        <view class="cell-group">
          <lk-cell
            isLink
            v-for="(item, index) in invoicelist"
            :key="index"
            :label="item.taxpayer_no"
            @click="invoiceinfo(item)"
          >
            <slot name="title">
              <view class="displayflex">
                <view>
                  <view>{{
                    item.title_name ? item.title_name : item.company_name
                  }}</view>
                  <view>{{ item.taxpayer_no }}</view>
                </view>
                <!-- <view> <lk-radio :name="item.user_invoice_id"></lk-radio></view> -->
              </view>
            </slot>
          </lk-cell>
        </view>
      </lk-radio-group>

      <view class="foot-btn-group">
        <lk-button
          block
          round
          type="danger"
          :color="theme.color"
          @click="goinvoice"
        >
          新增抬頭
        </lk-button>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import {
  GET_USERINVOICELIST,
  GET_USERINVOICEINFO
} from "@/common/interface/member";

function delSpace(value) {
  return value.replace(/\s*/g, "");
}
export default {
  data() {
    return {
      defaultId: "",
      invoiceshow: false,
      invoicelist: [], //發票抬頭列表

      title: "發票",
      show: false,
      value: "",

      headername: "",
      head_taxpayer_no: "",

      company_name: "",
      com_taxpayer_no: "",
      logon_addr: "",
      logon_phone: "",
      bank: "",
      card_no: "",

      is_bill_type_active: 1, // 1=>電子普通發票,2 =>增值稅專用發票

      is_bill_head_active: 0,
      bill_head_list: [
        {
          title: "個人"
        },
        {
          title: "公司"
        }
      ],

      is_bill_content_active: 0,
      bill_content_list: [
        {
          title: "商品明細",
          content:
            "發票內容将显示商品名称與價格信息，發票金额为实际支付金额，不含優惠抵扣金額與運費。"
        },
        {
          title: "商品分類",
          content:
            "發票內容将显示分類名称（例：服裝/女裝/T卹）與價格信息，發票金额为实际支付金额，不含優惠抵扣金額。"
        }
      ],

      invoice: {},
      is_tax: 1 // 1 =>可以开具發票，2=>不可以开具發票
    };
  },

  props: {
    tax_fee: [Object],
    shop_id: [String, Number],
    price: [Number]
  },
  mounted() {
    this.isBillType();
    this.defaultinvoiceinfo();
  },
  methods: {
    defaultinvoiceinfo() {
      //默認發票信息
      GET_USERINVOICEINFO().then(({ data }) => {
        this.invoiceinfo(data);
      });
    },
    invoiceinfo(item) {
      this.invoiceshow = false;
      if (item.type == 2) {
        this.is_bill_type_active = 2;
        this.company_name = item.company_name;
        this.com_taxpayer_no = item.taxpayer_no;
        this.logon_addr = item.company_addr;
        this.logon_phone = item.mobile;
        this.bank = item.bank;
        this.card_no = item.card_no;
      }
      if (item.type == 1 && item.title == 1) {
        this.headername = item.title_name;
        this.is_bill_type_active = 1;
        this.is_bill_head_active = 0;
      }
      if (item.type == 1 && item.title == 2) {
        this.headername = item.title_name;
        this.head_taxpayer_no = item.taxpayer_no;
        this.is_bill_head_active = 1;
        this.is_bill_type_active = 1;
      }
    },
    goinvoice() {
      this.$Navigate.push("/packages/member/invoice/post");
      this.invoiceshow = false;
    },
    showinvoicelist() {
      //發票抬頭
      this.invoiceshow = true;
      this.$Prompt.loading();
      GET_USERINVOICELIST({ page_index: 1 }).then(({ data }) => {
        this.$Prompt.clear();
        this.invoicelist = data.data || [];

        const obj = data.data.filter(e => {
          return e.is_default == 1;
        })[0];
        this.defaultId = obj ? obj.user_invoice_id : "";
      });
    },
    isBillType() {
      if (this.tax_fee) {
        if (this.tax_fee.is_pt_show && !this.tax_fee.is_zy_show) {
          this.is_bill_type_active = 1;
          this.value = "不開具發票";
        } else if (!this.tax_fee.is_pt_show && this.tax_fee.is_zy_show) {
          this.is_bill_type_active = 2;
          this.value = "不開具發票";
        } else if (this.tax_fee.is_pt_show && this.tax_fee.is_zy_show) {
          this.is_bill_type_active = 1;
          this.value = "不開具發票";
        }
      }
    },
    onCancel() {
      this.show = false;
      this.value = "不開具發票";
      this.headername = "";
      this.head_taxpayer_no = "";
      this.company_name = "";
      this.com_taxpayer_no = "";
      this.logon_addr = "";
      this.logon_phone = "";
      this.bank = "";
      this.card_no = "";
      this.is_tax = 2;
      this.$emit("get-invoice", this.invoice, this.shop_id, this.is_tax);
    },
    onSure() {
      if (this.is_bill_type_active == 1) {
        this.value = "電子普通發票";
        this.invoice.type = 1;
        if (!delSpace(this.headername)) {
          this.$Prompt.toast("请输入抬頭名稱");
          return false;
        }
        this.invoice.title_name = this.headername;
        if (this.is_bill_head_active == 0) {
          this.invoice.title = 1;
        } else {
          this.invoice.title = 2;
          if (!delSpace(this.head_taxpayer_no)) {
            this.$Prompt.toast("请输入納稅人識別號");
            return false;
          }
          this.invoice.taxpayer_no = this.head_taxpayer_no;
        }
        this.invoice.invoice_tax_key = "pt";
        this.invoice.price = this.price;
        this.is_tax = 1;
      } else if (this.is_bill_type_active == 2) {
        this.value = "增值稅專用發票";
        this.invoice.type = 2;
        if (!delSpace(this.company_name)) {
          this.$Prompt.toast("请输入公司名稱");
          return false;
        } else if (!delSpace(this.com_taxpayer_no)) {
          this.$Prompt.toast("请输入納稅人識別號");
          return false;
        } else if (!delSpace(this.logon_phone)) {
          this.$Prompt.toast("请输入注冊電話");
          return false;
        } else if (!delSpace(this.logon_addr)) {
          this.$Prompt.toast("请输入注冊地址");
          return false;
        } else if (!delSpace(this.bank)) {
          this.$Prompt.toast("请输入開戶銀行");
          return false;
        } else if (!delSpace(this.card_no)) {
          this.$Prompt.toast("请输入銀行賬戶");
          return false;
        }
        this.invoice.company_name = this.company_name;
        this.invoice.taxpayer_no = this.com_taxpayer_no;
        this.invoice.company_addr = this.logon_addr;
        this.invoice.mobile = this.logon_phone;
        this.invoice.bank = this.bank;
        this.invoice.card_no = this.card_no;
        this.invoice.invoice_tax_key = "zy";
        this.invoice.price = this.price;
        this.is_tax = 1;
      } else {
        this.value = "不開具發票";
        this.is_tax = 2;
      }
      if (this.is_bill_content_active == 0) {
        this.invoice.content_type = 1;
      } else {
        this.invoice.content_type = 2;
      }
      this.show = false;
      this.$emit("get-invoice", this.invoice, this.shop_id, this.is_tax);
    },
    checkBillType(index) {
      this.is_bill_type_active = index;
    },
    checkBillHead(index) {
      this.is_bill_head_active = index;
    },
    checkGoodsTilte(index) {
      this.is_bill_content_active = index;
    }
  }
};
</script>

<style scoped lang="scss">
.displayflex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cell-group {
  padding-bottom: 140rpx;
  height: 70vh;
  overflow-y: auto;
}
.cell {
  position: relative;
}
.cell:not(:last-child)::before {
  content: " ";
  position: absolute;
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  border-bottom: 2rpx solid #ebedf0;
}
.cell-title {
  padding: 20rpx 30rpx;
  font-weight: 800;
  margin-top: 20rpx;
}
.check-wrap {
  padding: 20rpx 30rpx;
  overflow: hidden;
}
.check-wrap text {
  display: inline-block;
  border: 2rpx solid #dddbdb;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
}
.check-wrap text.active {
  color: #fff;
  background-color: $red;
  border: 2rpx solid transparent;
}
.cell .text {
  font-size: $font-size-sm;
  color: $text-light;
  line-height: 32rpx;
  padding: 20rpx 30rpx;
}
.foot-flex {
  display: flex;
  padding: 30rpx 10rpx;
  background: #fff;
  .foot-btn {
    margin: 0 20rpx;
    flex: 1;
  }
}
</style>
