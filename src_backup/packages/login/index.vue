<template>
  <view class="pages">
    <!-- #ifndef MP-WEIXIN -->
    <view class="banner">
      <image
        :src="bannerInfo.src"
        mode="widthFix"
        @click="toLink(bannerInfo.link)"
      />
    </view>
    <lk-tabs
      :nav-per-view="config.mobile_verification ? 2 : 1"
      :active-color="theme.color"
      :line-color="theme.color"
      :line="false"
      @change="onTabChange"
    >
      <lk-tab title="賬號密碼登錄">
        <view class="account-login">
          <lk-field
            label="賬號"
            v-model="form.account"
            type="text"
            placeholder="請輸入手機/用戶名"
          />
          <lk-field
            label="密碼"
            v-model="form.password"
            type="password"
            placeholder="请输入密碼"
          />
          <lk-field
            label="圖片驗證碼"
            v-model="form.captcha_code"
            type="number"
            maxlength="4"
            placeholder="请输入圖片驗證碼"
            v-if="show_captcha_code"
          >
            <view class="field-msg-code" slot="button" @click="getImgCode">
              <image :src="captcha_src" mode="widthFix" />
            </view>
          </lk-field>
        </view>
      </lk-tab>
      <lk-tab title="短信驗證碼登錄" v-if="config.mobile_verification">
        <view class="msg-login">
          <lk-field-areacode
            v-model="form.account"
            @get-areacode="getAreacode"
          />
          <lk-field-local-puzzle
            :display="show_puzzle"
            @onOK="
              () => {
                show_puzzle = false;
              }
            "
          ></lk-field-local-puzzle>
          <lk-field-msgcode
            v-model="form.verification_code"
            :mobile="form.account"
            :areacode="form.country_code"
            type="login"
            :disabled="show_puzzle"
            @send-success="
              () => {
                do_something_when_error();
              }
            "
          />
          <!-- <lk-field
            label="圖片驗證碼"
            v-model="form.captcha_code"
            type="number"
            maxlength="4"
            placeholder="请输入圖片驗證碼"
            v-if="show_captcha_code"
          >
            <view class="field-msg-code" slot="button" @click="getImgCode">
              <image :src="captcha_src" mode="widthFix" />
            </view>
          </lk-field> -->
        </view>
      </lk-tab>
    </lk-tabs>
    <view class="cell-link">
      <text
        class="register-link text-link"
        @click="toLink('/packages/login/register')"
      >
        快速注冊>
      </text>
      <text class="forget-link" @click="toLink('/packages/login/forget')">
        忘记密碼?
      </text>
    </view>
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        theme-color
        :loading="isLoading"
        @click="onLogin"
      >
        登錄
      </lk-button>
    </view>
    <view class="other-login" v-if="showOtherLogin">
      <view class="divider">
        <text>其他登錄方式</text>
      </view>
      <view class="other-img">
        <!-- <image :src="otherLoginImage.qq" /> -->
        <image :src="otherLoginImage.wx" @click="onOtherLogin('WCHAT')" />
      </view>
    </view>
    <!--  #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <view class="mp-login">
      <view class="logo">
        <image :src="mallInfo.logo" mode="aspectFill"></image>
      </view>
      <view class="text">
        <view class="name">歡迎來到{{ mallInfo.name }}</view>
        <view class="title">
          為提供優質的服務，{{ mallInfo.name }}需要獲取以下信息
        </view>
        <view class="info">· 你的公開信息(昵稱、頭像等）</view>
      </view>
      <view class="foot-btn-group">
        <lk-button
          v-if="canIUseGetUserProfile"
          block
          round
          theme-color
          :loading="isLoading"
          @click="getUserProfile"
        >
          微信授权登錄
        </lk-button>
        <lk-button
          v-else
          block
          round
          theme-color
          open-type="getUserInfo"
          @getuserinfo="onGetuserinfo"
        >
          微信授权登錄
        </lk-button>
      </view>
      <view class="home-link">
        <text class="text-link" @click="toLink('/pages/mall/index')">
          返回首頁
        </text>
      </view>
    </view>
    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import $Plugins from "@/api/plugins";
import { GET_IMGCODE } from "@/common/interface/login";
import {
  validMobile,
  validUsername,
  validMsgcode,
  validImgcode,
  validPassword,
} from "@/common/utils/validator";
import { isWeixin } from "@/common/utils";

export default {
  name: "packages-login-index",
  data() {
    let canIUseGetUserProfile = false;
    // #ifdef MP-WEIXIN
    if (wx.getUserProfile) {
      canIUseGetUserProfile = true;
    }
    // #endif
    return {
      mincode: "",
      formType: "account", // account賬號登錄/ msg短信登錄
      form: {
        account: "",
        captcha_code: "",
        country_code: "",
      },
      captcha_src: "",
      show_captcha_code: false,
      isLoading: false,
      canIUseGetUserProfile: canIUseGetUserProfile,

      error_time: 0,
      show_puzzle: false,
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config,
      mallInfo: ({ config }) => config.mallInfo,
      loginBeforePath: (state) => state.loginBeforePath,
    }),
    ...mapGetters(["static"]),
    showOtherLogin() {
      // #ifdef H5
      return this.config.wechat_login && isWeixin();
      // #endif

      // #ifdef APP-PLUS
      return this.config.wechat_login;
      // #endif
    },
    otherLoginImage() {
      return {
        qq: this.static.baseImgPath + "qq-login-icon.png",
        wx: this.static.baseImgPath + "wx-login-icon.png",
      };
    },
    bannerInfo() {
      return {
        src:
          this.config.wap_login_adv ||
          this.static.baseImgPath + "login-head-default-01.png",
        link: this.config.wap_login_jump,
      };
    },
  },
  onLoad() {
    if (this.token) {
      return uni.switchTab({ url: "/pages/mall/index" });
    }
  },
  methods: {
    ...mapActions(["login", "authLogin", "getMemberInfo"]),
    onTabChange(index) {
      this.formType = index == 1 ? "msg" : "account";
      this.form = {
        account: "",
        captcha_code: "",
      };
    },
    toLink(link) {
      if (link) {
        this.$Navigate.push(link);
      }
    },
    //获取圖片驗證碼
    getImgCode() {
      GET_IMGCODE().then(({ data }) => {
        this.captcha_src = data.captcha_src + "?" + new Date().getTime();
      });
    },
    getAreacode(code) {
      this.form.account = "";
      this.form.country_code = code;
    },
    // 驗證輸入
    vaildForm() {
      let form = this.form;
      if (this.formType === "account") {
        if (
          !validUsername(form.account) ||
          !validPassword(form.password) ||
          (this.show_captcha_code ? !validImgcode(form.captcha_code) : false) //判断并验证圖片驗證碼
        ) {
          return false;
        }
      }
      if (this.formType === "msg") {
        if (
          !validMobile(form.account, this.form.country_code) ||
          !validMsgcode(form.verification_code) ||
          (this.show_captcha_code ? !validImgcode(form.captcha_code) : false) //判断并验证圖片驗證碼
        ) {
          return false;
        }
      }
      return form;
    },
    do_something_when_error() {
      this.error_time += 1;
      if (this.error_time >= 5) {
        this.show_puzzle = true;
        this.error_time = 0;
      }
    },
    // 登錄
    onLogin() {
      // if (this.show_puzzle) {
      //   this.$Prompt.toast("請回答問題");
      //   return;
      // }

      // return console.log(this.vaildForm());
      const form = this.vaildForm();
      if (form) {
        this.isLoading = true;
        this.login(form)
          .then(({ code, data, message }) => {
            if (code === 0) {
              this.show_captcha_code = true;
              this.getImgCode();
              this.$Prompt.toast(message);
              this.isLoading = false;
            } else {
              this.$Prompt
                .toast({ icon: "success", title: message })
                .then(() => {
                  this.$Navigate.replace(this.loginBeforePath);
                });
            }
          })
          .catch(() => {
            this.isLoading = false;
            // 登錄失败重新获取圖片驗證碼
            if (this.show_captcha_code) {
              this.getImgCode();
            }
          });
      }
    },
    //第三方登錄
    onOtherLogin(action) {
      // #ifdef H5
      let params = {
        type: action,
        redirect_url: this.loginBeforePath,
      };
      this.authLogin(params);
      // #endif

      // #ifdef APP-PLUS
      const actionObj = {
        WCHAT: "weixin",
        QQLOGIN: "qq",
      };
      let provider = actionObj[action];
      let params = {
        type: action,
      };
      $Plugins.authLogin(provider, params).then((res) => {
        this.getMemberInfo({ update: true }).then(() => {
          this.$Navigate.replace(this.loginBeforePath);
        });
      });
      // #endif
    },
    checkSession() {
      return new Promise((resolve, reject) => {
        // uni.checkSession({
        //   success: () => {
        //     //session_key 未過期，並且在本生命週期一直有效
        //     resolve({ code: "" });
        //   },
        //   fail: () => {

        // session_key 已經失效，需要重新执行登錄流程
        uni.login({
          provider: "weixin",
          complete(res) {
            if (!res.code) {
              this.$Prompt.modal({
                content: "微信登錄失败",
                showCancel: false,
              });
            }
            resolve({ code: res.code });
          },
        });
        // }
        // });
      });
    },
    wxGetUserProfile() {
      return new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: this.config.mp_getuserinfo_desc,
          success: (res) => {
            resolve(res);
          },
          // 失敗回調
          fail: (err) => {
            console.log(err, "授權失敗");
            this.$Prompt.modal({ content: "授權失敗", showCancel: false });
          },
        });
      });
    },
    onGetuserinfo({ detail }) {
      console.log(detail);
      if (detail.userInfo) {
        this.checkSession().then(({ code }) => {
          let params = {
            type: "MP",
            iv: detail.iv,
            encrypted_data: detail.encryptedData,
          };
          if (code) {
            params.code = code;
          }
          this.authLogin(params)
            .then(({ message }) => {
              this.$Prompt
                .toast({ icon: "success", title: message })
                .then(() => {
                  this.$Navigate.replace(this.loginBeforePath);
                  console.log(this.loginBeforePath);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        console.log("拒接授權");
        this.$Prompt.modal({ content: "您取消了授權", showCancel: false });
      }
    },
    // 獲取小程序用戶資料
    getUserProfile() {
      const $this = this;
      this.isLoading = true;
      let p1 = this.checkSession();
      let p2 = this.wxGetUserProfile();
      Promise.all([p1, p2])
        .then((res) => {
          console.log(res);
          let code = res[0].code;
          let iv = res[1].iv;
          let encrypted_data = res[1].encryptedData;
          let params = {
            type: "MP",
            iv,
            encrypted_data,
            code,
          };
          this.authLogin(params)
            .then(({ message }) => {
              this.$Prompt
                .toast({ icon: "success", title: message })
                .then(() => {
                  $this.$Navigate.replaceAll($this.loginBeforePath);
                  $this.isLoading = false;
                });
            })
            .catch((error) => {
              console.log(error);
              this.isLoading = false;
            });
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/* #ifndef MP-WEIXIN */
page {
  background: #fff;
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
.field-msg-code {
  width: 200rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  image {
    width: 100%;
    height: 100%;
  }
}
.other-img {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  image {
    width: 118rpx;
    height: 118rpx;
    margin: 40rpx 80rpx;
  }
}
.cell-link {
  display: flex;
  justify-content: space-between;
  padding: $cell-padding;
  background: #fff;
  .register-link {
  }
  .forget-link {
    color: $text-light;
  }
}
/* #endif */

/* #ifdef MP-WEIXIN */
.mp-login {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  background: #fff;
  .logo {
    display: flex;
    justify-content: center;
    image {
      width: 200rpx;
      height: 200rpx;
      border-radius: 100%;
      background-color: $image-background;
    }
  }
  .text {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    line-height: 48rpx;
    margin-top: 40rpx;
  }
  .name {
    font-size: $font-size-lg;
  }
  .title {
  }
  .info {
    font-size: $font-size-sm;
    color: $text-light;
    margin: 20rpx 0;
  }
  .home-link {
    margin: 20rpx 0;
    text-align: center;
  }
}
/* #endif */
</style>
