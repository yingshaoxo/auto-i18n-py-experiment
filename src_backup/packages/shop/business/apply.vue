<template>
  <view class="pages">
    <form-group v-if="formList.length" :items="formList" ref="formGroup" />
    <view v-else>
      <view class="cell-group">
        <lk-cell title="身份類型" field>
          <lk-radio-group v-model="form.apply_type" :active-color="theme.color">
            <lk-radio :name="1">個人</lk-radio>
            <lk-radio :name="2">公司</lk-radio>
          </lk-radio-group>
        </lk-cell>
      </view>
      <individual-info-form-group ref="individual" />
      <view v-show="form.apply_type == 2">
        <company-info-form-group ref="company" />
      </view>
      <identity-info-form-group ref="identity" />
    </view>
    <shop-info-form-group ref="shop" />
    <view class="foot-btn-group">
      <lk-button
        round
        block
        type="danger"
        theme-color
        bing-mobile
        @click="onApply"
      >
        申請
      </lk-button>
    </view>
  </view>
</template>

<script>
import formGroup from "@/components/custom/form-group";
import {
  validEmpty,
  validUsername,
  validMobile,
  validEmail,
  validCard
} from "@/common/utils/validator";
import {
  GET_SHOPAPPLYSTATE,
  APPLY_SHOP,
  GET_SHOPAPPLYCUSTOMFORM
} from "@/common/interface/shop";
import individualInfoFormGroup from "../component/apply/individual-info-form-group";
import companyInfoFormGroup from "../component/apply/company-info-form-group";
import shopInfoFormGroup from "../component/apply/shop-info-form-group";
import identityInfoFormGroup from "../component/apply/identity-info-form-group";
export default {
  name: "packages-shop-business-apply",
  data() {
    return {
      form: {
        apply_type: 1,
        referee_uid:''
      },
      formList: [],
      isLoading: false
    };
  },
  watch: {
    "form.apply_type"(e) {
      if (e == 1) {
        delete this.form.company_name;
        delete this.form.company_type;
        delete this.form.company_phone;
        delete this.form.company_employee_count;
        delete this.form.company_registered_capital;
        delete this.form.business_licence_number;
        delete this.form.business_sphere;
        delete this.form.business_licence_number_electronic;
      }
    }
  },
  onLoad(query) {
    this.form.referee_uid=query.referee_uid?query.referee_uid:''
    GET_SHOPAPPLYSTATE()
      .then(({ data }) => {
        if (data.status == "apply" || data.status == "refuse_apply") {
          this.getData();
        } else {
          this.$Navigate.replace("/packages/shop/business/index?referee_uid="+this.referee_uid);
        }
      })
      .catch(() => {});
  },
  methods: {
    getData() {
      GET_SHOPAPPLYCUSTOMFORM()
        .then(({ data }) => {
          this.formList =
            data.custom_form && data.custom_form.length ? data.custom_form : [];
        })
        .catch(() => {});
    },
    onApply() {
      let form = this.form;
      const form_data = this.$refs["formGroup"]
        ? this.$refs["formGroup"].getFormData()
        : "";
      if (this.formList.length) {
        if (!form_data) return false;
        delete form.apply_type;
        form.post_data = JSON.stringify(form_data);
        form = Object.assign({ ...form }, { ...this.$refs["shop"].form });
      } else {
        for (const key in this.$refs) {
          const item = this.$refs[key];
          if (item) {
            form = {
              ...form,
              ...item.form
            };
          }
        }
        if (
          !validUsername(form.contacts_name, "請輸入聯係人姓名！") ||
          !validMobile(form.contacts_phone) ||
          !validEmail(form.contacts_email) ||
          !validEmpty(form.company_province_id, "請選擇地區！") ||
          !validEmpty(form.company_address_detail, "請輸入詳細地址！")
        ) {
          return false;
        }
        if (form.apply_type == 2) {
          if (
            !validUsername(form.company_name, "請輸入公司名稱！") ||
            !validEmpty(form.company_type, "請選擇公司類型!") ||
            !validEmpty(form.company_phone, "請輸入公司電話!") ||
            !validEmpty(form.company_employee_count, "請輸入員工人數!") ||
            !validEmpty(form.company_registered_capital, "請輸入注冊資金!") ||
            !validEmpty(form.business_licence_number, "請輸入營業執照號!") ||
            !validEmpty(form.business_sphere, "請輸入經營範圍!") ||
            !validEmpty(
              form.business_licence_number_electronic,
              "請上傳營業執照!"
            )
          ) {
            return false;
          }
        }
        if (
          !validCard(form.contacts_card_no) ||
          !validEmpty(form.contacts_card_electronic_1, "請上傳身份證照！") ||
          !validEmpty(form.contacts_card_electronic_2, "請上傳身份證正照！") ||
          !validEmpty(form.contacts_card_electronic_3, "請上傳身份證反照！")
        ) {
          return false;
        }
      }
      if (
        !validEmpty(form.shop_name, "請輸入店鋪名稱！") ||
        !validEmpty(form.shop_group_id, "請選擇店鋪類型！")
      ) {
        return false;
      }
      // return console.log(form);
      this.isLoading = true;
      APPLY_SHOP(form)
        .then(({ message }) => {
          this.$Navigate.replace("/packages/shop/business/index?referee_uid="+this.referee_uid).then(() => {
            this.$Prompt.toast({ title: "提交成功", icon: "success" });
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    formGroup,
    individualInfoFormGroup,
    companyInfoFormGroup,
    identityInfoFormGroup,
    shopInfoFormGroup
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
</style>
