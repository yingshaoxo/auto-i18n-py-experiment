import $Request from "@/api/requset";

// 獲取渠道商中心
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelIndex",
    data,
    noCancel: true,
    ...config
  });
}

// 獲取渠道商申請信息
export function GET_APPLYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/applayChannelForm",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申請成為渠道商
export function APPLY_CHANNEL(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/applayChannel",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取商品分類
export function GET_GOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelGoodsCategoryList",
    data,
    ...config
  });
}

// 獲取商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelGradeGoods",
    data,
    ...config
  });
}

// 添加到購物車
export function ADD_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/addChannelCart",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取購物車列表
export function GET_CARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelCartGoodsInfo",
    data,
    ...config
  });
}

// 刪除購物車
export function REMOVE_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/deleteChannelCart",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 修改購物車數量
export function EDIT_CARTGOODSNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelCartAdjustNum",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 計算運費
export function COUNT_FREIGHT(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/countChannelFree",
    data,
    ...config
  });
}

// 獲取確認訂單信息
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelSettlement",
    data,
    ...config
  });
}

// 提交訂單
export function CREATE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/orderCreate",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取我的團隊
export function GET_TEAMLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getMyTeam",
    data,
    ...config
  });
}

// 獲取雲倉庫日誌
export function GET_DEPOTLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/cloudStorageLog",
    data,
    ...config
  });
}

// 獲取雲倉庫列表
export function GET_DEPOTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/cloudStorage",
    data,
    ...config
  });
}

// 獲取雲倉庫商品明細
export function GET_DEPOTDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/cloudStorageDetail",
    data,
    ...config
  });
}

// 獲取我的業績
export function GET_ACHIEVELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/MyChannelPerformance",
    data,
    ...config
  });
}

// 獲取財務信息
export function GET_FINANCEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/MyChannelBalance",
    data,
    ...config
  });
}

// 獲取訂單列表
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getChannelOrderDetailList",
    data,
    ...config
  });
}

// 獲取訂單詳情
export function GET_ORDERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/getPurchaseOrderDetail",
    data,
    ...config
  });
}

// 關閉訂單
export function CLOSE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelOrderClose",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 發貨
export function CONFIRM_TAKEDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/addons/channel/channel/channelOrderClose",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 采購訂單支付
export function GET_CHANNELORDERPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/channelOrderPay",
    data,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}
