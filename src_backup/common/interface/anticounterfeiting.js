import $Request from "@/api/requset";

// 用戶端是否需要登錄
export function GET_ISLOGIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/anticounterfeiting/anticounterfeiting/isLogin",
    data,
    ...config
  });
}
// 用戶端查詢防偽碼
export function GET_SEARCHANTI(data = {}, config = {}) {
  return $Request({
    url:
      "/addons/anticounterfeiting/anticounterfeiting/searchAnticounterfeiting",
    data,
    errorCallback: true,
    ...config
  });
}
