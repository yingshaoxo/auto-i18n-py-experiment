import $Request from "@/api/requset";
import $UploadFile from "@/api/uploadFile";
import $Store from "@/store";

// 獲取商城配置
export function GET_CONFIG(data = {}, config = {}) {
  return $Request({
    url: "/config/newconfig",
    data,
    noCancel: true,
    showError: true,
    premise: true,
    noLogin: true,
    ...config
  });
}

// 獲取商城裝修數據
export function GET_CUSTOM(data = {}, config = {}) {
  return $Request({
    url: "/custom",
    data,
    noLogin: true,
    ...config
  });
}

// 獲取注冊協議
export function GET_REGISTERPROTOCOL(data = {}, config = {}) {
  return $Request({
    url: "/login/registerProtocol",
    data,
    noLogin: true,
    ...config
  });
}

// 上傳圖片
export function UPLOAD_IMAGES(data = {}, config = {}) {
  return $UploadFile({
    url: "/upload/uploadImage",
    ...data,
    isWriteIn: true,
    ...config
  });
}

// 獲取微信配置
export function GET_WXCONFIG(data = {}, config = {}) {
  return $Request({
    url: "/config/share",
    data,
    noLogin: true,
    noCancel: true,
    ...config
  });
}

// 獲取小程序太陽碼
export function GET_MPCODE(data = {}, config = {}) {
  let url =
    $Store.state.appName == "shopdds" || $Store.state.appName == "dds"
      ? "/miniprogram/getUnLimitMpCode"
      : "/addons/miniprogram/miniprogram/getUnLimitMpCode";
  return $Request({
    url,
    data,
    noLogin: true,
    ...config
  });
}

// 獲取換取太陽碼原始場景值
export function GET_MPCODESCENE(data = {}, config = {}) {
  let url =
    $Store.state.appName == "shopdds" || $Store.state.appName == "dds"
      ? "/miniprogram/exchangeMpOriginalScene"
      : "/addons/miniprogram/miniprogram/exchangeMpOriginalScene";
  return $Request({
    url,
    data,
    noLogin: true,
    ...config
  });
}

// 獲取區號
export function GET_AREACODE(data = {}, config = {}) {
  return $Request({
    url: "/config/getCountryCode",
    data,
    ...config
  });
}

// 獲取app下載頁
export function GET_APPVERSIONIFNO(data = {}, config = {}) {
  return $Request({
    url: "/addons/appshop/appshop/getNewVersion",
    data,
    noShowMessage: true,
    ...config
  });
}

// 獲取base64圖片資源
export function GET_IMGTOBASE64(data = {}, config = {}) {
  return $Request({
    url: "/config/imgtransform",
    data,
    ...config
  });
}
