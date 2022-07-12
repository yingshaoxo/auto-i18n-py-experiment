import $Request from "@/api/requset";

// 禮品券列表
export function GET_GIFTVOUCHERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/userGiftvoucher",
    data,
    ...config
  });
}

// 禮品券詳情
export function GET_GIFTVOUCHERDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/userGiftvoucherInfo",
    data,
    ...config
  });
}

// 領取禮品券
export function RECEIVE_GIFVOUCHER(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/giftvoucherReceive",
    data,
    isWriteIn: true,
    ...config
  });
}

// 禮品券詳情领取页
export function GET_GIFTVOUCHERDETAILRECEIVE(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/giftvoucherDetail",
    data,
    ...config
  });
}

// 禮品券適用門店
export function GET_GIFTVOUCHERSTORE(data = {}, config = {}) {
  return $Request({
    url: "/addons/giftvoucher/giftvoucher/giftvoucherStore",
    data,
    ...config
  });
}
