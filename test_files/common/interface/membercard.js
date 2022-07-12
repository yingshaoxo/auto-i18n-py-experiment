import $Request from "@/api/requset";

// 會員卡首頁
export function GET_MEMBERCARDINDEX(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/membercardIndex",
    data,
    isShowLoading: true,
    ...config
  });
}

//會員卡餘額明細
export function GET_MEMBERCARDBALANCELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/membercardBalanceList",
    data,
    ...config
  });
}

//   -會員卡升級
export function GET_UPGRADEMEMBERCARD(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/upgradeMembercard",
    data,
    isShowLoading: true,
    ...config
  });
}

//   購買會員卡
export function MEMBERCARD_BUYMEMBERCARD(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/buyMembercard",
    data,
    ...config
  });
}

//   充值頁面
export function GET_RECHARGE(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/recharge",
    data,
    ...config
  });
}

//   會員卡充值
export function MEMBERCARD_CREATERECHARGEORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/createRechargeOrder",
    data,
    ...config
  });
}

// 添加到微信卡包
export function MEMBERCARD_ADDMEMBERCARDTOWX(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/addMembercardToWx",
    data,
    ...config
  });
}

// 會員卡餘額流水詳情
export function GET_MEMBERCARDDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/balanceDetail",
    data,
    ...config
  });
}

// 微信會員卡領取成功
export function MEMBERCARD_MEMBERCARDSUCCESSTOWX(data = {}, config = {}) {
  return $Request({
    url: "/addons/membercard/membercard/membercardSuccessToWx",
    data,
    ...config
  });
}
