/**
 * storage
 */

import $Store from "@/store";
import envConfig from "@/config";

export default {
  /**
   * 存儲
   * @param {string} key 鍵
   * @param {any} data 值
   * @param {boolean} isAsyn 是否異步(默認false)
   */
  set(k, data, isAsyn) {
    let appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默認加上app應用名稱
    if ($Store && $Store.state.appName) {
      appName = $Store.state.appName;
    }
    const key = (appName + k).toUpperCase();
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.setStorage({
          key,
          data,
          success() {
            resolve();
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      uni.setStorageSync(key, data);
    }
  },
  // h5瀏攬器session
  setSession(k, data) {
    // #ifdef H5
    const appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默認加上app應用名稱
    const key = (appName + k).toUpperCase();
    sessionStorage.setItem(key, JSON.stringify(data));
    // #endif
  },
  /**
   * 获取存儲
   * @param {string} key 鍵
   * @param {boolean} isAsyn 是否異步(默認false)
   */
  get(k, isAsyn) {
    let appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默認加上app應用名稱
    if ($Store && $Store.state.appName) {
      appName = $Store.state.appName;
    }
    const key = (appName + k).toUpperCase();
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.getStorage({
          key,
          success(res) {
            resolve(res);
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      return uni.getStorageSync(key);
    }
  },
  // h5瀏攬器session
  getSession(k) {
    // #ifdef H5
    const appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默認加上app應用名稱
    const key = (appName + k).toUpperCase();
    return JSON.parse(sessionStorage.getItem(key));
    // #endif
  },
  /**
   * 删除存儲
   * @param {string} key 鍵
   * @param {boolean} isAsyn 是否異步(默認false)
   */
  remove(k, isAsyn) {
    let appName = (envConfig[process.env.NODE_ENV].NAME + "_").toUpperCase(); // 默認加上app應用名稱
    if ($Store && $Store.state.appName) {
      appName = $Store.state.appName;
    }
    const key = (appName + k).toUpperCase();
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.removeStorage({
          key,
          success() {
            resolve();
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      return uni.removeStorageSync(key);
    }
  },
  /**
   * 清空存儲
   * @param {boolean} isAsyn 是否異步(默認false)
   */
  clear(isAsyn) {
    if (isAsyn) {
      return new Promise((resolve, reject) => {
        uni.clearStorage({
          success() {
            resolve();
          },
          fail() {
            reject();
          }
        });
      });
    } else {
      uni.clearStorageSync();
    }
  }
};
