import $Request from "@/api/requset";

// 拼團列表
export function GET_ASSEMBLELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/groupshopping/groupshopping/groupShoppingListForWap",
    data,
    ...config
  });
}
// 獲取拼團詳情
export function GET_ASSEMBLEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/groupshopping/groupshopping/getGroupMemberListForWap",
    data,
    ...config
  });
}
