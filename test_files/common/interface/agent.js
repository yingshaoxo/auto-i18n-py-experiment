import $Request from "@/api/requset";

// 獲取成為分銷商信息
export function GET_APPLYCOMMISSION(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributorApply_show",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申請成為分銷商
export function APPLY_COMMISSION(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributorapply",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 完善資料，提交表單
export function APPLY_REPLENISHINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/dataComplete",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取分銷中心信息
export function GET_AGENTCENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributionCenter",
    method: "post",
    data,
    noCancel: true,
    isWriteIn: true,
    ...config
  });
}

// 獲取分銷佣金詳情
export function GET_COMMISSIONDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/myCommissiona",
    method: "post",
    data,
    ...config
  });
}

// 獲取分銷佣金明細
export function GET_COMMISSIONLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/commissionDetail",
    method: "post",
    data,
    ...config
  });
}

// 獲取我的團隊
export function GET_TEAMLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/teamList",
    method: "post",
    data,
    ...config
  });
}

// 獲取我的客戶
export function GET_CUSTOMERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/customerList",
    method: "post",
    data,
    ...config
  });
}

// 獲取佣金提現信息
export function GET_WITHDRAWINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/commissionWithdraw_show",
    method: "post",
    data,
    ...config
  });
}

// 佣金提現
export function APPLY_WITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/commissionWithdraw",
    method: "post",
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
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 分享鍊接或者掃碼成為下線
export function EXTEND_SUB(data = {}, config = {}) {
  return $Request({
    url: "/member/checkReferee",
    method: "post",
    data,
    ...config
  });
}

// 獲取分銷設置相關文案字眼
export function GET_AGENTSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/distributionSet",
    method: "post",
    data,
    ...config
  });
}

// 獲取分銷推薦排行榜、佣金排行榜、積分排行榜
export function GET_COMMISSIONRANKING(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/ranking",
    method: "post",
    data,
    ...config
  });
}

//分紅分銷等級
export function GET_UPBONUESLEVEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/upbonusLevel",
    method: "post",
    data,
    errorCallback: true,
    ...config
  });
}

// 獲取業績獎
export function GET_ACHIEVEWARD(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getAchievementDeatil",
    method: "post",
    data,
    ...config
  });
}

// 獲取渠道商申請信息
export function GET_APPLYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/applayChannelForm",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申請成為渠道商
export function APPLY_CHANNEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/applayChannel",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取商品分類
export function GET_GOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getChannelGoodsCategoryList",
    method: "post",
    data,
    ...config
  });
}

// 獲取商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getChannelGradeGoods",
    method: "post",
    data,
    ...config
  });
}

// 添加到購物車
export function ADD_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/addAgentCart",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取購物車列表
export function GET_CARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getChannelCartGoodsInfo",
    method: "post",
    data,
    ...config
  });
}

// 刪除購物車
export function REMOVE_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/deleteAgentCart",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 修改購物車數量
export function EDIT_CARTGOODSNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelCartAdjustNum",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 計算運費
export function COUNT_FREIGHT(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/countChannelFree",
    method: "post",
    data,
    ...config
  });
}

// 獲取確認訂單信息
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelSettlement",
    method: "post",
    data,
    ...config
  });
}

// 提交訂單
export function CREATE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/orderCreate",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取雲倉庫日誌
export function GET_DEPOTLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/cloudStorageLog",
    method: "post",
    data,
    ...config
  });
}

// 獲取雲倉庫列表
export function GET_DEPOTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/cloudStorage",
    method: "post",
    data,
    ...config
  });
}

// 獲取雲倉庫商品明細
export function GET_DEPOTDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/cloudStorageDetail",
    method: "post",
    data,
    ...config
  });
}

// 獲取我的業績
export function GET_ACHIEVELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/MyChannelPerformance",
    method: "post",
    data,
    ...config
  });
}

// 獲取財務信息
export function GET_FINANCEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/MyChannelBalance",
    method: "post",
    data,
    ...config
  });
}

// 獲取訂單列表
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url:
      data.buy_type == "commission"
        ? "/addons/agent/agent/distributionOrder"
        : "/addons/agent/agent/getChannelOrderDetailList",
    method: "post",
    data,
    ...config
  });
}

// 獲取訂單詳情
export function GET_ORDERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/getPurchaseOrderDetail",
    method: "post",
    data,
    ...config
  });
}

// 關閉訂單
export function CLOSE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelOrderClose",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 發貨
export function CONFIRM_TAKEDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/addons/agent/agent/channelOrderClose",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 采購訂單支付
export function GET_AGENTORDERPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/agentOrderPay",
    method: "post",
    data,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}
