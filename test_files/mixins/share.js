/**
 * 用戶分享
 * 用於小程序、H5微信公眾號頁面分享
 *
 * 分享時的鍊接需要在鍊接後面拼接上推廣碼
 * 需要判斷當前頁面分享類型 shareType
 * ''       ==>   為空均表示分享首頁到'/pages/mall/index'
 * current  ==>   表示分享當前頁面
 * custom   ==>   表示自定義分享到任意頁面
 */

let flag = 1; // 第一次進來會執行兩次onShow，flag標識避免請求兩次

import { mapGetters, mapActions } from "vuex";

// #ifdef H5
import wxSdk from "@/common/utils/wx-sdk";
import { isWeixin } from "@/common/utils";
// #endif

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["token", "shareParams"]) // 分享參數
  },
  /**
   * 小程序平臺分享
   */
  onShareAppMessage(e) {
    // 用戶點擊右上角
    if (e.from == "menu") {
      // this.routeQuery  當前頁面路由參數
    } else if (e.from == "button") {
      // 按鈕分享
    }
    console.log(this.shareParams);
    return {
      title: this.shareParams.title,
      imageUrl: this.shareParams.imgUrl,
      path: this.shareParams.link
    };
  },
  /**
   * 小程序平臺分享朋友圈
   */
  onShareTimeline(e) {
    console.log(e);
    console.log(this.shareParams);
    return {
      title: this.shareParams.title,
      query: this.shareParams.query,
      imageUrl: this.shareParams.imgUrl
    };
  },
  onShow() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    if (page && !this.$noShowFlag) {
      this.$noShowFlag = true;
      this.getConfig().then(res => {
        const { addon } = this.$store.getters.route.meta;
        const { addons } = this.$store.state.config;
        const addonArr = typeof addon == "string" ? [addon] : addon || [];
        if (addon && !addonArr.some(e => !!addons[e])) {
          //未開啟相關應用
          return uni.reLaunch({
            url: "/packages/mall/notice?type=noaddon&addon=" + addon
          });
        }
        typeof this.configCall === "function" && this.configCall(res);
        if (this.token) {
          this.getMemberInfo().then(info => {
            typeof this.memberCall === "function" && this.memberCall(info);
            this.setWxShare();
          });
        } else {
          this.setWxShare();
        }
      });
    }
  },
  onUnload() {
    this.$noShowFlag = false;
    this.$store.commit("setShareParam", {
      //清空自定义分享參數
      desc: "",
      imgUrl: "",
      path: "",
      title: "",
      query: {}
    });
  },
  onHide() {
    this.$noShowFlag = false;
    this.$store.commit("setShareParam", {
      //清空自定义分享參數
      desc: "",
      imgUrl: "",
      path: "",
      title: "",
      query: {}
    });
  },
  methods: {
    ...mapActions(["getConfig", "getMemberInfo"]),
    // 微信分享方法
    setWxShare(opionts) {
      /**
       * 如 優先取傳入的參數，並儲存
       *  未傳入參數 取儲存的參數，空为没有设置自定义分享參數
       */
      let param = opionts || this.$customShareParam;
      if (param) {
        this.$customShareParam = param;
        this.$store.commit("setShareParam", param || {});
      }
      // console.log(this.shareParams);
      // #ifdef H5
      if (isWeixin()) {
        this.$nextTick(() => {
          wxSdk.wxShare(this.shareParams).then(() => {});
        });
      }
      // #endif
    }
  }
};
