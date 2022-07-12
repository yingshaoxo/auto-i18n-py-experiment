import $Request from "@/api/requset";

// 直播廣場
export function GET_LIVELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getWapLiveList",
    data,
    noLogin: true,
    ...config
  });
}

// 直播廣場分類
export function GET_LIVECATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getLiveCateList",
    data,
    noLogin: true,
    ...config
  });
}

// 獲取主播信息
export function GET_LIVEANCHORINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorUserInfo",
    data,
    ...config
  });
}