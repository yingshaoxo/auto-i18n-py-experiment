/**
 * 路由/頁面跳轉集合
 */

/**
 * 路由跳轉示例
 * 字符串跳轉： $Navigate.push('/pages/router/router1')
 * 對象跳轉：   $Navigate.push({path:'/pages/router/router1'})
 * 帶參跳轉：
 * 1: $Navigate.push({path:'/pages/router/router1', query: { a: '1'}})
 * 2: $Navigate.push('/pages/router/router1?a=1&b=1')
 */

import { navigate } from "@/common/utils/navigate";

export default {
  push(options) {
    if (!options) return;
    const { url, method } = navigate("navigateTo", options);
    return new Promise((resolve, reject) => {
      if (!method) return;
      uni[method]({
        url: url,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  replace(options) {
    if (!options) return;
    const { url, method } = navigate("redirectTo", options);
    return new Promise((resolve, reject) => {
      if (!method) return;
      uni[method]({
        url: url,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  replaceAll(options) {
    if (!options) return;
    const { url, method } = navigate("reLaunch", options);
    return new Promise((resolve, reject) => {
      if (!method) return;
      uni[method]({
        url: url,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  pushTab(options) {
    if (!options) return;
    const { url, method } = navigate("switchTab", options);
    return new Promise((resolve, reject) => {
      if (!method) return;
      uni[method]({
        url: url,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  back(options = {}) {
    const { delta } = Object.assign({}, options.delta ? options : { delta: 1 });
    var pages = getCurrentPages();
    if (pages.length === 1) {
      // #ifdef H5
      history.back();
      // #endif

      // #ifndef H5
      uni.reLaunch({ url: "/pages/mall/index" });
      // #endif
      
      return false;
    }
    uni.navigateBack({
      delta: delta || 1
    });
  }
};
