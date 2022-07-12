<template>
  <view class="credential-group">
    <view class="image-box">
      <view class="image">
        <image :src="image" mode="widthFix" />
      </view>
      <view class="tips">(長按圖片保存證書分享)</view>
    </view>
    <view class="cell-group">
      <view class="cell-item lk-hairline--bottom">
        <view class="title">{{ codeText }}</view>
        <lk-button
          round
          block
          type="danger"
          :color="theme.gradient"
          @click="onCopy"
        >
          復制證書編號
        </lk-button>
      </view>
    </view>
    <view class="cell-group">
      <view class="cell-item">
        <view>證書小提示：</view>
        <view>{{ tips }}</view>
      </view>
    </view>
    <lk-popup
      v-model="show"
      round
      prevent-touchmove
      :mask-close="false"
      title="請完善微信號"
    >
      <view class="content">
        <view class="field-group">
          <lk-field
            v-model="wchatName"
            label="微信號"
            type="text"
            placeholder="请输入您的微信號"
            autofocus
            clearable
          />
          <view class="tips">微信號保存后无法更改，請謹慎填寫</view>
        </view>
        <view class="btn-group">
          <lk-button class="btn" block square plain @click="cancel">
            取消
          </lk-button>
          <lk-button class="btn" block square theme-color @click="confirm">
            確定
          </lk-button>
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import $System from "@/api/system";
import focusout from "@/mixins/focusout";
import { GET_USERWECHAT, GET_CREDENTIAL } from "@/common/interface/credential";
let btnFlag = true;
export default {
  data() {
    return {
      show: false,
      wchatName: "",
      image: "",
      code: ""
    };
  },
  mixins: [focusout],
  props: {
    /**
     * 證書類型 1-分銷中心 2-分紅中心 3-微商中心 4-微店
     */
    type: {
      type: [String, Number],
      required: true
    },
    /**
     * 多角色類型 1-團隊隊長 2-區域分紅 3-全球股東
     */
    roleType: [String, Number],
    tips: {
      type: String,
      default:
        "授權證書用於展示身份，會員可掃碼證書上面的二維碼查看證書是否真偽。"
    }
  },
  computed: {
    codeText() {
      return "證書編號 " + this.code;
    }
  },
  created() {
    this.getUserWechat();
  },
  methods: {
    getUserWechat() {
      GET_USERWECHAT({}, { loadingText: "查詢證書中" }).then(
        ({ code, wchat_name }) => {
          if (code === 0) {
            this.show = true;
            return false;
          }
          this.getCredential(wchat_name);
        }
      );
    },
    getCredential(name) {
      return new Promise((resolve, reject) => {
        let params = {
          type: this.type,
          wchat_name: name
        };
        if (this.roleType) {
          params.role_type = this.roleType;
        }
        GET_CREDENTIAL(params, { loadingText: "生成證書中" })
          .then(({ data }) => {
            if (data.cred_no) {
              this.image = data.img_path;
              this.code = data.cred_no;
              resolve();
            } else {
              this.$Prompt.toast("生成證書出錯");
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    cancel() {
      this.$Navigate.back();
    },
    confirm() {
      if (!this.wchatName) {
        return this.$Prompt.toast("请输入您的微信號");
      }
      if (!btnFlag) {
        return false;
      }
      btnFlag = false;
      this.getCredential(this.wchatName)
        .then(() => {
          btnFlag = true;
          this.show = false;
        })
        .catch(() => {
          btnFlag = true;
        });
    },
    onCopy() {
      $System.setClipboardData(this.code);
    }
  }
};
</script>

<style lang="scss" scoped>
.image-box {
  position: relative;
  background: #ffffff;
}
.image {
  position: relative;
  width: 100%;
  min-height: 100vw;
  image {
    display: flex;
    width: 100%;
    height: 100%;
  }
}
.tips {
  text-align: center;
  padding: $cell-padding;
  font-size: $font-size-sm;
  color: $text-light;
}
.cell-group {
  margin: 20rpx 0;
}
.cell-item {
  padding: $cell-padding;
  background: #ffffff;
  line-height: 48rpx;
  .title {
    color: $red;
    text-align: center;
    font-weight: 800;
    padding-bottom: 20rpx;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
}
.content {
  height: 280rpx;
  position: relative;
}
.btn-group {
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  .btn {
    flex: 1;
  }
  .confirm-color {
    color: $red;
  }
}
</style>
