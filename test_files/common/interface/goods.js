import $Request from "@/api/requset";

// 獲取商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/goodsList",
    data,
    noLogin: true,
    ...config
  });
}

// 根據商品id组獲取商品列表
export function GET_GOODSCUSTOMLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/goodsListIndex",
    data,
    noLogin: true,
    ...config
  });
}

// 獲取商品分類
export function GET_GOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/goods/categoryInfo",
    data,
    noLogin: true,
    ...config
  });
}

// 獲取商品詳情
export function GET_GOODSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/goods/goodsDetail",
    data,
    noLogin: true,
    errorCallback: true,
    ...config
  });
}

// 商品保存獨立表單數據
export function SET_GOODSFORMDATA(data = {}, config = {}) {
  return $Request({
    url: "/goods/saveGoodsFormData",
    data,
    ...config
  });
}

// 獲取商品分享信息
export function GET_GOODSSHAREINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/goodsShareDetail",
    data,
    ...config
  });
}

// 獲取商品評價列表
export function GET_GOODSEVALUATE(data = {}, config = {}) {
  return $Request({
    url: "/goods/goodsReviewsList",
    data,
    ...config
  });
}

// 商品收藏
export function SET_GOODSCOLLECT(data = {}, config = {}) {
  return $Request({
    url: "/goods/collectGoods",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 商品收藏列表
export function GET_GOODSCOLLECTLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/myGoodsCollection",
    data,
    ...config
  });
}

// 取消商品收藏
export function CANCEL_GOODSCOLLECT(data = {}, config = {}) {
  return $Request({
    url: "/goods/cancelCollectGoods",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 加入購物車
export function ADD_CART(data = {}, config = {}) {
  return $Request({
    url: "/goods/addCart",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 立即購買
export function BUY_NOW(data = {}, config = {}) {
  return $Request({
    url: "/goods/buyNow",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 客服
export function GET_CUSTOMERSERVICE(data = {}, config = {}) {
  return $Request({
    url: "/goods/qlkefuInfo",
    data,
    ...config
  });
}

// 獲取商品主圖
export function GET_GOODSIMGBASE64(data = {}, config = {}) {
  return $Request({
    url: "/goods/getGoodsImgOfBase64",
    data,
    ...config
  });
}

// 獲取商品基本信息
export function GET_GOODSINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/getGoodsBasicInfo",
    data,
    noLogin: true,
    isShowLoading: config.loading || false,
    ...config
  });
}

// 獲取商品預約信息
export function GET_GOODSSCHEDLEIFNO(data = {}, config = {}) {
  return $Request({
    url: "/goods/scheduleDetail",
    data,
    ...config
  });
}

// 提交商品預約信息
export function SET_GOODSSCHEDLEIFNO(data = {}, config = {}) {
  return $Request({
    url: "/addons/systemform/systemform/addSchedule",
    data,
    isShowLoading: true,
    ...config
  });
}

// 獲取營銷活動商品
export function GET_GOODSPROMOTELIST(data = {}, config = {}) {
  return $Request({
    url: "/Goods/getCustomPromotionList",
    data,
    ...config
  });
}

// 區塊鍊，優惠券
export function GET_GOODSMOREINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/getGoodsMoreInfo",
    data,
    ...config
  });
}

// 商品上架智能推薦
export function SET_RECOMMENDGOODS(data = {}, config = {}) {
  return $Request({
    url: "/goods/onRecommendGoods",
    data,
    ...config
  });
}

