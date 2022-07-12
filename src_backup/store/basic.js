import routes from "@/router/routes";
import {
  platform,
  isWeixin,
  routePathToName,
  formatURLQuery,
  encodeUriParams,
  getUriParam
} from "@/common/utils";

import env from "@/config";

let envConfig = env[process.env.NODE_ENV];

const tabbarHeight = uni.upx2px(100);

let website_id = envConfig.WEBSITE_ID || 0;

// #ifdef H5
import $Storage from "@/api/storage";
if (getUriParam(location.search, "website_id")) {
  website_id = getUriParam(location.search, "website_id");
  $Storage.setSession("website_id", website_id);
} else {
  website_id = $Storage.getSession("website_id") || website_id;
}
// #endif

export default {
  state: {
    version: envConfig.VERSION,
    appName: envConfig.NAME, // 應用名稱
    authKey: envConfig.AUTH_KEY,
    domain:
      platform("H5") && process.env.NODE_ENV === "production"
        ? location.origin
        : envConfig.DOMAIN, // 域名
    subDomain:
      platform("H5") && process.env.NODE_ENV === "production"
        ? location.origin
        : envConfig.SUBDOMAIN, // 子域名、二級域名，獨立域名
    website_id: website_id,
    // #ifdef H5
    isWeixin: isWeixin(),
    // #endif
    // #ifndef H5
    isWeixin: false,
    // #endif
    loginBeforePath: "/pages/mall/index",
    currentRoute: { path: "pages/mall/index", query: {} },
    //自定義分享參數
    customShareParam: {
      desc: "",
      imgUrl: "",
      path: "",
      title: "",
      query: {}
    },
    // 微信小程序基本信息
    mpWxBaseInfo: {
      // #ifdef MP-WEIXIN
      ...__wxConfig.accountInfo
      // #endif
    },
    requestList: []
  },
  getters: {
    //接口請求基礎地址
    apiBaseUrl: state => {
      let baseUrl = state.domain + "/" + envConfig.BASE_API;
      // #ifdef H5
      baseUrl =
        process.env.NODE_ENV == "development"
          ? "/api"
          : "/" + envConfig.BASE_API;
      // #endif
      return baseUrl;
    },
    // 靜態資源路徑以及各種占位圖和各種出錯圖片合集
    static: state => {
      const baseImgPath = state.domain + "/public/app/images/";
      return {
        baseImgPath: baseImgPath,
        noAvatar: baseImgPath + "no-avatar.png",
        noGoods: baseImgPath + "no-goods.png",
        noShop: baseImgPath + "no-shop.png",
        noRectangle: baseImgPath + "no-rectangle.png",
        noSquare: baseImgPath + "no-square.png"
      };
    },
    windowBottom: (state, root) => {
      // #ifndef MP-WEIXIN
      return root.route.meta.isTabBar ? tabbarHeight : 0;
      // #endif
      // #ifdef MP-WEIXIN
      return 0;
      // #endif
    },
    // 當前路由信息
    route: (state, root, { config }) => {
      let urlArr = [state.domain, "wap"]; // wap為h5二級目錄
      const { path, query } = state.currentRoute;
      const obj = routes[routePathToName(path)] || {};
      const fullPath = obj.path + formatURLQuery(`?${encodeUriParams(query)}`);
      const origin = urlArr.join("/");
      urlArr.push(fullPath.substr(1));
      if (obj.meta) {
        obj.meta.isTabBar = config.tabbar.list.some(e => e.path === obj.path);
      }
      return {
        origin,
        url: urlArr.join("/"),
        path: obj.path,
        name: obj.name,
        query,
        encodeQuery: encodeUriParams(query),
        params: {},
        meta: { ...obj.meta },
        title: obj.title,
        fullPath
      };
    },
    // 當前頁面分享參數
    shareParams: (state, getters) => {
      const { route, extendCode, encodeUid } = getters;
      let urlArr = [state.domain, "wap"]; // wap為h5二級目錄
      let path = ""; // 分享类型為当前页路径，否則默認首頁 (注意：不帶/)
      let title = state.config.mall_name || "";
      let desc = "我剛剛發現了一個很不錯的商城，趕快來看看吧。";
      let imgUrl = state.config.logo || getters.static.noSquare; // 添加默認圖片，防止分享報錯
      let query = {}; //當前分享的參數
      const excludeKeys = [
        "extend_code",
        "scene",
        "poster_id",
        "poster_type",
        "user_token",
        "state",
        "code",
        "uid"
      ];
      //排除指定參數key
      for (const key in route.query) {
        if (!excludeKeys.some(e => e == key)) {
          query[key] = route.query[key];
        }
      }
      if (route.meta.shareType === "current") {
        path = route.meta.pagePath;
        title = route.title + " - " + title;
      } else {
        path = "pages/mall/index";
      }
      const custom = state.customShareParam; // 自定義的分享參數
      path = custom.path || path;
      desc = custom.desc || desc;
      title = custom.title || title;
      imgUrl = custom.imgUrl || imgUrl;
      query = Object.assign({ ...query }, { ...custom.query });
      urlArr.push(path);
      let url = urlArr.join("/");
      if (extendCode) {
        // 分享參數需帶上會員推廣碼
        query.extend_code = extendCode;
      }
      if (custom.shareUid && encodeUid) {
        // 自定義參數存在shareUid,表示需要攜帶用戶uid
        query.uid = encodeUid;
      }
      const URLQuery = formatURLQuery(`?${encodeUriParams(query)}`);
      const link = platform("MP") ? path + URLQuery : url + URLQuery; //小程序當前路徑(不帶/)，其他為h5/app是帶域名的路徑
      return {
        title,
        desc,
        imgUrl,
        link,
        pagePath: path,
        scene: query,
        query: encodeUriParams(query)
      };
    }
  },
  mutations: {
    // 設置第三方平臺數據
    setExtConfig(state, config = {}) {
      if (config.domain) {
        state.domain = config.domain;
        state.subDomain = config.domain_wap;
        state.website_id = config.website_id;
        state.appName = config.project_name || envConfig.NAME;
        state.authKey = config.auth_key || envConfig.AUTH_KEY;
      } else {
        state.domain = envConfig.DOMAIN;
        state.subDomain = envConfig.SUBDOMAIN;
        state.website_id = envConfig.WEBSITE_ID;
        state.appName = envConfig.NAME;
        state.authKey = envConfig.AUTH_KEY;
      }
      console.log(__wxConfig);
    },
    // 設置登錄之前的路徑
    setLoginBeforePath(state, path) {
      state.loginBeforePath = path;
    },
    // 设置當前路由信息
    setCurrentRoute(state, route = {}) {
      state.currentRoute = { ...route };
    },
    // 設置分享參數
    setShareParam(state, params = {}) {
      state.customShareParam = Object.assign({}, { ...params });
    },
    // 設置需要取消請求的列表
    setRequestList(state, cancel) {
      state.requestList.push({ cancel });
    },
    // 取消請求並清除列表
    clearRequestList(state) {
      state.requestList.forEach(e => {
        e.cancel.abort();
      });
      state.requestList = [];
    }
  },
  actions: {}
};
