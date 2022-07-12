import $Request from "@/api/requset";

// 獲取幫助中心列表
export function GET_HELPLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/helpcenter/helpcenter/getQuesCategoryList",
    data,
    ...config
  });
}

// 獲取幫助列表分類
export function GET_HELPCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/helpcenter/helpcenter/getQuesCategoryDetail",
    data,
    ...config
  });
}

// 獲取文章詳情
export function GET_HELPDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/helpcenter/helpcenter/getQuesDetail",
    data,
    ...config
  });
}
