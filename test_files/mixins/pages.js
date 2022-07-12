import share from "./share";
import { mapGetters } from "vuex";
import { yuan } from "@/common/utils";
import { isTabbarRoute } from "@/common/utils/navigate";
// #ifdef H5
import $Store from "@/store";
import { formatURLQuery, encodeUriParams } from "@/common/utils";
// #endif

export default {
  data() {
    return {
      routeQuery: {}
    };
  },
  computed: {
    ...mapGetters(["token", "theme"])
  },
  filters: {
    yuan(value) {
      return yuan(value);
    }
  },
  mixins: [share],
  async onLoad(options) {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];

    this.routeQuery = options;
    if (options.scene && options.scene.indexOf("_") == -1) {
      // 小程序太陽碼進入場景，需要解析參數
      this.routeQuery = await this.$store.dispatch("getMpCodeScene", {
        scene: options.scene
      });
    }

    this.callLoad(this.routeQuery);

    this.$store.commit("setCurrentRoute", {
      path: page.route,
      query: this.routeQuery
    });

    // 獲取場景參數並儲存
    const { extend_code, poster_id, poster_type } = this.routeQuery;
    if (extend_code) {
      this.$store.commit("setSceneCode", extend_code);
      // 場景海報參數
      if (poster_id && poster_type) {
        this.$store.commit("setSharePosterParams", {
          poster_id,
          poster_type
        });
      }
      // 登錄狀態下成為下線
      this.token && this.$store.dispatch("extendSub");
    }

    if (
      this.$store.getters.route.name &&
      !this.$store.state.isWeixin &&
      !this.token &&
      !this.$store.getters.route.meta.noLogin
    ) {
      // 非微信環境下，未登錄情況跳轉到登錄頁面
      this.$store.commit(
        "setLoginBeforePath",
        this.$store.getters.route.fullPath
      );
      return uni.redirectTo({ url: "/packages/login/index" });
    }
  },
  onShow() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    if (page) {
      //第一次進入可能會獲取不到page
      this.$store.commit("setCurrentRoute", {
        path: page.route,
        query: this.routeQuery
      });

      // #ifdef MP-WEIXIN
      // tabbar 頁面需設置 icon
      if (isTabbarRoute("/" + page.route)) {
        this.$store.commit("setTabbarStyle");
        this.$store.commit("setTabbarCartBage");
      }
      // #endif
    }
  },
  onHide() {
    this.$store.commit("clearRequestList");
  },
  onUnload() {
    this.$store.commit("clearRequestList");
  },
  // #ifdef H5
  beforeRouteEnter(to, from, next) {
    if (!$Store.getters.token && $Store.state.isWeixin) {
      const query = to.query;
      $Store
        .dispatch("getConfig", {
          update: true,
          debug: query.debug
        })
        .then(config => {
          if (!config.wap_status) {
            if (to.path == "/packages/mall/notice") {
              next();
            } else {
              // 商城未開啟跳轉商城公告提示
              uni.reLaunch({
                url: "/packages/mall/notice?type=unopened&tip=商城已關閉"
              });
            }
            return false;
          }
          if (to.path == "/packages/mall/notice" && query.type == "unopened") {
            uni.reLaunch({
              url: "/pages/mall/index"
            });
            return false;
          }
          if (!config.is_wchat) {
            // 未對接公眾號跳轉商城公告
            if (to.path == "/packages/mall/notice") {
              next();
            } else {
              uni.reLaunch({ url: "/packages/mall/notice?type=nowechat" });
            }
            return false;
          }

          if (query.code && query.state === "wchat") {
            // 微信授權成功回調攜帶參數
            $Store
              .dispatch("authLogin", {
                type: "WCHAT",
                code: query.code,
                method: "GET"
              })
              .then(() => {
                next();
              });
          } else if (query.user_token && query.state == "qq") {
            // qq授權獲取user_token
            $Store.commit("setUserInfo", {
              user_token: query.user_token,
              have_mobile: true
            });
            next();
          } else {
            if (config.is_wchat && process.env.NODE_ENV != "development") {
              const fullPath =
                to.path + formatURLQuery(`?${encodeUriParams(query)}`);
              // 微信環境自動授權登錄(開發環境不自動授權登錄)
              $Store.commit("setLoginBeforePath", fullPath);
              // 獲取場景參數並儲存
              const { extend_code, poster_id, poster_type } = query;
              if (extend_code) {
                $Store.commit("setSceneCode", extend_code);
                // 場景海報參數
                if (poster_id && poster_type) {
                  $Store.commit("setSharePosterParams", {
                    poster_id,
                    poster_type
                  });
                }
              }
              $Store.dispatch("authLogin", {
                type: "WCHAT",
                redirect_url: fullPath
              });
              // 這裡沒有next()  是因為授權登錄 會跳轉到微信授權頁面
            } else {
              next();
            }
          }

          if (config.vconsole) {
            // vconsole 是 在手機端調試使用，接口返回vconsole為true 即可
            const vconsole = require("../static/h5/vconsole.min");
            new vconsole();
            console.info("version", $Store.state.version);
          }
        })
        .catch(err => {
          const { code, message } = err;
          if (
            code == -10001 &&
            to.path != "/packages/mall/notice" &&
            query.type != "unopened"
          ) {
            uni.reLaunch({
              url: "/packages/mall/notice?type=unopened&tip=" + message
            });
          } else {
            next();
          }
        });
    } else {
      next();
    }
  },
  // #endif
  methods: {
    // load回調，可以在每個頁面調用callLoad
    callLoad(query) { }
  }
};
