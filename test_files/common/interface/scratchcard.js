import $Request from "@/api/requset";

// 刮刮樂詳情
export function GET_SCRATCHCARDINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/scratchcard/scratchcard/scratchcardInfo",
    data,
    ...config
  });
}

// 刮刮樂次數
export function GET_FREQUENCY(data = {}, config = {}) {
  return $Request({
    url: "/addons/scratchcard/scratchcard/userFrequency",
    data,
    isWriteIn: true,
    ...config
  });
}

//  中獎名單
export function GET_PRIZERECORDS(data = {}, config = {}) {
  return $Request({
    url: "/addons/scratchcard/scratchcard/prizeRecords",
    data,
    ...config
  });
}

// 刮獎
export function SET_USERSCRATCHCARD(data = {}, config = {}) {
  return $Request({
    url: "/addons/scratchcard/scratchcard/userScratchcard",
    data,
    isWriteIn: true,
    ...config
  });
}
