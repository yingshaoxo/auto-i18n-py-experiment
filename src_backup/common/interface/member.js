import $Request from "@/api/requset";
import $Store from "@/store";

// 獲取會員信息
export function GET_MEMBERINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/memberIndex",
    data,
    noCancel: true,
    ...config
  });
}
// 分享鍊接或者掃碼成為下線
export function EXTEND_SUB(data = {}, config = {}) {
  return $Request({
    url: "/member/checkReferee",
    data,
    noCancel: true,
    ...config
  });
}
// 獲取賬號信息
export function GET_ACCOUNTINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/getMemberBaseInfo",
    data,
    ...config
  });
}
// 設置賬號信息
export function SET_ACCOUNTINFO(data = {}, config = {}) {
  return $Request({
    url: "/member/saveMemberBaseInfo",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 驗證手機短信驗證碼
export function VALID_MSGCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/checkVerificationCode",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 修改密碼
export function UPDATE_PASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/member/updatePassword",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 修改支付密碼
export function UPDATE_PAYMENTPASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/member/updatePaymentPassword",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 修改手機
export function UPDATE_MOBILE(data = {}, config = {}) {
  return $Request({
    url: "/member/updateMobile",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 綁定郵箱
export function UPDATE_EMAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/updateEmail",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
// 獲取關聯賬號
export function GET_ACCOUNTRELEVANT(data = {}, config = {}) {
  return $Request({
    url: "/member/associationList",
    data,
    ...config
  });
}
// 檢查支付密碼
export function CHECK_PAYPASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/member/check_pay_password",
    data,
    ...config
  });
}

// 獲取文案
export function GET_MEMBERSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/config/copyStyle",
    data,
    noCancel: true,
    ...config
  });
}

// 等級詳情
export function GET_MEMBERLEVEL(data = {}, config = {}) {
  return $Request({
    url: "/member/memberLevel",
    data,
    ...config
  });
}

// 獲取省市區
export function GET_AREA(data = {}, config = {}) {
  return $Request({
    url: "/goods/area",
    method: "post",
    data,
    isShowLoading: true,
    loadingText: "加載中",
    ...config
  });
}

// 獲取收貨地址列表
export function GET_ADDRESSLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/receiverAddressList",
    method: "post",
    data,
    noCancel: true,
    ...config
  });
}

// 收貨地址詳情
export function GET_ADDRESSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/receiverAddressDetail",
    method: "post",
    data,
    ...config
  });
}

// 保存收貨地址
export function SAVE_ADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/member/saveReceiverAddress",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 刪除收貨地址
export function DEL_ADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/member/deleteAddress",
    method: "post",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 設置默認收貨地址
export function SET_DEFAULTADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/member/setDefaultAddress",
    method: "post",
    data,
    isWriteIn: true,
    ...config
  });
}

// 獲取國家
export function GET_COUNTRYLIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getCountryList",
    method: "post",
    data,
    ...config
  });
}

// 獲取訂閱消息模板
export function GET_MPSUBSCRIDETEMPLATEID(data = {}, config = {}) {
  let url =
    $Store.state.appName == "shopdds" || $Store.state.appName == "dds"
      ? "/miniprogram/getMpTemplateId"
      : "/addons/miniprogram/miniprogram/getMpTemplateId";
  return $Request({
    url,
    data,
    isShowLoading: true,
    noShowMessage: true,
    ...config
  });
}

// 設置訂閱消息模板
export function SET_MPSUBSCRIDETEMPLATEIFNO(data = {}, config = {}) {
  let url =
    $Store.state.appName == "shopdds" || $Store.state.appName == "dds"
      ? "/miniprogram/postUserMpTemplateInfo"
      : "/addons/miniprogram/miniprogram/postUserMpTemplateInfo";
  return $Request({
    url,
    data,
    ...config
  });
}

// 公眾號 小程序 訂閱通知
// 獲取節點下模板ID
export function GET_NOTICETEMPLATEID(data = {}) {
  return $Request({
    url: "/addons/messagenotice/Messagenotice/getNoticeTemplateId",
    data
  });
}
// 訂閱通知：用戶授權情況
export function SET_POSTNOTICETEMPLATEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/messagenotice/messagenotice/postNoticeTemplateInfo",
    data,
    ...config
  });
}

// 獲取用戶發票信息列表

export function GET_USERINVOICELIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getUserInvoiceList",
    data,
    ...config
  });
}

// 添加/編輯用戶發票信息
export function ADDUSERINVOICE(data = {}) {
  return $Request({
    url: "/member/addUserInvoice",
    data
  });
}

// 刪除發票信息
export function DELUSERINVOICE(data = {}) {
  return $Request({
    url: "/member/delUserInvoice",
    data
  });
}

// 獲取默認用戶發票信息
export function GET_USERINVOICEINFO(data = {}) {
  return $Request({
    url: "/member/getUserInvoiceInfo",
    data,
    isShowLoading: true
  });
}

// 設為默認發票
export function SETDEFAULTUSERINVOICE(data = {}) {
  return $Request({
    url: "/member/setDefaultUserInvoice",
    data
  });
}

// 獲取用戶發票信息
export function GET_USERINVOICEINFOBYCOND(data = {}) {
  return $Request({
    url: "/member/getUserInvoiceInfoByCond",
    data,
    isShowLoading: true
  });
}
