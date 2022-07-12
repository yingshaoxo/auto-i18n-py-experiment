import $Request from "@/api/requset";

// 砸金蛋詳情
export function GET_SMASHEGGINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/smasheggInfo",
    data,
    ...config
  });
}

// 砸金蛋次數
export function GET_FREQUENCY(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/userFrequency",
    data,
    isWriteIn: true,
    ...config
  });
}

// 中獎名單
export function GET_PRIZERECORDS(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/prizeRecords",
    data,
    ...config
  });
}

//開始砸蛋
export function SET_USERSMASHEGG(data = {}, config = {}) {
  return $Request({
    url: "/addons/smashegg/smashegg/userSmashegg",
    data,
    isWriteIn: true,
    ...config
  });
}
