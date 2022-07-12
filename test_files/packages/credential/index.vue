<template>
  <view class="pages">
    <view class="banner">
      <image :src="banner.src" mode="widthFix" />
    </view>
    <view class="cell-group">
      <view class="field-title">授權證書查詢</view>
      <view class="field-box">
        <lk-field
          v-model="cred_no"
          type="text"
          placeholder="請輸入證書編號"
          clearable
          background="#f5f9ff"
        />
      </view>
      <view class="foot-btn-group">
        <lk-button
          block
          round
          type="danger"
          :color="theme.gradient"
          @click="onQuery"
        >
          查詢
        </lk-button>
      </view>
    </view>
    <view class="cell-group">
      <view class="tips">
        <view class="item">
          <view class="title">证书查詢方法：</view>
          <view>1.輸入證書編號，点击查詢；</view>
        </view>
        <view class="item">
          <view class="title">查詢结果说明：</view>
          <view>
            1.如果該證書編號正確，且授權信息與證書信息一致，則表示授權證書真實
          </view>
          <view>
            2.如果該證書編號正確，但授權信息與證書信息不一致，則表示授權證書偽造
          </view>
          <view>3.如果證書編號錯誤，則說明該證書未經官方授權。</view>
        </view>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_SEARCHCREDENTIAL } from "@/common/interface/credential";
export default {
  name: "packages-credential-index",
  data() {
    return {
      banner: {
        src: ""
      },
      cred_no: ""
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_SEARCHCREDENTIAL().then(({ data }) => {
        this.banner.src = data.banner_list.img_path;
        this.banner.link = data.banner_list.img_link;
      });
    },
    onQuery() {
      if (!this.cred_no) {
        return this.$Prompt.toast("請輸入證書編號！");
      }
      this.$Navigate.push({
        path: "/packages/credential/result",
        query: {
          cred_no: this.cred_no
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
.cell-group {
  margin: 20rpx 0;
  background: #ffffff;
}
.field-box{
  margin: 0 30rpx;
  border-radius: 8rpx;
  overflow: hidden;
}
.field-title {
  padding: $cell-padding;
  text-align: center;
  font-size: $font-size-lg;
}
.tips {
  padding: $cell-padding;
  line-height: 1.6;
  color: $text-light;
  font-size: $font-size-sm;
  .item {
    margin-bottom: 10rpx;
  }
  .title {
    font-size: $font-size;
  }
}
</style>
