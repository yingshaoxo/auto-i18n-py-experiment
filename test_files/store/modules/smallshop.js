import {
  smallshop
} from "@/common/data/texts";

export default {
  state: {
    info: {}, //信息
    isSetText: false,
    texts: smallshop,
    type: '', //商品管理tab欄type值
    editGoodsSkuList: [{
      sku_name: "",
      sku_id: 0,
      price: 0,
      market_price: 0,
      stock: 0,
      cost_price:0,
      guidance_price:0,
      bar_code: ""
    }]
  },
  getters: {},
  mutations: {
    // 設置會員文案
    setBonusTexts(state, data = {}) {
      state.texts = data;
      state.isSetText = true;
    },
    modificationtype(state, type) {
      state.type = type || ''
      uni.setStorageSync('tabtype', type);
    },
    setEditGoodsSkuList(state, list) {
      state.editGoodsSkuList = list
    },
    resetEditGoodsSkuList(state) {
      state.editGoodsSkuList = [{
        sku_name: "",
        sku_id: 0,
        price: 0,
        market_price: 0,
        cost_price:0,
      guidance_price:0,
        stock: 0,
        bar_code: ""
      }]
    }
  },
  actions: {

  }
};
