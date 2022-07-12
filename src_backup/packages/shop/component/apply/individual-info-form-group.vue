<template>
  <view class="cell-group">
    <view class="cell-group-title">基本信息</view>
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
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        contacts_name: "",
        contacts_phone: "",
        contacts_email: "",
        company_province_id: "",
        company_city_id: "",
        company_district_id: "",
        company_address_detail: ""
      }
    };
  },
  methods: {
    onArea(data) {
      const ids = data.item.map(({ id }) => id);
      this.form.company_province_id = ids[0];
      this.form.company_city_id = ids[1];
      this.form.company_district_id = ids[2];
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>
