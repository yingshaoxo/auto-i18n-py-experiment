import $Request from "@/api/requset";

// 獲取課程商品列表
export function GET_GOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/myCourse",
    data,
    ...config
  });
}

// 獲取課程商品詳情目錄列表
export function GET_GOODSDETAIL_LIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/wapGetKnowledgePaymentList",
    data,
    ...config
  });
}

// 獲取課程商品詳情
export function GET_GOODSDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/goods/seeKnowledgePayment",
    data,
    ...config
  });
}
