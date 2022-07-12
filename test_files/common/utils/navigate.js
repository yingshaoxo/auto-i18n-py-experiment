import $Store from "@/store";
import $Prompt from "@/api/prompt";
import $Other from "@/api/other";
import routes from "@/router/routes";
import {
  isObject,
  formatURLQuery,
  encodeUriParams,
  routePathToName,
  isBrowser
} from "@/common/utils";
import { compPath } from "./comp-path";

/**
 * 導航跳轉方法名（判斷傳入的方法名是否符合跳轉）
 * @param {string} method 方法名
 * @param {string} path 路由
 * @returns 方法名
 */
function navMethod(method, path) {
  // #ifdef H5
  return isTabbarRoute(path)
    ? "reLaunch"
    : method == "switchTab"
    ? "redirectTo"
    : method;
  // #endif
  // #ifdef APP-PLUS
  return isTabbarRoute(path)
    ? "redirectTo"
    : method == "switchTab"
    ? "redirectTo"
    : method;
  // #endif
  // #ifdef MP-WEIXIN
  return isTabbarRoute(path)
    ? path.split("?")[0] == "/pages/goods/list" ||
      path.split("?")[0] == "/pages/order/list"
      ? "reLaunch"
      : "switchTab"
    : method == "switchTab"
    ? "redirectTo"
    : method;
  // #endif
}

//判斷是否為tabbar頁面
export function isTabbarRoute(route = "") {
  let flag = false;
  if (typeof route !== "string") {
    return flag;
  }
  if (route === "/") {
    return true;
  }
  if (route.indexOf("pages") !== -1) {
    route = route.split("?")[0];
    flag = $Store.state.config.tabbar.list.some(({ path }) => route === path);
  }
  return flag;
}

/**
 * 路由跳轉
 * @param {*} method 導航跳轉方法名
 * @param {object/string} options 路由參數（如傳入路由信息對象，統一返回string形式的url鍊接並帶上參數）
 * @returns {object}
 * 返回url跟跳轉方法名
 */
export function navigate(method = "navigateTo", options = {}) {
  let url = "";
  if (isObject(options)) {
    let { path, query, appid, mpath } = Object.assign({}, options);
    /**
     * 跳轉其他小程序
     * appid 為小程序appid，mpath 跳轉的小程序路徑
     */
    if (appid) {
      // #ifdef H5
      console.log("跳轉小程序：" + appid);
      // #endif
      $Other.toMiniProgram({
        appid: appid,
        path: mpath
      });
      return false;
    }

    const URLQuery = formatURLQuery(`?${encodeUriParams(query)}`);
    url = `${path}${URLQuery}`;
    method = navMethod(method, path); // 判斷後的路由方法名
  } else {
    url = options;
    method = navMethod(method, options); // 判斷後的路由方法名
  }

  // 獲取當前路由對象
  let route = routes[routePathToName(url)];

  if (!route) {
    // 找不到路由情況，嘗試查找舊路由
    // console.log(url, "==>", compPath(url));
    url = compPath(url);
    if (!url) return false;
    method = navMethod(method, url); // 判斷後的路由方法名
    route = routes[routePathToName(url)];
  }

  if (!route) {
    console.log("未找到相关頁面");
    return {
      url: "/packages/mall/notice?type=404",
      method: "navigateTo"
    };
  }

  // #ifdef MP-WEIXIN
  console.log("會員信息", $Store.state.member.info);
  // #endif

  if (!$Store.state.isWeixin && !route.meta.noLogin && !$Store.getters.token) {
    //未登录情况跳转到登录頁面
    $Store.commit("setLoginBeforePath", url); //url包含路由參數
    return {
      url: "/packages/login/index",
      method: "navigateTo"
    };
  }

  if (route.meta.addon) {
    const addonArr =
      typeof route.meta.addon == "string"
        ? [route.meta.addon]
        : route.meta.addon || [];
    if (!addonArr.some(e => !!$Store.state.config.addons[e])) {
      //未開啟相關應用
      return {
        url: "/packages/mall/notice?type=noaddon&addon=" + route.meta.addon,
        method: "navigateTo"
      };
    }

    // 招商員
    if (
      route.meta.addon == "merchants" &&
      $Store.state.member.info.is_merchants == 0
    ) {
      $Prompt
        .modal({
          title: "提示",
          content: `您未成為招商員，請前往申請`,
          confirmText: "前往申請"
        })
        .then(() => {
          uni.navigateTo({
            url: "/packages/merchant/apply"
          });
        })
        .catch(() => {});
      return false;
    }

    // 需要是分销商才能进入的应用頁面
    const pageDistribe = {
      distribution: 1,
      microshop: 1,
      channel: 1,
      areabonus: 1,
      globalbonus: 1,
      teambonus: 1
    };

    if (
      addonArr.some(e => !!pageDistribe[e]) &&
      $Store.state.member.info.isdistributor != 2
    ) {
      $Prompt
        .modal({
          title: "提示",
          content: `您未成為${$Store.state.distribute.texts.distributor_name}`,
          confirmText: "前往申請"
        })
        .then(() => {
          uni.navigateTo({
            url: "/packages/distribute/apply"
          });
        })
        .catch(() => {});
      return false;
    }
  }

  // #ifdef H5
  if (route.meta.refresh && $Store.state.isWeixin && isBrowser("ios")) {
    location.replace($Store.getters.route.origin + url);
    return false;
  }
  // #endif

  return {
    method,
    url
  };
}
