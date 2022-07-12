import $Request from "@/api/requset";

// 乾貨列表（首頁）
export function GET_THINGCIRCLELIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleList",
    data,
    ...config
  });
}

// 用戶乾貨信息（我的）
export function GET_THINGCIRCLEUSERINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleUser",
    data,
    ...config
  });
}

//用户乾貨列表（我的）
export function GET_THINGCIRCLEUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getUserThingList",
    data,
    ...config
  });
}

//乾貨詳情
export function GET_THINGCIRCLEDETAIL(data = {}, config = {}) {
  let urlLast =
    config.pageType == "video"
      ? "getThingcircleVideoDetail"
      : "getThingcircleDetail";
  return $Request({
    url: "/addons/thingcircle/thingcircle/" + urlLast,
    data,
    noLogin: true,
    isShowLoading: true,
    ...config
  });
}

export function GET_THINGCIRCLEVEDIODETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleVideoDetail",
    data,
    noLogin: true,
    ...config
  });
}

// 獲取用戶評論回復
export function GET_THINGCIRCLEREPLY(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleReply",
    data,
    ...config
  });
}

// 用戶關注
export function GET_THINGCIRCLEFOLLOW(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/attentionThingcircle",
    data,
    ...config
  });
}

// 用戶收藏
export function GET_THINGCIRCLECOLLECTION(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/collectionThingcircle",
    data,
    ...config
  });
}

// 获取用戶關注列表
export function GET_ATTENTIONUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/attentionUserList",
    data,
    ...config
  });
}

// 獲取用戶粉絲列表
export function GET_FANSUSERLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/fansUserList",
    data,
    ...config
  });
}

//發布乾貨
export function ADD_RELEASEDRY(data = {}, config = {}) {
  const url = data.thing_id
    ? "/addons/thingcircle/thingcircle/updateThingcircleWap"
    : "/addons/thingcircle/thingcircle/addThingcircleWap";
  return $Request({
    url: url,
    data,
    ...config
  });
}

//用戶點贊乾貨
export function GET_THINGCIRCLELIKES(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/likesThingcircle",
    data,
    ...config
  });
}

//評論乾貨
export function ADD_THINGCIRCLECOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/pushThingcircleComment",
    data,
    ...config
  });
}

//乾貨評論列表
export function GET_COMMENTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getComment",
    data,
    ...config
  });
}

//獲取舉報類型
export function GET_VIOLATIONLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getViolationList",
    data,
    ...config
  });
}

//用戶舉報
export function ADD_VIOLATION(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/addViolation",
    data,
    ...config
  });
}

//用戶回復
export function REPLY_THINGCIRCLECOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/replyThingcircleComment",
    data,
    ...config
  });
}

//刪除用戶評論
export function DEL_THINGCIRCLECOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/delComment",
    data,
    ...config
  });
}

//用戶點贊評論
export function GET_THINGCIRCLELIKESCOMMENT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/likesThingcircleComment",
    data,
    ...config
  });
}

//用戶推薦商品列表
export function GET_RECOMMENDGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getRecommendGoods",
    data,
    ...config
  });
}

//話題搜索列表（一級）
export function GET_TOPICLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getTopicList",
    data,
    ...config
  });
}

//話題列表（二級）
export function GET_NEXTTOPICLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getLowerTopicList",
    data,
    ...config
  });
}

//消息中心
export function GET_THINGCIRCLEMESSAGECENTER(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleMessageCenter",
    data,
    ...config
  });
}

//消息通知
export function GET_THINGCIRCLEMESSAGE(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleMessage",
    data,
    ...config
  });
}

//消息點贊和收藏
export function GET_THINGCIRCLELAC(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleLac",
    data,
    ...config
  });
}

//消息評論和@
export function GET_THINGCIRCLEAT(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getThingcircleComment",
    data,
    ...config
  });
}

//分享
export function GET_SHAREINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getShareInfo",
    data,
    ...config
  });
}

//獲取定位地址信息
export function GET_THINGCIRCLEAREA(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/getarea",
    data,
    ...config
  });
}

//獲取設置文案
export function GET_THINGCIRCLETEXTS(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/thingcircleCopyStyle",
    data,
    ...config
  });
}

//刪除乾貨
export function DEL_THINGCIRCLE(data = {}, config = {}) {
  return $Request({
    url: "/addons/thingcircle/thingcircle/delThingcircleForWap",
    data,
    ...config
  });
}
