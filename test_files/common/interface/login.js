import $Request from "@/api/requset";

// 登錄
export function LOGIN(data = {}, config = {}) {
  return $Request({
    url: "/login",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 退出登陸
export function LOGOUT(data = {}, config = {}) {
  return $Request({
    url: "/login/logout",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 注冊
export function REGISTER(data = {}, config = {}) {
  return $Request({
    url: "/login/register",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 發送驗證碼
export function GET_MSGCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/getVerificationCode",
    data,
    isShowLoading: true,
    ...config
  });
}
// 獲取圖片驗證碼
export function GET_IMGCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/captchaSrc",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 判斷手機是否存在
export function IS_HASMOBILE(data = {}, config = {}) {
  return $Request({
    url: "/login/mobile",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 獲取郵箱驗證碼
export function GET_EMAILCODE(data = {}, config = {}) {
  return $Request({
    url: "/login/getEmailVerificationCode",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 重設密碼
export function RESET_PASSWORD(data = {}, config = {}) {
  return $Request({
    url: "/login/resetPassword",
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}
// 第三方登錄  包含微信小程序，公眾號，app
export function OTHER_LOGIN(data = {}, config = {}) {
  let url = "/login/oauthLogin"; // 微信公眾號

  // #ifdef APP-PLUS
  url = "/login/oauthAppLogin";
  // #endif

  // #ifdef MP-WEIXIN
  url = "/login/oauthLogin";
  // #endif

  return $Request({
    url,
    data,
    noLogin: true,
    noCancel: true,
    ...config
  });
}
// 關聯賬戶
export function BIND_ACCOUNT(data = {}, config = {}) {
  return $Request({
    url: "/login/AssociateAccount",
    data,
    isShowLoading: true,
    ...config
  });
}
