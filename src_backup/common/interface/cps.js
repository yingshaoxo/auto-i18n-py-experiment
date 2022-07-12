import $Request from "@/api/requset";

//獲取第三方精選商品列表
export function GET_GETOPENGOODS(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getOpenGoods",
    data,
    ...config
  });
}

//獲取商品類目
export function GET_GETGOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getGoodsCategory",
    data,
    ...config
  });
}
// 根據平臺類型獲取各平臺的商品列表
export function GET_GETGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getGoodsList",
    data,
    ...config
  });
}

//獲取各平臺的商品詳情
export function GET_GETGOODSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/getGoodsDetail",
    data,
    ...config
  });
}
//前端獲取返傭規則
export function GET_GETCOMMISSIONRULE(data = {}, config = {}) {
  return $Request({
    url: "/addons/cpsunion/cpsunion/wapGetCommissionRule",
    data,
    ...config
  });
}

//領券購買
export function GET_USECOUPONBUY(data = {}, config = {}) {
  return $Request({
    url: "/cpsapi/useCouponBuy",
    data,
    ...config
  });
}