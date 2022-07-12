<template>
  <view class="bg-white card-group-box">
    <lk-cell icon="orders-o" title="發票信息" />
    <lk-cell-info-list :list="columns" @btn-click="btnClick" />
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
export default {
  data() {
    return {};
  },
  props: {
    detail: Object
  },
  computed: {
    columns() {
      let arr = [];
      if (this.detail.invoice.type) {
        arr.push({
          title: "發票類型",
          value:
            this.detail.invoice.type == 1 ? "電子普通發票" : "增值稅專用發票",
          btn: this.detail.invoice.is_upload > 0 ? "查看發票" : ""
        });
      }

      if (this.detail.invoice.type == 1) {
        if (this.detail.invoice.title) {
          arr.push({
            title: "抬頭類型",
            value: this.detail.invoice.title == 1 ? "個人" : "公司"
          });
        }
        arr.push({ title: "發票抬頭", value: this.detail.invoice.title_name });
        if (this.detail.invoice.title != 1) {
          arr.push({
            title: "稅號",
            value: this.detail.invoice.taxpayer_no
          });
        }
      }
      if (this.detail.invoice.type == 2) {
        arr.push(
          {
            title: "公司名稱",
            value: this.detail.invoice.company_name
          },
          {
            title: "納銳人識別號",
            value: this.detail.invoice.taxpayer_no
          },
          {
            title: "注冊地址",
            value: this.detail.invoice.company_addr
          },
          {
            title: "注冊電話",
            value: this.detail.invoice.mobile
          },
          {
            title: "開戶銀行",
            value: this.detail.invoice.bank
          },
          {
            title: "銀行賬戶",
            value: this.detail.invoice.card_no
          }
        );
      }

      arr.push({ title: "發票內容", value: this.detail.invoice.content });
      return arr;
    }
  },
  methods: {
    btnClick(item) {
      this.$Navigate.push({
        path: "/packages/invoice/detail",
        query: {
          order_no: this.detail.order_no
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
