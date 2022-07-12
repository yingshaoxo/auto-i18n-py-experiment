import $Request from "@/api/requset";

// 獲取消費卡列表
export function GET_CONSUMERCARDLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/consumerCard",
    data,
    ...config
  });
}

// 獲取消費卡詳情
export function GET_CONSUMERCARDDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/consumerCardDetail",
    data,
    ...config
  });
}

// 獲取消費卡核銷記錄
export function GET_CONSUMERCARDLOG(data = {}, config = {}) {
  return $Request({
    url: "/member/consumerCardRecord",
    data,
    ...config
  });
}

// 獲取添加微信卡券的卡券參數
export function GET_WXCARDPARAMS(data = {}, config = {}) {
  return $Request({
    url: "/member/getwxCard",
    data,
    isShowLoading: true,
    ...config
  });
}

// 微信卡券領取成功後執行
export function GET_WXCARDSTATE(data = {}, config = {}) {
  return $Request({
    url: "/member/getwxCardUse",
    data,
    ...config
  });
}
