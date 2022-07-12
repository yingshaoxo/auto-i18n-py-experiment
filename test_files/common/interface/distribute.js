import $Request from "@/api/requset";

// 獲取成為分銷商信息
export function GET_APPLYCOMMISSION(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributorApply_show",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申請成為分銷商 / 完善資料，提交表單
export function APPLY_COMMISSION(data = {}, config = {}) {
  const url = config.isReplenishInfo
    ? "/addons/distribution/distribution/dataComplete"
    : "/addons/distribution/distribution/distributorapply";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取分銷中心信息
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributionCenter",
    data,
    isWriteIn: true,
    noCancel: true,
    ...config
  });
}

// 獲取分銷佣金詳情
export function GET_COMMISSIONDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/myCommissiona",
    data,
    ...config
  });
}

// 獲取分銷佣金明細
export function GET_COMMISSIONLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionDetail",
    data,
    ...config
  });
}

// 獲取分銷訂單
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributionOrder",
    data,
    ...config
  });
}

// 獲取我的團隊
export function GET_TEAMLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/teamList",
    data,
    ...config
  });
}

// 獲取我的客戶
export function GET_CUSTOMERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/customerList",
    data,
    ...config
  });
}

// 獲取佣金提現信息
export function GET_WITHDRAWINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionWithdraw_show",
    data,
    ...config
  });
}

// 佣金提現
export function APPLY_WITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/commissionWithdraw",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取推廣碼
export function GET_EXTENDCODE(data = {}, config = {}) {
  return $Request({
    url: "/member/qrcode",
    data,
    isWriteIn: true,
    ...config
  });
}

// 分享鍊接或者掃碼成為下線
export function EXTEND_SUB(data = {}, config = {}) {
  return $Request({
    url: "/member/checkReferee",
    data,
    ...config
  });
}

// 獲取分銷設置相關文案字眼
export function GET_COMMISSIONSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/distributionSet",
    data,
    noCancel: true,
    ...config
  });
}

// 獲取分銷推薦排行榜、佣金排行榜、積分排行榜
export function GET_COMMISSIONRANKING(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/ranking",
    data,
    ...config
  });
}

//分紅分銷等級
export function GET_UPBONUESLEVEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/distribution/distribution/upbonusLevel",
    data,
    errorCallback: true,
    ...config
  });
}
