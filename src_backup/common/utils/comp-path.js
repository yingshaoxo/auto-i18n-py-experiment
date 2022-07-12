import { oldRoute, oldParamRoute } from "@/common/data/old-routes";
import {
  formatURLQuery,
  encodeUriParams,
  decodeUriParams
} from "@/common/utils";
import $Store from "@/store";

// #ifdef MP
import $System from "@/api/system";
import $Prompt from "@/api/prompt";
// #endif

// 查詢路徑，兼容舊路徑，返回新規則路徑
export function compPath(path) {
  let newPath = "";
  if (isExLink(path)) {
    // 存在外鍊情況
    openLink(path);
    return "";
  }
  if (oldRoute[path]) {
    newPath =
      oldRoute[path].path +
      formatURLQuery(`?${encodeUriParams(oldRoute[path].query)}`);
  } else {
    let arr = path.split("?"); // 判斷路由是否攜帶query參數
    if (arr[1] && oldRoute[arr[0]]) {
      newPath =
        oldRoute[arr[0]].path +
        formatURLQuery(`?${encodeUriParams(decodeUriParams(path))}`);
    } else {
      newPath = paramRoute(arr[0]);
    }
  }
  return newPath;
}

// 必带带參數的路由
// 如 /diy/1
export function paramRoute(str) {
  let path = str;
  oldParamRoute.forEach(e => {
    if (
      str.indexOf(e.key) === 0 ||
      (str.indexOf($Store.state.domain) != -1 && str.indexOf(e.key) != -1)
    ) {
      // 與舊路由匹配的鍊接
      // 存在與自身域名和路由匹配的也屬於舊路由
      const paramVal = str.split(e.key)[1]; // 舊路由是其中一種情況下，获取參數值
      path = e.fullPath + paramVal;
    }
  });
  return path;
}

// 判斷是否外部鍊接
export function isExLink(path = "") {
  // #ifndef MP
  const origin = $Store.getters.route.origin.split("://").length
    ? $Store.getters.route.origin.split("://")[1]
    : "";
  return path.indexOf("http") === 0;
  // #endif

  // #ifdef MP
  return path.indexOf("http") === 0;
  // #endif
}

// 外部鍊接情況跳轉方式
export function openLink(link) {
  // #ifdef APP-PLUS
  plus.runtime.openURL(link);
  // #endif

  // #ifdef H5
  location.assign(link);
  // window.open(link);
  // #endif

  // #ifdef MP
  $System.setClipboardData(link).then(() => {
    $Prompt.modal({
      content: "已自動復制網址，請在手機瀏攬器裡粘跕該網址",
      showCancel: false
    });
  });
  // #endif
}
