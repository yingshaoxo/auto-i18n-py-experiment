import $Request from "@/api/requset";

//獲取領劵碼列表
export function GET_RECEIVEGOODSCODELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/receivegoodscode/receivegoodscode/getReceiveGoodsCodeList",
    data,
    ...config
  });
}

//綁定領劵碼
export function BIND_RECEIVEGOODSCODETOUSER(data = {}, config = {}) {
  return $Request({
    url: "/addons/receivegoodscode/receivegoodscode/bindReceiveGoodsCodeToUser",
    data,
    ...config
  });
}