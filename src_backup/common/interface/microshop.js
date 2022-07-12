// @ts-ignore
import $Request from "@/api/requset";

// 微店中心
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/microShopCenter",
    data,
    noCancel: true,
    ...config
  });
}

//確認訂單信息
export function GET_SHOPINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/orderMicroShopInfo",
    data,
    isWriteIn: true,
    ...config
  });
}

//等級中心
export function GET_GRADEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/microShopLevelCenter",
    data,
    ...config
  });
}

//立即續費
export function GET_RENEW(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/immediateRenewal",
    data,
    ...config
  });
}

//立即升級
export function GET_UPGRADE(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/upgradeLevel",
    data,
    ...config
  });
}

// 獲取微店收益明細
export function GET_MICROSHOPLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/profitDetail",
    data,
    ...config
  });
}

//微店收益詳情
export function GET_MICROSHOPDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/myProfit",
    data,
    ...config
  });
}

// 獲取收益提現信息
export function GET_WITHDRAWSINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/profitShow",
    data,
    ...config
  });
}

// 收益提現
export function APPLY_WITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/profitWithdraw",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 微店設置
export function SET_SHOPSET(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/microShopSet",
    data,
    ...config
  });
}

// 挑選微店商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/goodsList",
    data,
    ...config
  });
}

// 挑選微店商品分類
export function GET_GOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/goods/categoryInfo",
    data,
    ...config
  });
}

//挑選商品、取消選中商品
export function GET_SELECTGOODS(data = {}, config = {}) {
  const url = config.isChecked
    ? "/addons/microshop/microshop/selectGoods"
    : "/addons/microshop/microshop/delGoods";
  return $Request({
    url,
    data,
    ...config
  });
}

//取消選中商品
export function GET_DELGOOdS(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/delGoods",
    data,
    ...config
  });
}

//預攬微店商品
export function GET_MICROSHOPGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/previewMicroShop",
    data,
    ...config
  });
}

//預攬微店中商品分類(返回值為三級分類信息)
export function GET_PREVIEWMICROSHOGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/previewMicroShopGoods",
    data,
    ...config
  });
}

//預攬微店中商品分類
export function GET_PREVIEWMICROSHOPCATEGROY(data = {}, config = {}) {
  return $Request({
    url: "/addons/microshop/microshop/previewMicroShopCategory",
    data,
    ...config
  });
}


//獲取加密貨幣二維碼地址列表
export function GET_CRYPTOCURRENCY_QR_CODE_LIST(data = {}, config = {}) {
  return $Request({
    url: "/member/gatewayList",
    data,
    ...config
  });
}