/**
 * plugins 調用第三方服務
 */

import $Prompt from "./prompt";
import $Store from "@/store";
export default {
  /**
   * 獲取第三方平臺自定義的數據
   * @param {string} isSync 是否同步獲取
   */
  getExtConfig(isSync) {
    if (isSync) {
      return uni.getExtConfigSync ? uni.getExtConfigSync() : {};
    } else {
      return new Promise((resolve, reject) => {
        if (uni.getExtConfig) {
          uni.getExtConfig({
            success(res) {
              resolve(res.extConfig);
            },
            fail() {
              reject();
            }
          });
        } else {
          $Prompt.toast("不支持獲取第三方平臺");
        }
      });
    }
  },
  /**
   * 授權登錄
   * @param {string} provider 服務商類型 weixin,qq
   * @param {object} options
   */
  authLogin(provider = "", options = {}) {
    return new Promise((resolve, reject) => {
      // #ifdef H5
      $Store
        .dispatch("authLogin", {
          ...options
        })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
      // #endif

      // #ifndef H5
      $Prompt.loading("授權中");
      uni.getProvider({
        service: "oauth",
        success(res) {
          if (~res.provider.indexOf(provider)) {
            uni.login({
              provider,
              success({ authResult }) {
                uni.getUserInfo({
                  provider,
                  success({ userInfo }) {
                    $Store
                      .dispatch("authLogin", {
                        ...options,
                        ...userInfo
                      })
                      .then(res => {
                        resolve(res);
                      })
                      .catch(error => {
                        reject(error);
                      });
                  },
                  fail(error) {
                    reject();
                    $Prompt.modal({
                      content: JSON.stringify(error),
                      showCancel: false
                    });
                  },
                  complete() {
                    $Prompt.clear();
                  }
                });
              },
              fail(error) {
                reject(error);
                $Prompt.modal({
                  content: JSON.stringify(error),
                  showCancel: false
                });
              },
              complete() {
                $Prompt.clear();
              }
            });
          } else {
            $Prompt.modal({ content: "服務商類型错误", showCancel: false });
          }
        },
        fail() {
          reject();
        },
        complete() {
          $Prompt.clear();
        }
      });
      // #endif
    });
  },
  /**
   * 獲取用戶信息
   * @param {string} provider 服務商類型 weixin,qq
   * @param {object} options
   */
  getUserInfo(provider = "", options = {}) {
    return new Promise((resolve, reject) => {
      uni.getUserInfo({
        provider,
        success(res) {
          resolve(res);
        },
        fail(error) {
          reject(error);
        }
      });
    });
  },
  /**
   * 分享
   * @param {} options
   */
  share(options = {}) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      uni.share({
        ...options,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
    // #endif
  },
  /**
   * 系統分享
   * @param {*} options
   */
  shareWithSystem(options = {}) {
    // #ifdef APP-PLUS
    return new Promise((resolve, reject) => {
      uni.shareWithSystem({
        ...options,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
    // #endif
  }
};
