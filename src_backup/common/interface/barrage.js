import $Request from "@/api/requset";

// 獲取彈幕規則
export function GET_BARRAGERULE(data = {}, config = {}) {
  return $Request({
    url: "/addons/orderbarrage/orderbarrage/getOrderBarrageRuleApi",
    data,
    noCancel: true,
    ...config
  });
}

// 獲取彈幕信息
export function GET_BARRAGEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/orderbarrage/orderbarrage/getOrderBarrageApi",
    data,
    noCancel: true,
    ...config
  });
}
