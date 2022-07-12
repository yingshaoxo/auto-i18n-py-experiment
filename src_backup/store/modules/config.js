import {
  GET_CONFIG,
  GET_CUSTOM,
  GET_MPCODE,
  GET_MPCODESCENE
} from "@/common/interface/config";
import { GET_CARTLIST } from "@/common/interface/mall";
import { platform, isWeixin, addImgSrcDomain } from "@/common/utils";
import { compPath } from "../../common/utils/comp-path";
import themeColors from "@/common/theme/color";
import addonsName from "@/common/data/addons";
import $Storage from "@/api/storage";
let configFn = "";
export default {
  // 商城配置
  state: {
    wap_status: 1,
    mallInfo: {
      logo: "",
      name: ""
    },
    barrage_url: {},
    mp_getuserinfo_desc: "", // 小程序獲取用戶信息 彈窗描述
    themeStyle: "",
    is_wchat: "",
    account_type: 0,
    is_bind_phone: 0,
    mobile_verification: 0,
    qq_login: 0,
    website_id: 0,
    wechat_login: 0,
    mobile_type: 0, // 0中國大陸區號，1國際區號
    cpp: 0,
    ppl: 0,
    reg_rule: 0, // 注冊協議
    pur_rule: 0, // 購買協議
    areacodeList: [],
    //應用狀態
    addons: {
      ...addonsName
    },

    // 版權信息
    copyright: {
      style: {
        showtype: "0"
      },
      params: {
        is_show: 1,
        showlogo: "0",
        text: "",
        src: "",
        linkurl: "",
        readonly: ""
      }
    },
    // 自定義表單配置
    customForm: {},
    // 微信關注設置
    wechatSetInfo: {
      is_show: 0
    },
    // 支付方式
    payConfig: {
      aPay: false, // 支付寶支付
      wPay: false, // 微信支付
      bPay: false, // 餘額支付
      dPay: false, //貨到付款
      eosPay: false, //虛擬幣支付
      ethPay: false, //虛擬幣支付
      tlPay: false, //通聯支付
      gPay: false, //globe支付
      //線下支付
      offline_pay: {
        is_use: false
      },
      offline_pay1: {
        is_use: false
      },
      offline_pay2: {
        is_use: false
      },
      offline_pay3: {
        is_use: false
      },
      // 虛擬幣支付
      blockchainpay: {
        is_use: false,
        pay_name: ""
      },
      usdt_pay: {
        is_use: false,
        pay_name: "",
        tx_is_use: false,
      }
    },
    is_integarl_transfer: 0, //是否顯示積分轉贈
    is_transfer: 0, //是否轉賬
    is_point_transfer: 0, //是否兌換

    // 提現配置
    withdraw_conf: {
      is_withdraw_start: false,
      lowest_withdraw: 0,
      withdraw_message: []
    },
    wxKefuImage: "",
    // 首頁彈窗廣告
    adv: {
      show: false,
      image: "",
      rule: 0,
      link: "",
      width: 0,
      height: 0
    },
    tabbar: {
      list: [
        // #ifdef MP-WEIXIN
        {
          pagePath: "pages/mall/index",
          page: "/pages/mall/index",
          text: "首頁"
        },
        {
          pagePath: "pages/goods/category",
          page: "/pages/goods/category",
          text: "分類"
        },
        {
          pagePath: "pages/distribute/index",
          page: "/pages/distribute/index",
          text: "分銷中心"
        },
        {
          pagePath: "pages/mall/cart",
          page: "/pages/mall/cart",
          text: "購物車"
        },
        {
          pagePath: "pages/member/index",
          page: "/pages/member/index",
          text: "會員中心"
        }
        // #endif
      ]
    },
    // 購物車数量
    cartNum: 0
  },
  getters: {
    /**
     * 商城運營狀態
     * 區分  wap端/app端/小程序端
     */
    mallStatus: state => {
      let status = true;
      // platform('H5')
      status = !!state.wap_status;
      return status;
    },
    // 平臺端口
    port: state => {
      let op = {
        H5: isWeixin() && state.is_wchat ? 1 : 3,
        WEIXIN: 2,
        APP: 5,
        APPNVUE: 5
      };
      return op[platform()] || 3;
    },
    /**
     * 訂單來源
     * 提交訂單時傳給後臺
     */
    orderFrom: state => {
      let status = "";
      // #ifdef H5
      status = isWeixin() ? 1 : 2;
      // #endif

      // #ifdef MP
      status = 6;
      // #endif

      // #ifdef APP-PLUS
      const res = uni.getSystemInfoSync();
      status = res.platform === "ios" ? 4 : 5;
      // #endif
      return status;
    },
    // #ifdef H5
    // 是否顯示關注公眾號
    isShowWechat: state => {
      return isWeixin() && state.is_wchat && state.wechatSetInfo.is_show == "1";
    },
    // #endif

    /**
     * 需要進行綁定手機狀態
     * 由後臺設置賬號體系的狀態 account_type為3時，
     * 並且開啟需要綁定手機is_bind_phone的状态為1時，則需要進行綁定手機的判斷
     * account_type 為0/1/2，則需要進行綁定手機的判斷
     */
    isBingFlag: state => {
      return !(state.account_type === 3 && !state.is_bind_phone);
    },
    /**
     * 主題方案
     */
    theme: state => {
      return {
        style: state.themeStyle, //風格
        ...themeColors[state.themeStyle]
      };
    }
  },
  mutations: {
    // 設置商城配置
    setConfig(state, data = {}) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          state[key] = data[key];
          state.is_wchat = false
          state.ppl = state.ppl_now || 0;
          state.website_id = data.website_id || 0;
          state.mallInfo.logo = data.logo;
          state.mallInfo.name = data.mall_name;
          state.mp_getuserinfo_desc =
            data.mp_getuserinfo_desc || "用於完善會員資料";
        }
      }
    },
    // 設置應用
    setConfigAddons(state, data = {}) {
      state.addons = data;
      if (data.agent) {
        //存在代理分銷應用，全網分銷跟微商系統均不開啟
        state.addons.distribution = 0;
        state.addons.channel = 0;
      }
    },
    // 設置自定義表單配置
    setCustomForm(state, data = {}) {
      state.customForm = data;
    },
    //設置彈幕url
    setBarrageUrl(state, data = {}) {
      state.barrage_url = data;
    },
    // 設置版權信息
    setCopyright(state, info = {}) {
      state.copyright = {
        style: info.style || {},
        params: info.params || {}
      };
    },
    setAreacodeList(state, list) {
      state.areacodeList = list;
    },
    // 設置主題
    setTheme(state, style) {
      state.themeStyle = style;
      $Storage.set("theme", style);
    },
    // 設置關注公眾號
    setInviteWechat(state, set) {
      state.wechatSetInfo = set;
    },
    // 設置支付配置
    setPayConfig(state, con) {
      const config = {
        aPay: con.ali_pay,
        wPay: con.wechat_pay,
        bPay: con.bpay,
        dPay: con.dpay,
        eosPay: con.eospay,
        ethPay: con.ethpay,
        tlPay: con.tlpay,
        gPay: con.gppay,
        offline_pay: con.offline_pay || {
          is_use: false
        },
        offline_pay1: con.offline_pay1 || {
          is_use: false
        },
        offline_pay2: con.offline_pay2 || {
          is_use: false
        },
        offline_pay3: con.offline_pay3 || {
          is_use: false
        },
        blockchainpay: con.blockchainpay || {
          is_use: false,
          pay_name: ""
        },
        usdt_pay: con.usdt_pay || {
          is_use: false,
          pay_name: "",
          tx_is_use: false,
        }
      };
      state.payConfig = {
        ...state.payConfig,
        ...config
      };
    },
    setAdv(state, data) {
      state.adv = data;
    },
    // 設置tabbar
    setTabbar(state, data = {}) {
      let list = [];

      const customList = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const { path, normal, active, text } = data[key];
          customList.push({
            path: compPath(path),
            iconPath: addImgSrcDomain(normal),
            selectedIconPath: addImgSrcDomain(active),
            text: text || ""
          });
        }
      }

      // #ifndef MP-WEIXIN
      customList.forEach((e, i) => {
        let pagePath = e.path;
        let path = e.path;
        if (pagePath.substr(0, 1) === "/") {
          pagePath = e.path.substr(1);
        }
        if (path.substr(0, 1) != "/") {
          path = "/" + e.path;
        }
        list.push({
          pagePath: i === 0 ? "pages/mall/index" : pagePath,
          path: i === 0 ? "/pages/mall/index" : path,
          iconPath: e.iconPath,
          selectedIconPath: e.selectedIconPath,
          text: e.text,
          badge: ""
        });
      });
      // #endif

      // #ifdef MP-WEIXIN
      if (__wxConfig.tabBar && __wxConfig.tabBar.list) {
        __wxConfig.tabBar.list.forEach((e, i) => {
          const pagePath = e.pagePath.split(".html")[0];
          if (customList[i]) {
            uni.setTabBarItem({
              index: i,
              iconPath: customList[i].iconPath,
              selectedIconPath: customList[i].selectedIconPath,
              text: customList[i].text
            });
            list.push({
              pagePath: pagePath,
              path: `/${pagePath}`,
              iconPath: customList[i].iconPath,
              selectedIconPath: customList[i].selectedIconPath,
              text: customList[i].text
            });
          }
        });
      }
      // #endif

      state.tabbar.list = list;
    },
    // 設置tabbar 樣式
    setTabbarStyle(state) {
      state.tabbar.list.forEach((e, i) => {
        uni.setTabBarItem({
          index: i,
          iconPath: e.iconPath,
          selectedIconPath: e.selectedIconPath,
          text: e.text
        });
      });
    },
    setWxKefu(state, data) {
      state.wxKefuImage = data;
    },
    setCartNum(state, num = 0) {
      state.cartNum = num;
    },
    setTabbarCartBage(state) {
      state.tabbar.list.forEach((e, i) => {
        if (e.pagePath == "pages/mall/cart") {
          if (state.cartNum) {
            uni.setTabBarBadge({
              index: i,
              text: String(state.cartNum)
            });
          } else {
            uni.removeTabBarBadge({
              index: i
            });
          }
        }
      });
    }
  },
  actions: {
    /**
     * 獲取商城基本配置
     * @param {*} update 是否更新商城基本配置 默認false
     */
    getConfig({ state, rootState, getters, commit, dispatch }, con = {}) {
      if (configFn && !con.update) {
        return configFn;
      }
      return (configFn = new Promise((resolve, reject) => {
        GET_CONFIG({
          version: rootState.version,
          debug: con.debug || 0
        })
          .then(({ data }) => {
            if (rootState.appName == "shopdds" || rootState.appName == "dds") {
              // 店大師項目默認沒有wap端，默認改為1，開啟wap端
              data.config.wap_status = 1;
            }
            commit("setConfig", data.config);
            commit("setTheme", data.config.theme || "red");
            commit("setCustomForm", data.customform || {});
            commit("setConfigAddons", data.addons);
            commit("setCopyright", data.copyright || {});
            commit("setBarrageUrl", data.order_barrage_url_config || {});
            commit("setInviteWechat", data.wechat_set || {});
            let paySet = data.pay_config.wap_pay_set;
            // #ifdef APP-PLUS
            paySet = data.pay_config.app_pay_set;
            // #endif
            // #ifdef MP
            paySet = data.pay_config.mp_pay_set;
            // #endif
            commit("setPayConfig", paySet || {});
            commit(
              "setTabbar",
              data.tab_bar && data.tab_bar.data ? data.tab_bar.data : {}
            );

            resolve(state);

            // 設置广告弹窗
            if (data.popup_adv && data.popup_adv.advshow == 1) {
              if (data.popup_adv.width) {
                commit("setAdv", {
                  show: data.popup_adv.advshow == 1,
                  image: data.popup_adv.advimg,
                  rule: data.popup_adv.advrule,
                  link: data.popup_adv.advlink,
                  width: data.popup_adv.width,
                  height: data.popup_adv.height
                });
              } else {
                uni.getImageInfo({
                  src: data.popup_adv.advimg,
                  complete: e => {
                    commit("setAdv", {
                      show: data.popup_adv.advshow == 1,
                      image: data.popup_adv.advimg,
                      rule: data.popup_adv.advrule,
                      link: data.popup_adv.advlink,
                      width: e.width,
                      height: e.height
                    });
                  }
                });
              }
            }

            setTimeout(() => {
              dispatch("getCartList", {
                update: true
              }).catch(() => {});
              dispatch("getMemberTexts").catch(() => {});
              dispatch("getDistributeTexts").catch(() => {});
            }, 1000);
          })
          .catch(error => {
            reject(error);
          });
      }));
    },
    /**
     * 獲取裝修數據
     * @param {object}
     * type 頁面類型
     * 1 ==> 商城首頁
     * 2 ==> 店铺首頁 需要店鋪id
     * 3 ==> 商品詳情 需要店鋪id
     * 4 ==> 會員中心
     * 5 ==> 分銷中心
     * 6 ==> 自定義頁面 需要頁面id
     * 9 ==> 積分商城
     */
    getCustom({ commit, rootState }, params) {
      return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        params.is_mini = true;
        // #endif
        if (rootState.appName == "shopdds" || rootState.appName == "dds") {
          // 店大師項目 默認傳true
          params.is_mini = true;
        }
        GET_CUSTOM(params)
          .then(({ data }) => {
            const items = data.template_data ? data.template_data.items : {};
            const page = data.template_data ? data.template_data.page : {};

            for (const key in items) {
              if (items[key].id == "customer") {
                commit("setWxKefu", addImgSrcDomain(items[key].params.imgurl));
              }
            }

            resolve({
              items: items,
              page: page
            }); // 只返回裝修模板數據
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     * 獲取小程序太陽碼
     */
    getMpCode({ getters }, params) {
      return new Promise((resolve, reject) => {
        GET_MPCODE(params)
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
            // 顯示錯誤圖片
            resolve(getters.static.noSquare);
          });
      });
    },
    /**
     * 獲取小程序太陽碼的参数
     */
    getMpCodeScene(context, options = {}) {
      return new Promise((resolve, reject) => {
        let param = {};
        GET_MPCODESCENE({
          scene: options.scene
        })
          .then(({ data }) => {
            param = data || {};
            resolve(param);
          })
          .catch(() => {
            resolve(param);
          });
      });
    },
    /**
     * 获取購物車列表
     */
    getCartList({ commit, getters }, options = {}) {
      return new Promise((resolve, reject) => {
        if (getters.token) {
          let param = {
            page_size: options.page_size || 20,
            page_index: options.page_index || 1
          };
          if (options.update) {
            param.page_index = 1;
          }
          GET_CARTLIST(param)
            .then(res => {
              let num = 0;
              if (res.data && res.data.shop_info) {
                res.data.shop_info.forEach(e => {
                  num += e.goods_list.length || 0;
                });
              }
              commit("setCartNum", num || 0);
              // #ifdef MP-WEIXIN
              commit("setTabbarCartBage");
              // #endif
              resolve(res);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve({
            code: 1,
            data: {
              page_count: 0,
              page_index: 1,
              page_size: 0,
              shop_info: []
            },
            message: ""
          });
        }
      });
    }
  }
};
