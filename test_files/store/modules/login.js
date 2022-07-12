import {
  LOGIN,
  OTHER_LOGIN,
  LOGOUT,
  GET_MSGCODE,
  IS_HASMOBILE,
  BIND_ACCOUNT
} from "@/common/interface/login";

import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/common/utils/auth";
import $Prompt from "@/api/prompt";
import $Navigate from "@/api/navigate";

const port = {
  wx: 1, //公眾號
  mp: 2, //小程序
  h5: 3, //h5端
  pc: 4, //pc端
  app: 5 //app端
};

export default {
  state: {
    token: null,
    name: null,
    avatar: null,
    openid: null
  },
  getters: {
    // 用戶標識，可用與是否登錄狀態
    token: state => state.token || GET_TOKEN() || ""
  },
  mutations: {
    // 設置用戶信息
    setUserInfo(state, info) {
      state.token = info.user_token;
      state.name = info.user_name;
      state.avatar = info.user_headimg;
      state.openid = info.openid;
      SET_TOKEN(info.user_token);
    },
    // 刪除用戶信息
    removeUserInfo(state, info = {}) {
      state.token = info.user_token;
      state.name = info.user_name;
      state.avatar = info.user_headimg;
      state.openid = "";
      REMOVE_TOKEN();
    }
  },
  actions: {
    // 登錄
    login({ commit, dispatch, getters }, form) {
      return new Promise((resolve, reject) => {
        let mall_port = getters.port;
        form.mall_port = mall_port;
        LOGIN(form)
          .then(res => {
            if (res.code === 0) {
              // 登陸失敗次數過多，需要驗證碼
              resolve(res);
            } else {
              commit("setUserInfo", res.data);
              dispatch("getMemberInfo", { update: true }).then(() => {
                resolve(res);
                dispatch("getCartList", { update: true });
              });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     * 授权登錄接口（微信公眾號，微信小程序，qq）
     * 類型form[type]：
     * WCHAT=>微信公眾號
     * MP=>微信小程序
     * QQLOGIN=>qq
     */
    authLogin({ commit, dispatch, rootState, getters }, form = {}) {
      return new Promise((resolve, reject) => {
        const config = {};
        const sceneCode = getters.sceneCode; //分享進來的推廣碼
        let params = {};
        params.type = form.type;
        console.log("分享進來的推廣碼：", sceneCode);
        if (sceneCode) {
          params.extend_code = sceneCode;
        }

        // #ifdef MP-WEIXIN
        params = Object.assign({ ...params }, { ...form });
        // #endif

        // #ifdef APP-PLUS
        params.wx_openid = form.openId;
        params.name = form.nickName;
        params.unionGender = form.gender;
        params.iconurl = form.avatarUrl;
        params.unionid = form.unionId;
        // #endif

        // #ifdef H5
        config.method = form.method; // 第二次請求時使用get方式請求
        params.code = form.code; // 微信授權code
        if (form.redirect_url) {
          // 微信授權成功回调地址
          params.redirect_url = form.redirect_url;
        }
        // #endif

        // #ifndef H5
        config.loadingText = "登錄中";
        // #endif
        console.log(params);
        OTHER_LOGIN(params, config)
          .then(res => {
            const { code, data, message } = res;
            if (code === 1) {
              // 登錄成功
              commit("setUserInfo", data);
              // 有推廣碼授權成功則刪除該推廣碼
              if (params.extend_code) {
                commit("removeSceneCode");
              }
              dispatch("getMemberInfo", {
                update: true,
                config: { loadingText: "加載中" }
              }).then(() => {
                console.log("獲取會員信息", rootState.member.info);
                resolve(res);
                dispatch("getCartList", { update: true });
              });
            } else if (code === 2) {
              // 需要綁定手機
              $Navigate.replace("/pages/member/index").then(() => {
                $Prompt.toast(message);
              });
            } else if (code === 3) {
              // 賬號被鎖定
              $Navigate.pushTab("/pages/mall/index").then(() => {
                $Prompt.toast(message);
              });
            } else if (code === 4) {
              // h5進行授權
              // #ifdef H5
              if (typeof data.url === "string") {
                location.replace(data.url);
              } else {
                $Prompt.modal({
                  content: JSON.stringify(data),
                  showCancel: false
                });
              }
              // #endif
            } else if (code === 5) {
              // #ifdef MP-WEIXIN
              // 再次登錄（微信小程序情況下）
              uni.login({
                provider: "weixin",
                complete(res) {
                  if (!res.code) {
                    $Prompt.modal({
                      content: "微信登錄失败",
                      showCancel: false
                    });
                  }
                  dispatch("authLogin", { ...params, code: res.code }).then(
                    res => {
                      resolve(res);
                    }
                  );
                }
              });
              // #endif
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
            $Prompt.modal({ content: error.message, showCancel: false });
          });
      });
    },
    // 退出登錄
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        LOGOUT()
          .then(res => {
            commit("removeUserInfo", {});
            commit("removeMemberInfo");
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 獲取短信驗證碼
    getMsgcode({ rootState, getters }, form) {
      const mobile = form.mobile; // 獲取輸入的手機號
      return new Promise((resolve, reject) => {
        if (rootState.config.mobile_verification) {
          let mall_port = getters.port;
          if (form.type === "register") {
            IS_HASMOBILE({ mobile, mall_port }).then(({ code, message }) => {
              if (code === 0) {
                // 1 為存在手機號  0為 不存在手機號
                GET_MSGCODE(form)
                  .then(res => {
                    $Prompt.toast({ title: res.message, icon: "success" });
                    resolve(res);
                  })
                  .catch(error => {
                    reject(error);
                  });
              } else {
                $Prompt.toast("該手機號碼已被注冊！");
              }
            });
          } else if (form.type === "login" || form.type === "forget_password") {
            IS_HASMOBILE({ mobile, mall_port }).then(({ code, message }) => {
              if (code === 1) {
                // 判斷是否已注冊手機號
                GET_MSGCODE(form)
                  .then(res => {
                    $Prompt.toast({ title: res.message, icon: "success" });
                    resolve(res);
                  })
                  .catch(error => {
                    reject(error);
                  });
              } else {
                $Prompt.toast(message);
              }
            });
          } else if (
            form.type === "bind_email" ||
            form.type === "change_pay_password" ||
            form.type === "change_password" ||
            form.type === "update_mobile"
          ) {
            // 修改資料
            if (form.type == "update_mobile") {
              form.type = "bind_mobile";
            }
            GET_MSGCODE(form)
              .then(res => {
                $Prompt.toast({ title: res.message, icon: "success" });
                resolve(res);
              })
              .catch(error => {
                reject(error);
              });
          } else if (form.type === "bind_mobile") {
            IS_HASMOBILE({ mobile, mall_port }).then(({ code, message }) => {
              GET_MSGCODE(form)
                .then(res => {
                  $Prompt.toast({ title: res.message, icon: "success" });
                  resolve({ isHasMobile: code, msg: message });
                })
                .catch(error => {
                  reject(error);
                });
            });
          }
        } else {
          $Prompt.toast("商城未開啟短信模版");
        }
      });
    },
    // 關聯賬戶
    bindAccount({ commit, dispatch, getters }, form) {
      return new Promise((resolve, reject) => {
        let params = Object.assign({}, { ...form });
        let mall_port = getters.port;
        params.mall_port = mall_port;
        BIND_ACCOUNT(params)
          .then(({ code, data, message }) => {
            if (code === 1) {
              commit("setUserInfo", data);
              $Prompt.toast({ title: "關聯成功", icon: "success" });
              //  更新會員數據
              dispatch("getMemberInfo", { update: true }).then(() => {
                resolve(data);
              });
            } else if (code === 5) {
              // #ifdef MP-WEIXIN
              // 再次登錄（微信小程序情況下）
              uni.login({
                provider: "weixin",
                complete(res) {
                  if (!res.code) {
                    $Prompt.modal({
                      content: "微信登錄失败",
                      showCancel: false
                    });
                  }
                  dispatch("authLogin", { code: res.code }).then(() => {
                    dispatch("bindAccount", { ...params });
                  });
                }
              });
              // #endif
            } else {
              $Prompt.toast(message);
              reject();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
