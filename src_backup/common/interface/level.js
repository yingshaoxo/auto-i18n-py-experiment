import $Request from "@/api/requset";
// 等級類型列表
export function GET_PAYGRADELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/paygrade/paygrade/getPayGradeList",
    data,
    ...config
  });
}

//   等級類型信息
export function GET_PAYGRADEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/paygrade/paygrade/getPayGradeInfo",
    data,
    ...config
  });
}

// 購買等級

export function CREATEPURCHASEORDER(data = {}, config = {}) {
  return $Request({
    url: "/addons/paygrade/paygrade/createPurchaseOrder",
    data,
    ...config
  });
}
