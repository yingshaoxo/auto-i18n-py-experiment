import {
  GET_CENTREINFO,
  GET_COMMISSIONSETTEXT
} from "@/common/interface/distribute";
import {
  GET_AGENTCENTREINFO,
  GET_AGENTSETTEXT
} from "@/common/interface/agent";

import { distribute } from "@/common/data/texts";

function getName({ member_name, real_name }) {
  if (member_name) return member_name;
  if (real_name) return real_name;
  return "未設置昵稱";
}

export default {
  state: {
    info: {}, //信息
    isSetText: false,
    texts: distribute
  },
  getters: {},
  mutations: {
    setDistributeInfo(state, info) {
      state.info = info;
      if (info.uid) {
        state.info.name = getName(info);
        state.info.level_name = info.level_name || "默認等級";
      }
    },
    // 設置分銷商文案
    setDistributeTexts(state, data = {}) {
      state.texts = data;
      state.isSetText = true;
    }
  },
  actions: {
    /**
     * 獲取分銷商信息
     * @param {*} update 是否更新分銷商信息 默認false,
     */
    getDistributeInfo({ state, commit, dispatch, rootState }, con = {}) {
      return new Promise((resolve, reject) => {
        con.update || !state.info.uid ? getData() : resolve(state.info);
        function getData() {
          dispatch("getConfig").then(() => {
            const { agent } = rootState.config.addons;
            const GET_INFO = agent ? GET_AGENTCENTREINFO : GET_CENTREINFO;
            GET_INFO()
              .then(({ data }) => {
                let isdistributor = agent ? data.isagent : data.isdistributor;
                if (data.uid && isdistributor == 2) {
                  commit("setDistributeInfo", data);
                  resolve(data);
                } else {
                  reject(data);
                }
              })
              .catch(error => {
                reject(error);
              });
          });
        }
      });
    },
    // 獲取分銷商設置文案
    getDistributeTexts({ rootState, getters, state, commit }) {
      return new Promise((resolve, reject) => {
        const { distribution, agent } = rootState.config.addons;
        const GET_SETTEXT = agent ? GET_AGENTSETTEXT : GET_COMMISSIONSETTEXT;
        if (getters.token && (distribution || agent) && !state.isSetText) {
          // GET_SETTEXT().then(({ data }) => {
          //   if (data.commission) {
          //     commit("setDistributeTexts", data);
          //   }
          //   resolve();
          // });
          resolve()
        } else {
          resolve();
        }
      });
    }
  }
};
