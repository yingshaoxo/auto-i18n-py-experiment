import $Request from "@/api/requset";

// 獲取支付信息
export function GET_PAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/getPayValue",
    data,
    isShowLoading: true,
    isWriteIn: true,
    errorCallback: true,
    ...config
  });
}

// 線下支付
export function PAY_OFFLINE(data = {}, config = {}) {
  const url = "/member/offlinePay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    ...config
  });
}

// 微信支付
export function PAY_WECHAT(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/member/wchatPay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    ...config
  });
}

// 支付寶支付
export function PAY_ALIPAY(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/member/aliPay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    ...config
  });
}

// 餘額支付
export function PAY_BALANCE(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/member/balance_pay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    loadingText: "支付中",
    ...config
  });
}

// 獲取支付結果
export function GET_PAYRESULT(data = {}, config = {}) {
  return $Request({
    url: "/order/get_pay_result_info",
    data,
    isShowLoading: true,
    isWriteIn: true,
    ...config
  });
}

// 獲取相關虛擬幣可支付信息
export function GET_BLOCKCHAINPAYINFO(data = {}, config = {}) {
  return $Request({
    url: "/order/getBlockChainBalance",
    data,
    ...config
  });
}

// eth/eos支付
export function PAY_BLOCKCHAIN(data = {}, config = {}) {
  return $Request({
    url: "/Member/" + config.type + "Pay",
    data,
    isWriteIn: true,
    loadingText: "支付請求中",
    isShowLoading: true,
    ...config
  });
}

// 申請銀行卡支付短信
export function APPLY_BANKCARDSMS(data = {}, config = {}) {
  return $Request({
    url: "/Member/tlPayApplyAgree",
    data,
    isWriteIn: true,
    loadingText: "申請驗證短信",
    isShowLoading: true,
    ...config
  });
}

// 獲取銀行卡支付短信
export function GET_BANKCARDSMS(data = {}, config = {}) {
  return $Request({
    url: "/Member/paySmsAgree",
    data,
    isWriteIn: true,
    loadingText: "獲取短信驗證",
    isShowLoading: true,
    ...config
  });
}

// 銀行卡支付
export function PAY_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/Member/tlPay",
    data,
    isWriteIn: true,
    loadingText: "支付中",
    isShowLoading: true,
    ...config
  });
}

// 貨款支付
export function PAY_PROCEEDS(data = {}, config = {}) {
  const url = config.isIntegral
    ? "/addons/integral/integral/integralPay"
    : "/member/proceeds_pay";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// glopay 跨境支付
export function PAY_GLOPAY(data = {}, config = {}) {
  return $Request({
    url: "/Member/GlobePay",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
