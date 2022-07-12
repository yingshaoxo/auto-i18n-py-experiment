import $Request from "@/api/requset";

// 獲取會員簽到信息
export function GET_SIGNININFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignInInfo",
    data,
    ...config
  });
}

// 獲取會員當月簽到列表
export function GET_SIGNINLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignInList",
    data,
    ...config
  });
}

// 獲取會員簽到記錄
export function GET_SIGNINLOG(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignInRecord",
    data,
    ...config
  });
}

// 會員簽到
export function SET_SIGNIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/signin/signin/userSignIn",
    data,
    isWriteIn: true,
    ...config
  });
}
