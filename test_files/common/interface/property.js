import $Request from "@/api/requset";

// 獲取資產信息
export function GET_ASSET(data = {}, config = {}) {
  return $Request({
    url: "/member/asset",
    data,
    ...config
  });
}

// 獲取提現賬戶列表
export function GET_ASSETACCOUNTLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/bank_account",
    data,
    noCancel: true,
    ...config
  });
}

// 刪除賬戶
export function DEL_ASSETACCOUNT(data = {}, config = {}) {
  return $Request({
    url: "/member/del_account",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 添加/編輯賬戶
export function SET_ASSETACCOUNT(data = {}, config = {}) {
  return $Request({
    url:
      config.type == "add"
        ? "/member/add_bank_account"
        : "/member/update_account",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取餘額信息
export function GET_ASSETBALANCE(data = {}, config = {}) {
  return $Request({
    url: "/member/balance",
    data,
    ...config
  });
}

// 獲取餘額明細列表
export function GET_ASSETBALANCELOG(data = {}, config = {}) {
  let url = config.isProceeds
    ? "/member/proceedsWater"
    : "/member/balancewater";
  return $Request({
    url,
    data,
    ...config
  });
}

// 獲取餘額明細詳情
export function GET_ASSETBALANCEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/balanceDetail",
    data,
    ...config
  });
}

// 充值餘額
export function RECHARGE_ASSETBALANCELOG(data = {}, config = {}) {
  return $Request({
    url: "/member/recharge",
    data,
    isWriteIn: true,
    ...config
  });
}

// 创建充值餘額訂單
export function CREATE_ASSETRECHARORDER(data = {}, config = {}) {
  return $Request({
    url: "/member/createRechargeOrder",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取提現信息
export function GET_ASSETWITHDRAWINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/withdraw_form",
    data,
    ...config
  });
}

// 提現餘額
export function APPLY_ASSETWITHDRAW(data = {}, config = {}) {
  return $Request({
    url: "/member/withdraw",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 積分
export function GET_ASSETPOINTS(data = {}, config = {}) {
  return $Request({
    url: "/member/integralWater",
    data,
    ...config
  });
}

// 銀行列表
export function GET_BANKLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/bank_list",
    data,
    ...config
  });
}

// 銀行卡簽約申請短信
export function GET_BANKSIGNINGSMS(data = {}, config = {}) {
  return $Request({
    url: "/Member/tlSigning",
    data,
    isShowLoading: true,
    loadingText: "獲取短信驗證",
    ...config
  });
}

// 簽約銀行卡
export function SIGNING_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/member/tlAgreeSigning",
    data,
    isShowLoading: true,
    loadingText: "簽約中",
    ...config
  });
}

// 解綁銀行卡
export function UNTYING_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/member/tlUntying",
    data,
    isShowLoading: true,
    loadingText: "解綁中",
    ...config
  });
}

// 簽約銀行卡列表
export function GET_BANKCARDLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/tl_bank_account",
    data,
    ...config
  });
}

// 余額積分兑换
export function EXCHANGE_BALANCEPOINT(data = {}, config = {}) {
  return $Request({
    url: "/member/transBalancePoint",
    data,
    isShowLoading: true,
    loadingText: "兌換中",
    ...config
  });
}

// 餘額轉賬
export function TRANSFER_BALANCE(data = {}, config = {}) {
  return $Request({
    url: "/member/transBalance",
    data,
    isShowLoading: true,
    loadingText: "轉賬中",
    ...config
  });
}

// 獲取各種資產手續費
export function GET_PROPERTYCHARGESERVICE(data = {}, config = {}) {
  return $Request({
    url: "/member/chargeService",
    data,
    ...config
  });
}

// 獲取賬戶詳情
export function GET_ACCOUNTINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/bank_account_detail",
    data,
    ...config
  });
}

// 更新銀行自動賬戶
export function UPDATE_BANKCARD(data = {}, config = {}) {
  return $Request({
    url: "/member/update_bank_account",
    data,
    ...config
  });
}

// 積分转账
export function TRANS_INTEGRAL(data = {}, config = {}) {
  return $Request({
    url: "/member/transIntegral",
    data,
    ...config
  });
}
