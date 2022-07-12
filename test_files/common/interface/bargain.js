import $Request from "@/api/requset";

// 砍價列表
export function GET_BARGAINLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/bargain/bargain/getBargainList",
    data,
    ...config
  });
}
// 砍價詳情
export function GET_BARGAINDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/bargain/bargain/myActionBargain",
    data,
    ...config
  });
}
// 幫砍
export function SUB_BARGAIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/bargain/bargain/helpBargain",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 我的砍價列表
export function GET_MYBARGAINLIST(data = {}) {
  return $Request({
    url: "/addons/bargain/bargain/myBargainList",
    data
  });
}
// 關閉用戶參加的砍價活動
export function CLOSEUSERBARGAIN(data = {}) {
  return $Request({
    url: "/addons/bargain/bargain/closeUserBargain",
    data
  });
}
