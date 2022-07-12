import $Request from "@/api/requset";

// 獲取	朋友圈素材分類
export function GET_CATEGORYLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/friendscircle/friendscircle/friendscircleCategoryList",
    data,
    ...config
  });
}

// 獲取	朋友圈列表
export function GET_WAPGETMATERIALLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/friendscircle/friendscircle/wapGetMaterialList",
    data,
    ...config
  });
}

// 獲取	朋友圈點贊
export function ADDREPEATNUM(data = {}, config = {}) {
  return $Request({
    url: "/addons/friendscircle/friendscircle/addRepeatNum",
    data,
    ...config
  });
}