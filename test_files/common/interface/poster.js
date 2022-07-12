import $Request from "@/api/requset";

// 獲取超級海報圖片
export function GET_POSTERIMG(data = {}, config = {}) {
  return $Request({
    url: "/addons/poster/poster/getKindPoster",
    data,
    ...config
  });
}
