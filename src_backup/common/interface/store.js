import $Request from "@/api/requset";

// 獲取平臺下所有門店列表
export function GET_STORELIST(data = {}, config = {}) {
  const url = config.isShopStore
    ? "/goods/getWeiShang"
    : "/goods/getWeiShang";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 獲取門店信息
export function GET_STOREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/storeIndex",
    data,
    ...config
  });
}

// 獲取門店商品分類
export function GET_STOREGOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/getStoreGoodsCategoryList",
    data,
    ...config
  });
}

// 獲取門店商品列表
export function GET_STOREGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/getStoreGoods",
    data,
    ...config
  });
}

// 獲取門店購物車列表
export function GET_STORECARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/cart",
    data,
    ...config
  });
}

// 添加門店商品到門店購物車
export function ADD_STOREGOODSTOCART(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/addCart",
    data,
    isShowLoading: true,
    ...config
  });
}

// 刪除購物車商品
export function REMOVE_STORECART(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/deleteCartGoods",
    data,
    isShowLoading: true,
    ...config
  });
}

// 修改購物車數量
export function EDIT_STORECARTNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/store/store/editCartNum",
    data,
    isShowLoading: true,
    ...config
  });
}

// 根據店鋪id或商品id獲取門店列表
export function GET_SHOPSTORELIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/getStoreList",
    data,
    ...config
  });
}

// 根據門店id獲取門店列表
export function GET_STOREIDLIST(data = {}, config = {}) {
  return $Request({
    url: "/order/getStoreList",
    data,
    ...config
  });
}
