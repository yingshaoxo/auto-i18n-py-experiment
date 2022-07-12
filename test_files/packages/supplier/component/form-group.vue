<template>
  <view>
    <lk-field
      v-model="params.supplier_name"
      label="供應商名稱"
      placeholder="必填，請輸入供應商名稱"
      required
    />
    <lk-field
      v-model="params.company_name"
      label="公司名稱"
      placeholder="必填，請輸入真实公司名稱"
      required
    />
    <lk-cell-picker-group
      label="聯繫地址"
      placeholder="請選擇地址"
      mode="region"
      required
      :area-code="area_code"
      :area-value="areaValue"
      @confirm="areaConfirm"
    />
    <lk-field
      v-model="params.company_address_detail"
      label="詳細地址"
      placeholder="必填，請輸入詳細地址"
      required
    />
    <lk-field
      v-model="params.contacts_name"
      label="聯係人"
      placeholder="必填，請輸入聯係人"
      required
    />
    <lk-field
      v-model="params.contacts_phone"
      type="number"
      label="聯繫電話"
      placeholder="必填，請輸入聯繫電話"
      required
    />
    <lk-cell title="營業執照" required field>
      <lk-upload
        :max-count="1"
        @on-success="onUploadSuccess"
        @on-remove="onRemove"
        :fileList="fileList"
      />
    </lk-cell>
    <lk-cell-picker-group
      label="經營類目"
      placeholder="請選擇"
      required
      rangeKey="short_name"
      v-model="active"
      :columns="columns"
      @confirm="classConfirm"
    />
    <submit-group
      :protocolData="protocolData"
      @submit="onSubmit"
      :loading="loading"
    />
  </view>
</template>
<script>
import { GET_CATEGORY } from "@/common/interface/supplier";
import submitGroup from "./submit-group";
export default {
  name: "",
  data() {
    return {
      area_code: this.protocolData.area_code,
      areaValue: "",
      active: -1,
      params: {
        business_licence_number_electronic:
          this.protocolData.business_licence_number_electronic || "",
        area_code: this.protocolData.area_code || "",
        company_address_detail: this.protocolData.company_address_detail || "",
        company_name: this.protocolData.company_name || "",
        contacts_phone: this.protocolData.contacts_phone || "",
        contacts_name: this.protocolData.contacts_name || "",
        extend_category: this.protocolData.extend_category || "",
        area_code: this.protocolData.area_code || "",
        supplier_name: this.protocolData.supplier_name || ""
      },
      columns: []
    };
  },
  components: {
    submitGroup
  },
  props: {
    protocolData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fileList() {
      let list = [];
      if (this.protocolData.business_licence_number_electronic) {
        list.push({
          url: this.protocolData.business_licence_number_electronic
        });
      }
      return list;
    }
  },
  mounted() {
    const $this = this;
    GET_CATEGORY().then(res => {
      $this.columns = res.data;
      if ($this.protocolData.extend_category) {
        for (let index = 0; index < $this.columns.length; index++) {
          if (
            $this.protocolData.extend_category ==
            $this.columns[index].category_id
          ) {
            $this.active = index;
          }
        }
      }
    });
  },
  methods: {
    areaConfirm(data) {
      this.areaValue = `${data.item[0].label}/${data.item[1].label}/${data.item[2].label}`;
      this.params.area_code = data.code;
      this.params.area_name = this.areaValue;
    },
    onUploadSuccess(e) {
      this.params.business_licence_number_electronic = e.src;
    },
    onRemove() {
      this.params.business_licence_number_electronic = "";
    },
    classConfirm(e) {
      this.active = e;

      this.params.extend_category = this.columns[e].category_id;
    },
    onSubmit() {
      const $this = this;
      let params = $this.params;
      let paramsKey = [
        "supplier_name",
        "company_name",
        "area_code",
        "company_address_detail",
        "contacts_name",
        "contacts_phone",
        "business_licence_number_electronic",
        "extend_category"
      ];
      let toastConent = [
        "供應商名稱",
        "公司名稱",
        "聯繫地址",
        "詳細地址",
        "聯係人",
        "聯繫電話",
        "營業執照",
        "經營類目"
      ];
      for (let i = 0; i < paramsKey.length; i++) {
        if (!params[paramsKey[i]]) {
          $this.$Prompt.toast("請輸入" + toastConent[i]);
          return false;
        }
      }
      this.$emit("onSubmit", params);
    }
  }
};
</script>
<style scoped lang="scss"></style>
