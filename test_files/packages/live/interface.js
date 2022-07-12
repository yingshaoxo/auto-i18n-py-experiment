import $Request from "@/api/requset";

// 獲取觀看記錄
export function GET_LIVEHISTORYLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getWatchHistory",
    data,
    ...config
  });
}

// 獲取主播小店商品
export function GET_LIVESHOPGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorGoodsList",
    data,
    ...config
  });
}

// 獲取主播小店商品分類
export function GET_LIVESHOPGOODSCATEGORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getGoodsCate",
    data,
    ...config
  });
}

// 獲取主播小店商品分類 商品列表
export function GET_LIVESHOPGOODSCATEGORYGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/pickGoods",
    data,
    ...config
  });
}

// 主播挑選商品
export function GET_LIVEPICKGOODS(data = {}, config = {}) {
  let url = config.isPicked
    ? "/addons/liveshopping/liveshopping/canclePickGoods"
    : "/addons/liveshopping/liveshopping/actPickGoods";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 獲取粉絲列表
export function GET_LIVEFANSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getMyFans",
    data,
    ...config
  });
}

// 獲取關注列表
export function GET_LIVEFOCUSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getMyFocus",
    data,
    ...config
  });
}

// 設置關注
export function SET_LIVEFOCUS(data = {}, config = {}) {
  let url = config.isFocued
    ? "/addons/liveshopping/liveshopping/cancleFocus"
    : "/addons/liveshopping/liveshopping/addFocus";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 設置點贊
export function SET_LIVELIKE(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/addLikes",
    data,
    ...config
  });
}

// 獲取申請主播信息
export function GET_LIVEAPPLYANCHORINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/applyAnchor",
    data,
    ...config
  });
}

// 申請主播
export function APPLY_LIVEANCHOR(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actApplyAnchor",
    data,
    ...config
  });
}

// 獲取舉報類型
export function GET_LIVEREPORTVIOLATE(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getViolationType",
    data,
    ...config
  });
}

// 舉報直播間
export function REPORT_LIVEANCHOR(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/addLiveReport",
    data,
    ...config
  });
}

// 開播申請數據
export function GET_LIVEANCHORAPPLYINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getPlayData",
    data,
    errorCallback: true,
    ...config
  });
}

// 申請提交開播
export function APPLY_LIVEANCHORAPPLYPLAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/applyPlay",
    data,
    ...config
  });
}

// 獲取直播預告信息
export function GET_LIVEANCHORADVANCEINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAdvanceLiveData",
    data,
    ...config
  });
}

// 獲取主播端添加商品列表
export function GET_LIVEANCHORGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorGoodsForAdd",
    data,
    ...config
  });
}

// 直播端商品添加
export function SET_LIVEANCHORGOODS(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actAnchorAddGoods",
    data,
    ...config
  });
}

// 直播端商品移除
export function SET_LIVEANCHORGOODSCANCLE(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actAnchorCancleGoods",
    data,
    ...config
  });
}

// 直播端商品推薦
export function SET_LIVEANCHORGOODSRECOMMEND(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/recommendLiveGoods",
    data,
    ...config
  });
}

// 獲取主播端主播信息
export function GET_LIVEANCHORINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorInfo",
    data,
    ...config
  });
}

// 獲取推拉流地址
export function GET_LIVEPLAYERURL(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getLiveUrl",
    data,
    ...config
  });
}

// 下播
export function GET_LIVEANCHOREND(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/actEndLive",
    data,
    noCancel: true,
    ...config
  });
}

// 直播結束統計信息
export function SET_LIVEANCHORENDSTATISTIC(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/saveLiveCountInfo",
    data,
    ...config
  });
}

// 獲取直播結束統計信息
export function GET_LIVEANCHORENDSTATISTIC(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getliveEndData",
    data,
    ...config
  });
}

// 設置開播提醒
export function SET_LIVEREMIND(data = {}, config = {}) {
  let url = config.isRemind
    ? "/addons/liveshopping/liveshopping/addLiveRemind"
    : "/addons/liveshopping/liveshopping/cancleLiveRemind";
  return $Request({
    url: url,
    data,
    ...config
  });
}

// 獲取直播商品列表
export function GET_LIVEGOODSLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getAnchorLiveGoodsList",
    data,
    ...config
  });
}

// 獲取直播IM 用戶簽名
export function GET_LIVEUSERSIGN(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getUserSign",
    data,
    ...config
  });
}

//  記錄 失去連接時間
export function SET_LIVEDISCONNECTTIME(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/saveDisconnectTime",
    data,
    noCancel: true,
    ...config
  });
}

// 獲取直播间状态
export function GET_LIVEROOMSTATUS(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getPlatformLiveStatus",
    data,
    ...config
  });
}

// 保存直播間群組id
export function SAVE_LIVEIMGROUPID(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/saveImGroupId",
    data,
    ...config
  });
}

// 獲取禮物
export function GET_LIVEGIFTLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/getWapGiftList",
    data,
    ...config
  });
}

// 设置历史記錄
export function SET_LIVEWATCHHISTORY(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/addWatchHistory",
    data,
    ...config
  });
}

// 去除推流斷開時間
export function DEL_LIVEDISCONNECTTIME(data = {}, config = {}) {
  return $Request({
    url: "/addons/liveshopping/liveshopping/delDisconnectTime",
    data,
    ...config
  });
}
