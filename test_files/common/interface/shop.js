import $Request from "@/api/requset";

// 獲取店鋪首頁
export function GET_SHOPINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/shopInfo",
    data,
    ...config
  });
}

// 獲取店鋪組
export function GET_SHOPGROUP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/shopgroup",
    data,
    ...config
  });
}

// 獲取店鋪列表
export function GET_SHOPLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/shopSearch",
    data,
    ...config
  });
}

// 店鋪收藏
export function SET_COLLECTSHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/collectShop",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 店鋪取消收藏
export function CANCEL_COLLECTSHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/cancelCollectShop",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 店鋪收藏列表
export function GET_SHOPCOLLECTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/myShopCollection",
    data,
    ...config
  });
}

// 申請入駐店鋪
export function APPLY_SHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/applyForWap",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取店鋪相關協議
export function GET_SHOPAPPLYPROTOCOL(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/getShopProtocolByWap",
    data,
    ...config
  });
}

// 獲取店鋪申請入駐狀態
export function GET_SHOPAPPLYSTATE(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/getApplyStateByWap",
    data,
    ...config
  });
}

// 獲取店鋪申請入駐狀態
export function GET_SHOPAPPLYCUSTOMFORM(data = {}, config = {}) {
  return $Request({
    url: "/addons/shop/shop/getApplyCustomForm",
    data,
    ...config
  });
}

// 獲取收藏店鋪
export function GET_SHOP_COLLECTION(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/collectionList",
    data,
    ...config
  });
}

// 獲取店铺统计数据
export function GET_SHOP_STATISTICS_DATA(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/dataStatistics",
    data,
    ...config
  });
}

// 獲取店铺统计列表数据
export function GET_SHOP_STATISTICS_LIST_DATA(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/dataStatisticsList",
    data,
    ...config
  });
}
