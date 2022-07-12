import { GET_GOODSMOREINFO } from "@/common/interface/goods";

export default {
  actions: {
    // 獲取商品區塊鍊，優惠券
    getMoreInfo({ rootState }, params = {}) {
      return new Promise((resolve, reject) => {
        const { blockchain, coupontype } = rootState.config.addons;
        if (blockchain || coupontype) {
          GET_GOODSMOREINFO(params).then(res => {
            resolve(res);
          });
        } else {
          resolve();
        }
      });
    }
  }
};
