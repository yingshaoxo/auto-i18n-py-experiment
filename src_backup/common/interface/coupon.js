import $Request from "@/api/requset";

// 領券中心
export function GET_COUPONCENTRE(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/couponCentre",
    data,
    ...config
  });
}

// 獲取商品詳情優惠券列表
export function GET_SHOPCOUPONLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/goodsCouponList",
    data,
    ...config
  });
}

// 我的優惠券列表
export function GET_COUPONLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getcouplist",
    data,
    ...config
  });
}

// 獲取優惠券詳情
export function GET_COUPONDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/couponDetail",
    data,
    ...config
  });
}

// 獲取優惠券詳情适用商品列表
export function GET_COUPONDETAILGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/coupontype/couponGoodsList",
    data,
    ...config
  });
}

// 領取優惠券
export function RECEIVE_COUPON(data = {}, config = {}) {
  // isGive 領取贈送的優惠券
  let url = config.isGive
    ? "/addons/coupontype/coupontype/sendCouponToFriend"
    : "/addons/coupontype/coupontype/userArchiveCoupon";
  return $Request({
    url: url,
    data,
    isShowLoading: true,
    isWriteIn: true,
    ...config
  });
}

// 根據id獲取優惠券
export function GET_COUPONFORID(data = {}, config = {}) {
  return $Request({
    url: "/addons/coupontype/Coupontype/getCouponTypeList",
    data,
    ...config
  });
}
