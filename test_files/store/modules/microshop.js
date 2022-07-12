import { GET_CENTREINFO } from "@/common/interface/microshop";
import $Navigate from "@/api/navigate";
import $Prompt from "@/api/prompt";
export default {
  state: {
    // 微店信息
    info: {
      // 添加默認字段名，方可監聽數據
      microshop_logo: "",
      microshop_name: "",
      shopRecruitment_logo: "",
      microshop_introduce: "",
      shopkeeper_time_text: ""
    }
  },
  getters: {},
  mutations: {
    // 設置微店信息
    setMicroshopInfo(state, info = {}) {
      state.info = Object.assign({ ...state.info }, { ...info });
    }
  },
  actions: {
    /**
     * 獲取微店信息
     * @param {*} update 是否更新會員信息 默認false,
     */
    getMicroshopInfo({ state, rootState, commit }, options = {}) {
      return new Promise((resolve, reject) => {
        options.update || !state.info.uid ? getData() : resolve(state.info);
        function getData() {
          const params = {};
          if (options.shopkeeper_id) {
            params.shopkeeper_id = options.shopkeeper_id;
          }
          GET_CENTREINFO(params)
            .then(({ data }) => {
              if (data.uid) {
                data.shopkeeper_time_text =
                  data.shopkeeper_level_time == "無期限"
                    ? "無期限"
                    : "將於" + data.shopkeeper_level_time + "到期";
                if (!options.shopkeeper_id) {
                  // 存在店主id則為分享鍊接進來，不存儲
                  commit("setMicroshopInfo", data);
                }
                if (data.isdistributor != 2) {
                  $Prompt
                    .toast(
                      "請先成為" + rootState.distribute.texts.distributor_name
                    )
                    .then(() => {
                      $Navigate.replace("/pages/member/index");
                    });
                } else {
                  resolve(data);
                }
              } else {
                reject();
              }
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    }
  }
};
