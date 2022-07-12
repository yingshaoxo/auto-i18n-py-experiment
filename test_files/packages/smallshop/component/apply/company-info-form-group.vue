<template>
  <view >
    <!-- <view class="cell-group-title">基本信息</view>
    <lk-field
      label="聯係人"
      required
      v-model="form.contacts_name"
      placeholder="必填，请输入聯係人"
    />
    <lk-field
      label="聯繫電話"
      required
      v-model="form.contacts_phone"
      type="number"
      placeholder="必填，请输入聯繫電話"
    />
    <lk-field
      label="電子郵箱"
      required
      v-model="form.contacts_email"
      type="text"
      placeholder="必填，请输入電子郵箱"
    />
    <lk-cell-picker-group
      label="聯繫地址"
      required
      mode="region"
      placeholder="請選擇地區"
      @confirm="onArea"
    />
    <lk-field
      label="詳細地址"
      required
      v-model="form.company_address_detail"
      placeholder="必填，请输入詳細地址"
    /> -->

    <lk-field
      label="公司名稱"
      required
      v-model="form.company_name"
      placeholder="必填，请输入公司名稱"
    />
    <lk-cell-picker-group
      v-model="companyType"
      required
      label="公司類型"
      placeholder="请选择公司類型"
      :columns="companyTypeColumn"
      @confirm="onCompanyType"
    />
    <lk-field
      label="公司電話"
      required
      v-model="form.company_phone"
      type="number"
      placeholder="必填，请输入公司電話"
    />
    <lk-field
      label="員工人數"
      required
      v-model="form.company_employee_count"
      type="number"
      placeholder="必填，请输入員工人數"
    />
    <lk-field
      label="注冊資金(萬元)"
      required
      v-model="form.company_registered_capital"
      placeholder="必填，请输入注冊資金"
    />
    <lk-field
      label="營業執照號"
      required
      v-model="form.business_licence_number"
      placeholder="必填，请输入營業執照號"
    />
    <lk-field
      label="經營範圍"
      required
      type="textarea"
      v-model="form.business_sphere"
      placeholder="必填，请输入經營範圍"
    />
    <cell-upload-image
      v-model="form.business_licence_number_electronic"
      label="營業執照"
    />
  </view>
</template>

<script>
import cellUploadImage from "./cell-upload-image";
export default {
  data() {
    return {
      companyType: "",
      companyTypeColumn: [
        { name: "私營企業" },
        { name: "個體戶" },
        { name: "外企" },
        { name: "中外合資" }
      ],
      form: {
        // contacts_name: "",
        // contacts_phone: "",
        // contacts_email: "",
        // company_province_id: "",
        // company_city_id: "",
        // company_district_id: "",
        // company_address_detail: "",

        company_name: "",
        company_type: "",
        company_phone: "",
        company_employee_count: "",
        company_registered_capital: "",
        business_licence_number: "",
        business_sphere: "",
        business_licence_number_electronic: ""
      }
    };
  },
  methods: {
    onArea(data) {
      const ids = data.item.map(({ id }) => id);
      this.form.company_province_id = ids[0];
      this.form.company_city_id = ids[1];
      this.form.company_district_id = ids[2];
    },
    onCompanyType(index) {
      const item = this.companyTypeColumn[index];
      this.form.company_type = item.name;
    }
  },
  components: {
    cellUploadImage
  }
};
</script>

<style lang="scss" scoped>
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>
