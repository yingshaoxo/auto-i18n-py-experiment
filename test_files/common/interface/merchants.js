import $Request from "@/api/requset";

// 招商員
// 招商中心
export function GET_MERCHANTSCENTER(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/merchantsCenter",
    data,
    noCancel: true,
    ...config
  });
}

// 申请成为招商員表单页面，獲取申請協議，logo
export function GET_MERCHANTSAPPLYSHOW(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/merchantsApplyShow",
    data,
    ...config
  });
}

// 提交申请为招商員
export function MERCHANTSAPPLYSUBMIT(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/merchantsApply",
    data,
    ...config
  });
}

// 業績訂單
export function GET_WAPGETPROMOTIONORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetPromotionOrder",
    data,
    ...config
  });
}

// 推廣的店鋪
export function GET_WAPGETPROMOTIONSHOP(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetPromotionShop",
    data,
    ...config
  });
}

// 推广的招商員
export function GET_WAPGETPROMOTIONMERCHANTS(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetPromotionMerchants",
    data,
    ...config
  });
}

// 招商碼
export function GET_PROMOTIONCODE(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/promotionCode",
    data,
    ...config
  });
}

// 業績詳情
export function GET_WAPGETACHIEVEMENTDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetAchievementDetail",
    data,
    ...config
  });
}

// 業績流水
export function GET_WAPGETACHIEVEMENTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/wapGetAchievementList",
    data,
    ...config
  });
}

// 業績提現表單頁面
export function GET_ACHIEVEMENTWITHDRAWALSHOW(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/achievementWithdrawalShow",
    data,
    ...config
  });
}

// 業績提現
export function GET_ACHIEVEMENTWITHDRAWAL(data = {}, config = {}) {
  return $Request({
    url: "/addons/merchants/merchants/achievementWithdrawal",
    data,
    ...config
  });
}
