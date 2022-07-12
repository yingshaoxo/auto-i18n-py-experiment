<template>
  <view>
    <view class="cell-group">
      <view class="cell-group-title">基本信息</view>
      <lk-field label="聯係人" required v-model="form.user_name" placeholder="必填，请输入聯係人" />
      <lk-field label="聯繫電話" required v-model="form.mobile" type="number" placeholder="必填，请输入聯繫電話" />
      <lk-field label="電子郵箱" required v-model="form.email" type="text" placeholder="必填，请输入電子郵箱" />
      <lk-field label="詳細地址" required v-model="form.address" placeholder="必填，请输入詳細地址" />
    </view>
    <view class="cell-group">
      <view class="cell-group-title">身份證明（上傳身份證/護照）</view>
      <cell-upload-image v-model="form.img" :max="5" label="手持身份證照" :example-img="exampleImgs[3]" />
    </view>
    <view class="cell-group">
      <view class="cell-group-title">店鋪資料</view>
      <cell-upload-image v-model="form.logo" label="logo" />
      <lk-field label="店鋪名稱" required v-model="form.shop_name" placeholder="必填，请输入店鋪名稱" />
      <lk-field label="推廣碼" v-model="form.referee_code" type="number" placeholder="请输入推廣碼" />
    </view>
    <view class="foot-btn-group">
      <lk-button round block type="danger" theme-color bing-mobile @click="onApply" :disabled="isLoading">
        申請
      </lk-button>
    </view>
  </view>
</template>
<script>
import cellUploadImage from "./component/apply/cell-upload-image";
import {
  validEmpty,
  validUsername,
  validMobile,
  validEmail,
} from "@/common/utils/validator";
import {
  APPAYWXSHOP
} from "@/common/interface/smallshop";
import { mapGetters } from "vuex";
export default {
  name: 'packages-smallshop-apply',
  data () {
    return {
      form: {
        user_name: "",
        mobile: "",
        email: "",
        address: "",
        logo: "",
        shop_name: "",
        referee_code: "",
        img: "",
      },
      isLoading: false
    };
  },
  components: {
    cellUploadImage
  },
  props: {},
  computed: {
    ...mapGetters(["static"]),
    exampleImgs () {
      let base = this.static.baseImgPath;
      // console.log(base + "identity-img-4.png")
      // debugger
      return [
        base + "identity-img-1.png",
        base + "identity-img-2.png",
        base + "identity-img-3.png",
        base + "identity-img-4.png"
      ];
    }
  },
  onLoad (query) {
    if (query.extend_code) this.form.referee_code = query.extend_code;
  },
  methods: {
    onApply () {
      let form = this.form;
      if (
        !validUsername(form.user_name, "请输入聯係人姓名！") ||
        !validEmpty(form.mobile) ||
        !validEmail(form.email) ||
        !validEmpty(form.address, "请输入詳細地址！") ||
        !validEmpty(form.logo, "請上傳店鋪logo！") ||
        !validEmpty(form.shop_name, "请输入店鋪名稱！") ||
        !validEmpty(form.img, "请上傳身份證")
      ) {
        return false;
      }
      this.isLoading = true;
      APPAYWXSHOP(form).then(res => {
        this.$Prompt.toast({ title: "提交成功", icon: "success" });
        setTimeout(() => {
          this.$Navigate.replace("/pages/member/index");
        }, 500);
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      });
    }
  },
}
</script>
<style scoped lang='scss'>
.cell-group-title {
  color: $text-gray;
  background: #fff;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>