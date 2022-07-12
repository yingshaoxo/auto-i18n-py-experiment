import $Request from "@/api/requset";

// 獲取成為代理商信息
export function GET_APPLYAGENTINFO(data = {}, config = {}) {
  return $Request({
    url: "/Member/applyagent",
    data,
    isWriteIn: true,
    ...config
  });
}

// 申請成為代理
export function APPLY_AGENT(data = {}, config = {}) {
  const obj = {
    1: "/addons/globalbonus/Globalbonus/globalAgentApply", // 申請成為全球代理
    2: "/addons/areabonus/areabonus/areaAgentApply", // 申請成為區域代理
    3: "/addons/teambonus/Teambonus/teamAgentApply" // 申請成為團隊代理
  };
  const url = obj[config.agentType] || "";
  return $Request({
    url,
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 獲取分紅中心
export function GET_CENTREINFO(data = {}, config = {}) {
  return $Request({
    url: "/Member/bonusIndex",
    data,
    noCancel: true,
    ...config
  });
}

// 獲取分紅金額
export function GET_BONUSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/Member/myBonus",
    data,
    ...config
  });
}

// 獲取分紅明細
export function GET_BONUSLOG(data = {}, config = {}) {
  return $Request({
    url: "/Member/bonus_detail",
    data,
    ...config
  });
}

// 獲取分紅訂單
export function GET_ORDERLIST(data = {}, config = {}) {
  return $Request({
    url: "/Member/bonus_order",
    data,
    ...config
  });
}

// 獲取分紅設置相關文案字眼
export function GET_BONUSSETTEXT(data = {}, config = {}) {
  return $Request({
    url: "/member/bonusSet",
    data,
    noCancel: true,
    ...config
  });
}

// 獲取發貨訂單列表
export function GET_BONUSTEAMDELIVERYORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/teambonus/teambonus/teamCaptainDelivery",
    data,
    ...config
  });
}

// 獲取隊長發貨詳情
export function GET_BONUSTEAMDELIVERYDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/teambonus/teambonus/deliveryPageInfo",
    data,
    ...config
  });
}

// 隊長發貨
export function SET_BONUSTEAMDELIVERY(data = {}, config = {}) {
  return $Request({
    url: "/addons/teambonus/teambonus/actCaptainDelivery",
    data,
    ...config
  });
}
