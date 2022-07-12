import {
  GET_MEMBERINFO,
  EXTEND_SUB,
  CHECK_PAYPASSWORD,
  GET_AREA,
  GET_MEMBERSETTEXT,
  GET_MPSUBSCRIDETEMPLATEID,
  SET_MPSUBSCRIDETEMPLATEIFNO,
  GET_NOTICETEMPLATEID,
  SET_POSTNOTICETEMPLATEINFO
} from "@/common/interface/member";
import $Storage from "@/api/storage";
import $Prompt from "@/api/prompt";
import { memberText } from "@/common/data/texts";
import { Base64 } from "@/common/lib/base64";
import {
  SET_BINDMOBILE,
  GET_BINDMOBILE,
  REMOVE_BINDMOBILE
} from "@/common/utils/auth";

// #ifdef H5
import Vue from "vue";
// #endif

function getName({ nick_name, user_name, user_tel }) {
  if (nick_name) return nick_name;
  if (user_name) return user_name;
  if (user_tel) return user_tel;
  return "未設置昵稱";
}

export default {
  state: {
    sceneCode: "", // 場景推廣碼(分享進來的code)
    posterParams: null, // 海報分享場景參數
    //會員信息
    info: {
      // 添加默認字段名，方可監聽數據
      uid: "",
      balance: 0,
      point: 0,
      user_tel: "",
      extend_code: "",
      openid: "",
      member_img: "",
      nick_name: "",
      referee_name: "",
      isdistributor: "",
      country_code: "",
      ppl: 0, // 支付密碼長度
      is_password_set: 0, // 是否設置過密碼
      receivegoodscode: {
        copy_writing: "領貨碼",
        count: 0
      }
    },
    // 是否綁定過手機
    isBindMobile: 0,
    texts: memberText,
    areaList: ""
  },
  getters: {
    // 場景推廣碼(分享進來的code)
    sceneCode: state => {
      return state.sceneCode || $Storage.get("sceneCode") || "";
    },
    // 會員自身推廣碼
    extendCode: state =>
      state.info && state.info.extend_code ? state.info.extend_code : "",
    encodeUid: state => {
      return state.info && state.info.uid
        ? encodeURIComponent(Base64.encode(state.info.uid))
        : "";
    },
    /**
     * 彈出綁定手機的標識
     */
    getPhoneNumber: (state, root) => {
      return root.isBingFlag ? "getPhoneNumber" : "";
    },
    // 是否綁定過手機
    isBindMobile: state => {
      return state.isBindMobile
        ? state.isBindMobile
        : GET_BINDMOBILE()
        ? Number(GET_BINDMOBILE())
        : 0;
    },
    /**
     * 是否顯示綁定手機彈窗
     * 小程序彈出選擇手機號窗口
     * h5端跟app彈除綁定手機窗口
     */
    isShowBindMobile: (state, root) => {
      return root.token && root.isBingFlag && !state.isBindMobile;
    },
    /**
     * 是否需要用戶授權
     * 無會員頭像跟昵稱表示需要用戶點擊授權
     */
    isNeedAuthorize: ({ info }) => {
      return !(info.member_img && info.nick_name);
    }
  },
  mutations: {
    // 设置會員信息
    setMemberInfo(state, info = {}) {
      state.info = Object.assign({ ...state.info }, { ...info });
    },
    // 設置登錄後是否綁定手機號標識 1為綁定  其他未綁定
    setBindMobile(state, have_mobile) {
      state.isBindMobile = have_mobile ? 1 : 0;
      SET_BINDMOBILE(state.isBindMobile);
    },
    // 删除會員信息
    removeMemberInfo(state) {
      state.info = {};
      REMOVE_BINDMOBILE();
    },
    // 設置會員文案
    setMemberTexts(state, data = {}) {
      state.texts = data;
    },
    // 设置場景推廣碼
    setSceneCode(state, code) {
      let str = null;
      // 如url存在多個推廣碼情況，獲取到的推廣碼為數組，所以取數組最後一個值
      if (Array.isArray(code)) {
        str = code[code.length - 1];
      } else {
        str = code;
      }
      state.sceneCode = str;
      $Storage.set("sceneCode", str);
    },
    // 設置分享海報參數
    setSharePosterParams(state, params) {
      state.posterParams = params;
    },
    // 删除場景推廣碼
    removeSceneCode(state) {
      $Storage.remove("sceneCode");
      state.sceneCode = null;
    },
    setAreaList(state, list) {
      state.areaList = list;
    }
  },
  actions: {
    /**
     * 获取會員信息
     * @param {*} update 是否更新會員信息 默認false,
     */
    getMemberInfo({ state, commit, rootState, getters }, con = {}) {
      return new Promise((resolve, reject) => {
        con.update || !state.info.uid ? getData() : resolve(state.info);
        function getData() {
          GET_MEMBERINFO({}, con.config)
            .then(({ data }) => {
              // data.user_tel = "";
              // data.member_img = "";
              // data.nick_name = "";
              // data.username = "";
              // data.is_password_set = 0;
              // data.isdistributor = 0;
              if (data.uid) {
                data.name = getName(data);
                data.level_name = data.level_name || "默認等級";
                data.member_img = data.member_img || getters.static.noAvatar;

                // 開啟代理分銷應用 分銷商狀態為代理分銷的狀態
                if (rootState.config.addons.agent) {
                  data.isdistributor = data.isagent;
                }

                // #ifdef MP-WEIXIN
                data.openid = data.mp_openid;
                // #endif

                // #ifndef MP-WEIXIN
                data.openid = data.wx_openid;
                // #endif
                commit("setMemberInfo", data);
                commit("setBindMobile", data.user_tel);
                resolve(data);
              } else {
                commit("setBindMobile", 0);
                commit("removeUserInfo", {});
                commit("removeMemberInfo");
                resolve();
              }
            })
            .catch(error => {
              resolve(state.info);
            });
        }
      });
    },
    // 獲取會員設置文案
    getMemberTexts({ commit }) {
      return new Promise((resolve, reject) => {
        GET_MEMBERSETTEXT()
          .then(({ data }) => {
            if (data.balance_style) {
              commit("setMemberTexts", data);
            }
            resolve();
          })
          .catch(() => {});
      });
    },
    // 推廣下線
    extendSub({ state, commit }) {
      return new Promise((resolve, reject) => {
        let params = {};
        params.extend_code = state.sceneCode;
        if (state.posterParams) {
          params.poster_id = state.posterParams.poster_id;
          params.poster_type = state.posterParams.poster_type;
        }
        EXTEND_SUB(params)
          .then(({ message }) => {
            commit("removeSceneCode");
            resolve();
            console.log(message);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 檢查支付密碼
    checkPayPassword(context, password) {
      return new Promise((resolve, reject) => {
        CHECK_PAYPASSWORD({ password })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     * 小程序綁定手機號
     */
    mpBindMobile({ commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        dispatch("bindAccount", {
          get_wx_mobile: true,
          encrypted_data: params.encryptedData,
          iv: params.iv
        })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 獲取省市區列表
     */
    getAreaList({ commit }, config = {}) {
      return new Promise((resolve, reject) => {
        GET_AREA({}, config)
          .then(({ data }) => {
            // commit("setAreaList", data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 小程序設置訂閱消息，必須使用button按鈕點擊後才能彈出訂閱窗口
    // setSubscribe({ state }, options = {}) {
    //   return new Promise((resolve, reject) => {
    //     // #ifndef MP-WEIXIN
    //     resolve();
    //     // #endif
    //     // #ifdef MP-WEIXIN
    //     GET_MPSUBSCRIDETEMPLATEID({ type: options.type })
    //       .then(({ data }) => {
    //         let arr = data || [];
    //         let tmplIds = [];
    //         arr.forEach(e => {
    //           if (e.type == options.type && e.status == 1) {
    //             tmplIds.push(e.template_id);
    //           }
    //         });
    //         if (tmplIds.length) {
    //           // 發送訂閱消息
    //           uni.requestSubscribeMessage({
    //             tmplIds: tmplIds,
    //             success: res => {
    //               let params = {
    //                 uid: state.info.uid,
    //                 list: []
    //               };
    //               console.log("success", res);
    //               for (const key in res) {
    //                 if (key != "errMsg" && key != "errCode") {
    //                   params.list.push({
    //                     template_id: key,
    //                     action: res[key]
    //                   });
    //                 }
    //               }
    //               console.log("訂閱消息模板", params);
    //               if (params.list.length) {
    //                 SET_MPSUBSCRIDETEMPLATEIFNO(params, {
    //                   isShowLoading: true
    //                 })
    //                   .then(m => {
    //                     console.log("消息發送成功", m);
    //                     resolve();
    //                   })
    //                   .catch(error => {
    //                     console.log(error);
    //                     resolve();
    //                   });
    //               } else {
    //                 resolve();
    //               }
    //             },
    //             fail: ({ errMsg, errCode }) => {
    //               console.log(errCode, errMsg);
    //               resolve();
    //             },
    //             complete: () => {}
    //           });
    //         } else {
    //           resolve();
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error);
    //         resolve();
    //       });
    //     // #endif
    //   });
    // },

    // 公眾號訂閱通知
    setSubscribeH5({ state }, options = {}) {
      return new Promise((resolve, reject) => {
        GET_NOTICETEMPLATEID({ node_id: options.node_id })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            resolve(error);
          });
      });
    },

    // 新=>統一小程序 H5訂閱消息
    setSubscribe({ state }, options = {}) {
      return new Promise((resolve, reject) => {
        // #ifndef MP-WEIXIN
        resolve();
        // #endif
        // #ifdef MP-WEIXIN
        GET_NOTICETEMPLATEID({ node_id: options.node_id })
          .then(res => {
            // console.log(res);
            let arr = res.data || [];
            let tmplIds = [];

            arr.forEach(e => {
              if (arr.length > 0) {
                tmplIds.push(e.template_id);
              }
            });
      
            // resolve(res);
            if (tmplIds.length) {
              // 發送訂閱消息
              uni.requestSubscribeMessage({
                tmplIds: tmplIds,
                success: res => {
                  let params = {
                    uid: state.info.uid,
                    list: []
                  };
                  console.log("success", res);
                  for (const key in res) {
                    if (key != "errMsg" && key != "errCode") {
                      params.list.push({
                        template_id: key,
                        action: res[key]
                      });
                    }
                  }
                  arr.forEach(e=>{
                    console.log(e.template_code);
                    params.list.forEach(k=>{
                      console.log(k,"k");
                      if(e.template_id==k.template_id){
                        k['template_code']=e.template_code
                      }
                     
                    })

                  })
                  console.log("訂閱消息模板", params);
                  if (params.list.length) {
                    SET_POSTNOTICETEMPLATEINFO(params, {
                      isShowLoading: true
                    })
                      .then(m => {
                        console.log("消息發送成功", m);
                        resolve();
                      })
                      .catch(error => {
                        console.log(error);
                        resolve();
                      });
                  } else {
                    resolve();
                  }
                },
                fail: ({ errMsg, errCode }) => {
                  console.log(errCode, errMsg);
                  resolve();
                },
                complete: () => {}
              });
            } else {
              resolve();
            }
          })
          .catch(error => {
            console.log(error);
            resolve();
          });
        // #endif
      });
    }
  }
};
