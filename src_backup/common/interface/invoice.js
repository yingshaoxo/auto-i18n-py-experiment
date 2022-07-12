import $Request from "@/api/requset";

// 獲取發票圖
export function GET_IMG(data = {}, config = {}) {
  return $Request({
    url: "/addons/invoice/invoice/getInvoiceImg",
    data,
    ...config
  });
}

//添加至微信卡包
export function ADD_WXCARDPACKAGE(data = {}, config = {}) {
  return $Request({
    url: "/addons/invoice/invoice/post2WxCardPackage",
    data,
    ...config
  });
}

//發票插卡
export function GET_AUTHURL(data = {}, config = {}) {
  return $Request({
    url: "/addons/invoice/invoice/getAuthUrl",
    data,
    ...config
  });
}
