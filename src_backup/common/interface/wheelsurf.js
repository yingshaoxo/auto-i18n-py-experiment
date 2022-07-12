import $Request from "@/api/requset";

//大轉盤詳情
export function GET_WHEELSURFINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/wheelsurfInfo",
    data,
    ...config
  });
}

//開始抽獎
export function GET_USERWHEELSURF(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/userWheelsurf",
    data,
    isWriteIn: true,
    ...config
  });
}

//用戶當日抽獎的次數
export function GET_USERFREQUENCY(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/userFrequency",
    data,
    isWriteIn: true,
    ...config
  });
}

//中獎名單
export function GET_PRIZERECORDS(data = {}, config = {}) {
  return $Request({
    url: "/addons/wheelsurf/wheelsurf/prizeRecords",
    data,
    ...config
  });
}
