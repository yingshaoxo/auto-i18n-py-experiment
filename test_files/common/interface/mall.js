import $Request from "@/api/requset";

// 購物車列表
export function GET_CARTLIST(data = {}, config = {}) {
  return $Request({
    url: "/goods/cart",
    data,
    noCancel: true,
    ...config
  });
}

// 刪除購物車
export function REMOVE_CARTGOODS(data = {}, config = {}) {
  return $Request({
    url: "/goods/delete_car_goods",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 修改購物車數量
export function EDIT_CARTNUM(data = {}, config = {}) {
  return $Request({
    url: "/goods/cartAdjustNum",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}

// 根據店鋪id和門店id獲取購物車信息
export function GET_SHOPCARTINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/cartGetGoodsList",
    data,
    isShowLoading: true,
    ...config
  });
}

// 編輯購物車信息
export function EDIT_CARTINFO(data = {}, config = {}) {
  return $Request({
    url: "/goods/cartEditSkuOrNum",
    data,
    isShowLoading: true,
    ...config
  });
}
