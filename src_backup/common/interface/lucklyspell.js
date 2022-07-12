import $Request from "@/api/requset";

// 幸運拼團詳情
export function GETLUCKYSPELLRECORD(data = {}, config = {}) {
  return $Request({
    url: "/addons/luckyspell/luckyspell/getLuckySpellRecord",
    data,
    isShowLoading: true,
    errorCallback: true,
    ...config
  });
}