import $Request from "@/api/requset";

// 微商入駐
export function APPAYWXSHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/appayWxShop",
    data,
    ...config
  });
}

// 商品庫商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/unbindGoods",
    data,
    ...config
  });
}

// 挑選商品
export function SELECTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/selectGoods",
    data,
    ...config
  });
}

// 取消挑選商品
export function DELGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/delGoods",
    data,
    ...config
  });
}


// 編輯商品詳情
export function SETGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getGoods",
    data,
    ...config
  });
}

// 保存商品價格
export function SAVEGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/saveGoods",
    data,
    ...config
  });
}

// 微商中心
export function WXSHOPCENTER(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/wxShopDetail",
    data,
    ...config
  });
}

// 貨款充值
export function addCash(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/addCash",
    data,
    ...config
  });
}

// 微商財務日誌列表
export function PAYLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/payLog",
    data,
    ...config
  });
}

// 提現
export function ADDWITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/addWithdraw",
    data,
    ...config
  });
}

// 微商列表
export function WXSHOPLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/wxShopList",
    data,
    ...config
  });
}

// 微商 收藏/取消
export function COLLECTIONGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/collectionGoods",
    data,
    ...config
  });
}

// 充值
export function OFFLINERECHARGEPAY(data = {}, config = {}) {
  return $Request({
    url: "/member/offlineRechargePay",
    data,
    ...config
  });
}

// 設置推薦
export function SETREC(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/setRec",
    data,
    ...config
  });
}

// 修改背景、logo、店鋪名
export function SET_BACKGROUND(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/setBackground",
    data,
    ...config
  });
}



