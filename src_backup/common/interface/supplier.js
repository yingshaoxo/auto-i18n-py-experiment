import $Request from "@/api/requset";

// 獲取供應商申請結果
export function GET_SUPPLIERRESULT(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier/supplierResult",
    data,
    ...config
  });
}

// 供應商入駐
export function SET_SUPPLIERAPPLY(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier/supplierApply",
    data,
    ...config
  });
}

// 獲取供應商申請協議
export function GET_SUPPLIERPROTOCOL(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier/supplierProtocol",
    data,
    ...config
  });
}

// 獲取分類列表
export function GET_CATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/supplier/supplier//getCategory",
    data,
    ...config
  });
}
