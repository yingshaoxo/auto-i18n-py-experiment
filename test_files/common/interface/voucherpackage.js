import $Request from "@/api/requset";

// 券包詳情
export function GET_VOUCHERPACKAGEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/voucherpackage/voucherpackage/voucherPackage",
    data,
    ...config
  });
}

// 領取券包
export function RECEIVE_VOUCHERPACKAGE(data = {}, config = {}) {
  return $Request({
    url: "/addons/voucherpackage/voucherpackage/userArchiveVoucherPackage",
    data,
    isWriteIn: true,
    isShowLoading: true,
    ...config
  });
}
