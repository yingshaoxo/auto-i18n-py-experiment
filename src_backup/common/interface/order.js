import $Request from "@/api/requset";

// 計算運費
export function COUNT_FREIGHT(data = {}, config = {}) {
  return $Request({
    url: "/goods/count_free",
    data,
    ...config
  });
}

// 確認訂單
export function GET_ORDERINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/orderInfo",
    data,
    errorCallback: true,
    isWriteIn: true,
    noShowMessage: true,
    ...config
  });
}

// 提交訂單
export function CREATE_ORDER(data = {}, config = {}) {
  let url = config.isStoreOrder
    ? "/order/StoreOrderCreate"
    : "/order/orderCreate";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 訂單列表
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/order/orderlist",
    data,
    ...config
  });
}

// 訂單詳情
export function GET_ORDERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/order/orderDetail",
    data,
    ...config
  });
}

// 獲取訂單申請售後信息
export function GET_REFUNDINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/refundDetail",
    data,
    ...config
  });
}

// 提交申請售後
export function APPLY_REFUNDASK(data = {}, config = {}) {
  return $Request({
    url: "/order/refundAsk",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 取消申請售後
export function CANCEL_REFUNDASK(data = {}, config = {}) {
  return $Request({
    url: "/order/cancelOrderRefund",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 提交退貨信息
export function SUB_REFUNDEXPRESS(data = {}, config = {}) {
  return $Request({
    url: "/order/orderGoodsRefundExpress",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 關閉訂單
export function CLOSE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/order/orderClose",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 刪除訂單
export function EDLETE_ORDER(data = {}, config = {}) {
  return $Request({
    url: "/order/deleteOrder",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 確認收貨
export function CONFIRM_TAKEDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/order/orderTakeDelivery",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 訂單商品評價/訂單商品再次評價
export function ADD_ORDEREVALUATE(data = {}, config = {}) {
  let url = config.isAgain
    ? "/order/addOrderEvaluateAgain"
    : "/order/addOrderEvaluate";
  return $Request({
    url,
    data,
    isShowLoading: true,
    ...config
  });
}

// 獲取物流信息
export function GET_LOGISTICSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/order/orderShippingInfo",
    data,
    ...config
  });
}

// 再次購買
export function ADD_BUYAGAIN(data = {}, config = {}) {
  return $Request({
    url: "/goods/buyAgain",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取訂單支付信息
export function GET_ORDERPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/orderPay",
    data,
    isShowLoading: true,
    errorCallback: true,
    ...config
  });
}

// 獲取尾款支付單號
export function GET_TAILMONEYNO(data = {}, config = {}) {
  return $Request({
    url: "/pay/pay_last_money",
    data,
    isShowLoading: true,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 貨到付款
export function PAY_DPAY(data = {}, config = {}) {
  return $Request({
    url: "/Member/dPay",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取物流公司
export function GET_EXPRESSCOMPANY(data = {}, config = {}) {
  return $Request({
    url: "/order/getvExpressCompany",
    data,
    ...config
  });
}
