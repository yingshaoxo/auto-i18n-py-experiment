import $Request from "@/api/requset";

// 獎品列表
export function GET_PRIZELIST(data = {}, config = {}) {
  return $Request({
    url: "/member/myPrize",
    data,
    ...config
  });
}

// 獎品確認
export function GET_PRIZEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/prizeDetail",
    data,
    isWriteIn: true,
    ...config
  });
}

// 領取獎品
export function GET_ACCEPTPRIZE(data = {}, config = {}) {
  return $Request({
    url: "/member/acceptPrize",
    data,
    isWriteIn: true,
    ...config
  });
}
