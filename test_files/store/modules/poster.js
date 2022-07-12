import { GET_POSTERIMG } from "@/common/interface/poster";

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    /**
     * 獲取海報圖片
     * @param {Object} params
     * type ==> 1：商城海報 2：商品海報 3：關注海報 4：微店海報
     * goods_id ==> 为商品海報时需传商品id
     * is_mp ==> 為小程序
     * mp_page ==> 小程序路徑
     */
    getPosterImg({ rootState, getters }, params) {
      return new Promise((resolve, reject) => {
        if (
          rootState.config.addons.poster &&
          getters.token &&
          rootState.member.info.isdistributor == 2
        ) {
          // #ifdef MP-WEIXIN
          params.is_mp = 1;
          // #endif
          params.scene = true; //表示新版本獲取超級海報
          GET_POSTERIMG(params)
            .then(({ data }) => {
              let path = data.poster_path
                ? `${rootState.domain}/${data.poster_path}`
                : data.poster;
              data.poster
                ? resolve({
                    path: path,
                    width: data.width,
                    height: data.height
                  })
                : reject();
            })
            .catch(() => {
              reject();
            });
        } else {
          reject();
        }
      });
    }
  }
};
