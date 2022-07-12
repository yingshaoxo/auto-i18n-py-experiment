import $Request from "@/api/requset";

//獲取禮品
export function GET_ACCEPTFESTIVALCARE(data = {}, config = {}) {
  return $Request({
    url: "/addons/festivalcare/festivalcare/acceptFestivalcare",
    data,
    ...config
  });
}
