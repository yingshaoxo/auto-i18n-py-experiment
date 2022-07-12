import $Request from "@/api/requset";

//商品分類
export function GET_CATEGORYLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/integralcategorylist",
    data,
    noLogin: true,
    ...config
  });
}

//商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/goodsList",
    data,
    noLogin: true,
    ...config
  });
}

//商品詳情
export function GET_GOODSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/goodsdetail",
    data,
    noLogin: true,
    errorCallback: true,
    ...config
  });
}

//確認訂單
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/orderInfo",
    data,
    errorCallback: true,
    isWriteIn: true,
    ...config
  });
}

//立即支付
export function PAY_INTEGRALPAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/integralPay",
    data,
    errorCallback: true,
    isWriteIn: true,
    ...config
  });
}

// 判斷餘額支付是否設置過密碼
export function GET_INTEGRALPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/integral/integral/getMemberBalancePoint",
    data,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}
