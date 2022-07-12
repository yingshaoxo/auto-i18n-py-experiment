<template>
  <view class="pages">
    <!-- <lk-cell title="地址類型" field v-if="showType">
      <lk-radio-group
        v-model="info.type"
        :active-color="theme.color"
        @change="onTypeChange"
      >
        <lk-radio :name="0">
          <text>國內</text>
        </lk-radio>
        <lk-radio :name="1">
          <text>國際</text>
        </lk-radio>
      </lk-radio-group>
    </lk-cell> -->
    <!-- <view v-show="!info.type">
      <lk-field v-model="info.consigner" label="姓名" placeholder="請輸入姓名" required />
      <lk-field v-model="info.mobile" type="number" label="手機號" placeholder="请输入手機號" required />
      <lk-cell-picker-group label="所在地" placeholder="請選擇地區" mode="region" required :area-code="area_code"
        :area-value="areaValue" @confirm="areaConfirm" />
      <lk-field v-model="info.address" type="textarea" label="詳細地址" placeholder="请输入詳細地址" required />
      <lk-field v-model="info.zip_code" label="郵政編碼" placeholder="请输入郵政編碼" />
      <lk-cell center title="設置默認收貨地址">
        <switch :checked="!!info.is_default" slot="rightIcon" @change="info.is_default = !info.is_default" />
      </lk-cell>
    </view> -->
    <view>
      <lk-field v-model="info.consigner" label="姓名" placeholder="請輸入姓名" required />
      <lk-field v-model="info.mobile" type="number" label="聯繫方式" placeholder="请输入手機號" required />
      <lk-cell-picker-group v-model="country_id" label="配送國家" required placeholder="請選擇國家" :loading="pickerLoading"
        :columns="countryList" @confirm="onConfirmCountry" />
      <lk-field v-model="info.address" type="textarea" label="詳細地址" placeholder="请输入詳細地址" required />
      <lk-cell center title="設置默認收貨地址">
        <switch :checked="!!info.is_default" slot="rightIcon" @change="info.is_default = !info.is_default" />
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
  GET_ADDRESSDETAIL,
  SAVE_ADDRESS,
  GET_COUNTRYLIST
} from "@/common/interface/member";
import {
  GET_AREACODE
} from "@/common/interface/config";
import { validMobile } from "@/common/utils/validator";
import { mapState } from "vuex";
export default {
  name: "packages-member-address-list",
  data () {
    return {
      address_id: "",
      areaValue: "",
      isLoading: false,
      info: {
        id: 0,
        type: 1, // 國內1，國際2
        consigner: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        address: "",
        is_default: 0,
        area_code: "",
        zip_code: "",
        country_id: ""
      },
      area_code: "",
      country_id: -1,

      pickerLoading: false,
      countryList: []
    };
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    showType () {
      return !!this.addons.abroadreceivegoods;
    }
  },
  onLoad (query) {
    this.address_id = query.address_id || "";
    this.onbackevent = query.onbackevent || "";
    // this.address_id && this.getDateilInfo();
    this.getCountryList();
  },
  methods: {
    getDateilInfo () {
      GET_ADDRESSDETAIL({ id: this.address_id })
        .then(({ data }) => {
          data.type = data.type || 0;
          this.info = data;
          this.area_code = [
            data.province || 0,
            data.city || 0,
            data.district || 0
          ].join(",");
          if (data.country_id) {
            this.country_id = data.country_id;
          }
          this.areaValue = [
            data.province_name,
            data.city_name,
            data.district_name
          ].join("/");
        })
        .catch(() => { });
    },
    // onTypeChange (e) {
    //   if (e == 1 && !this.countryList.length) {
    //     this.getCountryList();
    //   }
    // },
    onConfirmCountry (e) {
      const item = this.countryList[e];
      this.info.country_id = item.code_id;
    },
    getCountryList () {

      GET_AREACODE().then(({ data }) => {
        let list = data || [];
        list.forEach(e => {
          e.name = e.country;
        });
        this.countryList = list;
      });


    },
    areaConfirm (data) {
      this.areaValue = `${data.item[0].label}/${data.item[1].label}/${data.item[2].label}`;
      this.info.area_code = data.code;
      this.info.province = data.item[0].id;
      this.info.city = data.item[1].id;
      this.info.district = data.item[2].id;
    },
    validForm () {
      if (!this.info.consigner) {
        this.$Prompt.toast("請輸入姓名");
        return false;
      }
      // if (this.info.type == 0) {
      //   if (!validMobile(this.info.mobile)) {
      //     return false;
      //   }
      //   if (!this.info.area_code) {
      //     this.$Prompt.toast("請選擇地區");
      //     return false;
      //   }
      // }
      // if (this.info.type == 1) {
      if (!this.info.mobile) {
        this.$Prompt.toast("请输入手機號");
        return false;
      }
      if (!this.info.country_id) {
        this.$Prompt.toast("請選擇國家");
        return false;
      }
      // }
      if (!this.info.address) {
        this.$Prompt.toast("请输入詳細地址");
        return false;
      }
      return true;
    },
    onSave () {
      if (!this.validForm()) {
        return;
      }
      // return console.log(this.info);
      this.isLoading = true;
      SAVE_ADDRESS({ ...this.info, is_default: this.info.is_default ? 1 : 0 })
        .then(res => {
          this.$Navigate.back();
          this.isLoading = false;
          if (this.onbackevent) {
            uni.$emit(this.onbackevent, true);
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
