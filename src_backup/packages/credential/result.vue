<template>
  <view class="pages">
    <view class="cell-group">
      <lk-cell title="證書編號" :value="info.cred_no" />
      <lk-cell title="證書名稱" :value="info.cred_name" />
      <lk-cell title="證書類型" :value="info.cred_type" />
      <lk-cell title="授權人" :value="info.mall_name" />
      <lk-cell title="被授權人昵称" :value="info.nickname" />
      <lk-cell title="被授權人微信号" :value="info.wchat_name" />
      <lk-cell title="被授權人手机号" :value="info.user_tel" />
      <lk-cell title="授權時間" :value="info.create_date" />
    </view>
    <view class="banner">
      <image :src="info.image_path" mode="widthFix" />
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_CREDENTIALRESULT } from "@/common/interface/credential";
export default {
  name: "packages-credential-result",
  data() {
    return {
      cred_no: "",
      info: {
        cred_no: "",
        cred_name: "",
        cred_type: "",
        mall_name: "",
        nickname: "",
        wchat_name: "",
        user_tel: "",
        create_date: ""
      }
    };
  },
  onLoad(query) {
    this.cred_no = query.cred_no || "";
    this.getData();
  },
  methods: {
    getData() {
      GET_CREDENTIALRESULT({ cred_no: this.cred_no })
        .then(({ data }) => {
          this.info = { ...data };
        })
        .catch(({ message }) => {
          this.$Prompt
            .modal({
              content: message || "未知錯誤信息",
              showCancel: false
            })
            .then(() => {
              this.$Navigate.replace("/packages/credential/index");
            });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin-bottom: 20rpx;
}
.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
