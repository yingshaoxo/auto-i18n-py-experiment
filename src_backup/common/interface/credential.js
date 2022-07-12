import $Request from "@/api/requset";

//查詢證書頁
export function GET_SEARCHCREDENTIAL(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/searchUserCredentialPage",
    data,
    isWriteIn: true,
    ...config
  });
}

//授權證書查詢結果
export function GET_CREDENTIALRESULT(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/searchUserCredential",
    data,
    isWriteIn: true,
    noShowMessage: true,
    ...config
  });
}

//獲取授權證書
export function GET_CREDENTIAL(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/getUserCredential",
    data,
    isWriteIn: true,
    ...config
  });
}

//活獲取證書是否設置過微信號
export function GET_USERWECHAT(data = {}, config = {}) {
  return $Request({
    url: "/addons/credential/credential/getUserWchat",
    data,
    ...config
  });
}
