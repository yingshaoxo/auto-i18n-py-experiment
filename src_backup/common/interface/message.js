import $Request from "@/api/requset";
import $UploadFile from "@/api/uploadFile";

// 客服信息
export function GET_QLKEFUINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/qlkefu/qlkefu/qlkefuInfo",
    data,
    ...config
  });
}

// 消息通知
export function GET_MESSAGENOTICELIST(data = {}, config = {}) {
  return $Request({
    url: "/member/getMpSystemMessage",
    data,
    ...config
  });
}

// 微店消息
export function MESSAGELIST(data = {}, config = {}) {
  return $Request({
    url: "/member/messageList",
    data,
    ...config
  });
}

// 微店历史留意消息详情
export function MESSAGEDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/member/messageDetail",
    data,
    ...config
  });
}

// 微店发送消息
export function SENDMESSAGE(data = {}, config = {}) {
  return $Request({
    url: "/member/sendMessage",
    data,
    ...config
  });
}

// 客服咨詢列表
export function GET_QLKEFUCHATLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/qlkefu/qlkefu/chatList",
    data,
    ...config
  });
}

// 客服驗證
export function GET_QLKEFUVERIFY(data = {}, config = {}) {
  return $Request({
    url: "/customerapi/index/verifyInfo",
    data,
    errorCallback: true,
    isShowLoading: true,
    ...config
  });
}

// 客服聊天記錄
export function GET_QLKEFUCHATLOG(data = {}, config = {}) {
  return $Request({
    url: "/customerapi/index/getChatLog",
    data,
    ...config
  });
}

// 客服更新訪客信息
export function GET_QLKEFUUPDATEUSER(data = {}, config = {}) {
  return $Request({
    url: "/customerapi/index/updateUserInfo",
    data,
    ...config
  });
}

// 客服聊天上傳圖片
export function GET_QLKEFUUPADIMG(data = {}, config = {}) {
  return $UploadFile({
    url: "/index/upload/uploadImg",
    ...data,
    ...config
  });
}
