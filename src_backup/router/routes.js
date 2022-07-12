export default {
  "pages-mall-index": {
    path: "/pages/mall/index",
    name: "pages-mall-index",
    alias: ["/", "/mall", "/mall/index", "pages/index/index"],
    meta: {
      id: 1,
      name: "pages-mall-index",
      isNVue: false,
      pagePath: "pages/mall/index",
      isQuit: true,
      isEntry: true,
      isTabBar: true,
      tabBarIndex: 0,
      windowTop: 44,
      possTabBar: true,
      noLogin: true
    },
    title: "商城首頁"
  },
  "pages-mall-cart": {
    path: "/pages/mall/cart",
    name: "pages-mall-cart",
    alias: ["/mall/cart", "pages/shopcart/index"],
    meta: {
      id: 2,
      name: "pages-mall-cart",
      isNVue: false,
      pagePath: "pages/mall/cart",
      isQuit: true,
      isTabBar: true,
      tabBarIndex: 3,
      windowTop: 44,
      possTabBar: true,
      noLogin: true
    },
    title: "購物車"
  },
  "pages-goods-list": {
    path: "/pages/goods/list",
    name: "pages-goods-list",
    alias: ["/goods/list", "pages/goodlist/index"],
    meta: {
      name: "pages-goods-list",
      isNVue: false,
      pagePath: "pages/goods/list",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current"
    },
    title: "商品列表"
  },
  "pages-goods-category": {
    path: "/pages/goods/category",
    name: "pages-goods-category",
    alias: ["/goods/category", "pages/category/index"],
    meta: {
      id: 3,
      name: "pages-goods-category",
      isNVue: false,
      pagePath: "pages/goods/category",
      isQuit: true,
      isTabBar: true,
      tabBarIndex: 1,
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current"
    },
    title: "商品分類"
  },
  "pages-order-list": {
    path: "/pages/order/list",
    name: "pages-order-list",
    alias: ["/order/list", "pages/order/list/index"],
    meta: {
      name: "pages-order-list",
      isNVue: false,
      pagePath: "pages/order/list",
      windowTop: 44,
      possTabBar: true
    },
    title: "訂單列表"
  },
  "pages-member-index": {
    path: "/pages/member/index",
    name: "pages-member-index",
    alias: ["/member/centre", "pages/member/index"],
    meta: {
      id: 4,
      name: "pages-member-index",
      isNVue: false,
      pagePath: "pages/member/index",
      isQuit: true,
      isTabBar: true,
      tabBarIndex: 4,
      windowTop: 44,
      possTabBar: true,
      shareType: "current"
    },
    title: "會員中心"
  },
  "pages-property-index": {
    path: "/pages/property/index",
    name: "pages-property-index",
    alias: ["/property/centre", "pages/property/myProperty/index"],
    meta: {
      name: "pages-property-index",
      isNVue: false,
      pagePath: "pages/property/index",
      windowTop: 44,
      possTabBar: true
    },
    title: "我的資產"
  },
  "pages-coupon-index": {
    path: "/pages/coupon/index",
    name: "pages-coupon-index",
    alias: ["/coupon/centre", "pages/coupon/centre/index"],
    meta: {
      name: "pages-coupon-index",
      isNVue: false,
      pagePath: "pages/coupon/index",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "coupontype"
    },
    title: "領券中心"
  },
  "pages-shop-list": {
    path: "/pages/shop/list",
    name: "pages-shop-list",
    alias: ["/shop/list", "pages/shop/list/index"],
    meta: {
      id: 5,
      name: "pages-shop-list",
      isNVue: false,
      pagePath: "pages/shop/list",
      isQuit: true,
      isTabBar: true,
      tabBarIndex: 2,
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "shop"
    },
    title: "店鋪街"
  },
  "pages-smallshop-list": {
    path: "/pages/smallshop/list",
    name: "pages-smallshop-list",
    meta: {
      name: "pages-smallshop-list",
      isNVue: false,
      pagePath: "pages/smallshop/list",
      isQuit: true,
      isTabBar: true,
      tabBarIndex: 2,
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current"
    },
    title: "店鋪街"
  },
  "pages-store-list": {
    path: "/pages/store/list",
    name: "pages-store-list",
    alias: ["/store/list"],
    meta: {
      name: "pages-store-list",
      isNVue: false,
      pagePath: "pages/store/list",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "store"
    },
    title: "門店列表"
  },
  "pages-distribute-index": {
    path: "/pages/distribute/index",
    name: "pages-distribute-index",
    alias: ["/commission/centre", "pages/commission/centre/index"],
    meta: {
      name: "pages-distribute-index",
      isNVue: false,
      pagePath: "pages/distribute/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "distribution"
    },
    title: "分銷中心"
  },
  "pages-bonus-index": {
    path: "/pages/bonus/index",
    name: "pages-bonus-index",
    alias: ["/bonus/centre", "pages/bonus/centre/index"],
    meta: {
      name: "pages-bonus-index",
      isNVue: false,
      pagePath: "pages/bonus/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "分紅中心"
  },
  "pages-channel-index": {
    path: "/pages/channel/index",
    name: "pages-channel-index",
    alias: ["/channel/centre", "pages/channel/centre/index"],
    meta: {
      name: "pages-channel-index",
      isNVue: false,
      pagePath: "pages/channel/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "channel"
    },
    title: "微商中心"
  },
  "pages-agent-index": {
    path: "/pages/agent/index",
    name: "pages-agent-index",
    meta: {
      name: "pages-agent-index",
      isNVue: false,
      pagePath: "pages/agent/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "agent"
    },
    title: "代理中心"
  },
  "pages-microshop-index": {
    path: "/pages/microshop/index",
    name: "pages-microshop-index",
    alias: ["/microshop/centre", "pages/microshop/centre/centre"],
    meta: {
      name: "pages-microshop-index",
      isNVue: false,
      pagePath: "pages/microshop/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "microshop"
    },
    title: "微店中心"
  },
  "pages-integral-index": {
    path: "/pages/integral/index",
    name: "pages-integral-index",
    alias: ["/integral/index", "pages/integral/index/index"],
    meta: {
      name: "pages-integral-index",
      isNVue: false,
      pagePath: "pages/integral/index",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "積分商城"
  },
  "pages-thingcircle-index": {
    path: "/pages/thingcircle/index",
    name: "pages-thingcircle-index",
    alias: ["/thingcircle/index"],
    meta: {
      name: "pages-thingcircle-index",
      isNVue: false,
      pagePath: "pages/thingcircle/index",
      windowTop: 44,
      possTabBar: true,
      noLogin: true,
      shareType: "current",
      addon: "thingcircle"
    },
    title: "好物圈"
  },
  "pages-blockchain-list": {
    path: "/pages/blockchain/list",
    name: "pages-blockchain-list",
    alias: ["/blockchain"],
    meta: {
      name: "pages-blockchain-list",
      isNVue: false,
      pagePath: "pages/blockchain/list",
      windowTop: 44,
      possTabBar: true,
      addon: "blockchain"
    },
    title: "數字資產"
  },
  "pages-message-index": {
    path: "/pages/message/index",
    name: "pages-message-index",
    alias: ["/message"],
    meta: {
      name: "pages-message-index",
      isNVue: false,
      pagePath: "pages/message/index",
      windowTop: 44,
      possTabBar: true
    },
    title: "消息中心"
  },
  "pages-task-index": {
    path: "/pages/task/index",
    name: "pages-task-index",
    alias: ["/task/centre", "pages/task/centre/index"],
    meta: {
      name: "pages-task-index",
      isNVue: false,
      pagePath: "pages/task/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "taskcenter"
    },
    title: "任務中心"
  },
  "pages-signin-index": {
    path: "/pages/signin/index",
    name: "pages-signin-index",
    alias: ["/signin", "/signin/index", "pages/signin/index/index"],
    meta: {
      name: "pages-signin-index",
      isNVue: false,
      pagePath: "pages/signin/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "signin"
    },
    title: "每日簽到"
  },
  "pages-help-index": {
    path: "/pages/help/index",
    name: "pages-help-index",
    meta: {
      name: "pages-help-index",
      isNVue: false,
      pagePath: "pages/help/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "helpcenter"
    },
    title: "幫助中心"
  },
  "pages-mplive-index": {
    path: "/pages/mplive/index",
    name: "pages-mplive-index",
    meta: {
      name: "pages-mplive-index",
      isNVue: false,
      pagePath: "pages/mplive/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      noLogin: true,
      addon: "mplive"
    },
    title: "小程序直播"
  },
  "pages-live-index": {
    path: "/pages/live/index",
    name: "pages-live-index",
    meta: {
      name: "pages-live-index",
      isNVue: false,
      pagePath: "pages/live/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      noLogin: true,
      addon: "liveshopping"
    },
    title: "直播列表"
  },
  "pages-merchant-index": {
    path: "/pages/merchant/index",
    name: "pages-merchant-index",
    meta: {
      name: "pages-merchant-index",
      isNVue: false,
      pagePath: "pages/merchant/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "merchants"
    },
    title: "招商中心"
  },

  "packages-mall-search": {
    path: "/packages/mall/search",
    name: "packages-mall-search",
    meta: {
      name: "packages-mall-search",
      isNVue: false,
      pagePath: "packages/mall/search",
      windowTop: 44,
      noLogin: true
    },
    title: "搜索"
  },
  "packages-mall-diy": {
    path: "/packages/mall/diy",
    name: "packages-mall-diy",
    meta: {
      name: "packages-mall-diy",
      isNVue: false,
      pagePath: "packages/mall/diy",
      windowTop: 44,
      noLogin: true,
      shareType: "current"
    },
    title: "自定義頁面",
    paramExplain: "page_id:頁面id"
  },
  "packages-mall-notice": {
    path: "/packages/mall/notice",
    name: "packages-mall-notice",
    meta: {
      name: "packages-mall-notice",
      isNVue: false,
      pagePath: "packages/mall/notice",
      windowTop: 44,
      noLogin: true
    },
    title: ""
  },
  "packages-mall-contract": {
    path: "/packages/mall/contract",
    name: "packages-mall-contract",
    meta: {
      name: "packages-mall-contract",
      isNVue: false,
      pagePath: "packages/mall/contract",
      windowTop: 44,
      noLogin: true
    },
    title: "協議"
  },
  "packages-mall-download": {
    path: "/packages/mall/download",
    name: "packages-mall-download",
    meta: {
      name: "packages-mall-download",
      isNVue: false,
      pagePath: "packages/mall/download",
      windowTop: 44,
      noLogin: true
    },
    title: "下載"
  },
  "packages-goods-detail": {
    path: "/packages/goods/detail",
    name: "packages-goods-detail",
    meta: {
      name: "packages-goods-detail",
      isNVue: false,
      pagePath: "packages/goods/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current"
    },
    title: "商品詳情",
    paramExplain: "goods_id:商品id"
  },
  "packages-goods-screen": {
    path: "/packages/goods/screen",
    name: "packages-goods-screen",
    meta: {
      name: "packages-goods-screen",
      isNVue: false,
      pagePath: "packages/goods/screen",
      windowTop: 44,
      noLogin: true,
      shareType: "current"
    },
    title: "商品列表",
    paramExplain: "goods_ids:商品id組"
  },
  "packages-goods-collect": {
    path: "/packages/goods/collect",
    name: "packages-goods-collect",
    alias: ["/goods/collection", "pages/goods/collection/index"],
    meta: {
      name: "packages-goods-collect",
      isNVue: false,
      pagePath: "packages/goods/collect",
      windowTop: 44
    },
    title: "商品收藏"
  },
  "packages-goods-share": {
    path: "/packages/goods/share",
    name: "packages-goods-share",
    meta: {
      name: "packages-goods-share",
      isNVue: false,
      pagePath: "packages/goods/share",
      windowTop: 44
    },
    title: "商品分享",
    paramExplain: "goods_id:商品id"
  },
  "packages-goods-schedule": {
    path: "/packages/goods/schedule",
    name: "packages-goods-schedule",
    meta: {
      name: "packages-goods-schedule",
      isNVue: false,
      pagePath: "packages/goods/schedule",
      windowTop: 44,
      shareType: "current"
    },
    title: "預約詳情",
    paramExplain: "custom_id"
  },
  "packages-goods-evaluate": {
    path: "/packages/goods/evaluate",
    name: "packages-goods-evaluate",
    meta: {
      name: "packages-goods-evaluate",
      isNVue: false,
      pagePath: "packages/goods/evaluate",
      windowTop: 44,
      noLogin: true
    },
    title: "評價",
    paramExplain: "goods_id"
  },
  "packages-login-index": {
    path: "/packages/login/index",
    name: "packages-login-index",
    meta: {
      name: "packages-login-index",
      isNVue: false,
      pagePath: "packages/login/index",
      windowTop: 44,
      noLogin: true
    },
    title: "登錄"
  },
  "packages-login-register": {
    path: "/packages/login/register",
    name: "packages-login-register",
    meta: {
      name: "packages-login-register",
      isNVue: false,
      pagePath: "packages/login/register",
      windowTop: 44,
      noLogin: true
    },
    title: "會員注冊"
  },
  "packages-login-forget": {
    path: "/packages/login/forget",
    name: "packages-login-forget",
    meta: {
      name: "packages-login-forget",
      isNVue: false,
      pagePath: "packages/login/forget",
      windowTop: 44,
      noLogin: true
    },
    title: "忘記密碼"
  },
  "pay-payment": {
    path: "/pay/payment",
    name: "pay-payment",
    meta: {
      name: "pay-payment",
      isNVue: false,
      pagePath: "/pay/payment",
      windowTop: 44,
      refresh: true
    },
    title: "收銀臺",
    paramExplain: "out_trade_no:交易號"
  },
  "pay-level": {
    path: "/pay/level",
    name: "pay-level",
    meta: {
      name: "pay-level",
      isNVue: false,
      pagePath: "/pay/level",
      windowTop: 44,
      refresh: true
    },
    title: "收銀臺",
    paramExplain: "out_trade_no:交易號"
  },
  "pay-wallet": {
    path: "/pay/wallet",
    name: "pay-wallet",
    meta: {
      name: "pay-wallet",
      isNVue: false,
      pagePath: "/pay/wallet",
      windowTop: 44,
      refresh: true
    },
    title: "收銀臺",
    paramExplain: "out_trade_no:交易號"
  },
  "pay-membercard": {
    path: "/pay/membercard",
    name: "pay-membercard",
    meta: {
      name: "pay-membercard",
      isNVue: false,
      pagePath: "/pay/membercard",
      windowTop: 44,
      refresh: true
    },
    title: "收銀臺",
    paramExplain: "out_trade_no:交易號"
  },
  "packages-pay-payment": {
    path: "/packages/pay/payment",
    name: "packages-pay-payment",
    meta: {
      name: "packages-pay-payment",
      isNVue: false,
      pagePath: "packages/pay/payment",
      windowTop: 44,
      refresh: true
    },
    title: "收銀臺",
    paramExplain: "out_trade_no:交易號"
  },
  "packages-pay-result": {
    path: "/packages/pay/result",
    name: "packages-pay-result",
    meta: {
      name: "packages-pay-result",
      isNVue: false,
      pagePath: "packages/pay/result",
      windowTop: 44
    },
    title: "支付結果",
    paramExplain: "out_trade_no:交易號"
  },
  "packages-pay-guide": {
    path: "/packages/pay/guide",
    name: "packages-pay-guide",
    meta: {
      name: "packages-pay-guide",
      isNVue: false,
      pagePath: "packages/pay/guide",
      windowTop: 44,
      noLogin: true
    },
    title: "支付提示",
    paramExplain: "param:支付提示所需參數object"
  },
  "packages-pay-wallet": {
    path: "/packages/pay/wallet",
    name: "packages-pay-wallet",
    meta: {
      name: "packages-pay-wallet",
      isNVue: false,
      pagePath: "packages/pay/wallet",
      windowTop: 44,
      refresh: true
    },
    title: "創建錢包"
  },
  "packages-order-confirm": {
    path: "/packages/order/confirm",
    name: "packages-order-confirm",
    meta: {
      name: "packages-order-confirm",
      isNVue: false,
      pagePath: "packages/order/confirm",
      windowTop: 44
    },
    title: "確認訂單",
    paramExplain: "param:確認訂單所需参数object"
  },
  "packages-order-detail": {
    path: "/packages/order/detail",
    name: "packages-order-detail",
    meta: {
      name: "packages-order-detail",
      isNVue: false,
      pagePath: "packages/order/detail",
      windowTop: 44
    },
    title: "訂單詳情",
    paramExplain: "order_id:訂單id"
  },
  "packages-order-post": {
    path: "/packages/order/post",
    name: "packages-order-post",
    meta: {
      name: "packages-order-post",
      isNVue: false,
      pagePath: "packages/order/post",
      windowTop: 44
    },
    title: "退貨退款",
    paramExplain: "param:退貨退款訂單所需参数object"
  },
  "packages-order-logistics": {
    path: "/packages/order/logistics",
    name: "packages-order-logistics",
    meta: {
      name: "packages-order-logistics",
      isNVue: false,
      pagePath: "packages/order/logistics",
      windowTop: 44
    },
    title: "物流信息",
    paramExplain: "order_id:訂單id"
  },
  "packages-order-evaluate": {
    path: "/packages/order/evaluate",
    name: "packages-order-evaluate",
    meta: {
      name: "packages-order-evaluate",
      isNVue: false,
      pagePath: "packages/order/evaluate",
      windowTop: 44
    },
    title: "商品評價",
    paramExplain: "param:訂單信息所需参数object"
  },
  "packages-member-set": {
    path: "/packages/member/set",
    name: "packages-member-set",
    meta: {
      name: "packages-member-set",
      isNVue: false,
      pagePath: "packages/member/set",
      windowTop: 44
    },
    title: "賬號設置"
  },
  "packages-member-info": {
    path: "/packages/member/info",
    name: "packages-member-info",
    meta: {
      name: "packages-member-info",
      isNVue: false,
      pagePath: "packages/member/info",
      windowTop: 44
    },
    title: "基本信息"
  },
  "packages-member-avatar": {
    path: "/packages/member/avatar",
    name: "packages-member-avatar",
    meta: {
      name: "packages-member-avatar",
      isNVue: false,
      pagePath: "packages/member/avatar",
      windowTop: 44
    },
    title: "修改頭像"
  },
  "packages-member-post": {
    path: "/packages/member/post",
    name: "packages-member-post",
    meta: {
      name: "packages-member-post",
      isNVue: false,
      pagePath: "packages/member/post",
      windowTop: 44
    },
    title: "賬號修改"
  },
  "packages-member-relevant": {
    path: "/packages/member/relevant",
    name: "packages-member-relevant",
    meta: {
      name: "packages-member-relevant",
      isNVue: false,
      pagePath: "packages/member/relevant",
      windowTop: 44
    },
    title: "關聯賬號"
  },
  "packages-member-level": {
    path: "/packages/member/level",
    name: "packages-member-level",
    meta: {
      name: "packages-member-level",
      isNVue: false,
      pagePath: "packages/member/level",
      windowTop: 44
    },
    title: "等級詳情"
  },
  "packages-member-address-list": {
    path: "/packages/member/address/list",
    name: "packages-member-address-list",
    meta: {
      name: "packages-member-address-list",
      isNVue: false,
      pagePath: "packages/member/address/list",
      windowTop: 44
    },
    title: "收貨地址"
  },
  "packages-member-address-post": {
    path: "/packages/member/address/post",
    name: "packages-member-address-post",
    meta: {
      name: "packages-member-address-post",
      isNVue: false,
      pagePath: "packages/member/address/post",
      windowTop: 44
    },
    title: "編輯收貨地址",
    paramExplain: "type:編輯還是添加"
  },
  "packages-member-invoice-list": {
    path: "/packages/member/invoice/list",
    name: "packages-member-invoice-list",
    meta: {
      name: "packages-member-invoice-list",
      isNVue: false,
      pagePath: "packages/member/invoice/list",
      windowTop: 44
    },
    title: "發票抬頭管理"
  },
  "packages-member-invoice-post": {
    path: "/packages/member/invoice/post",
    name: "packages-member-invoice-post",
    meta: {
      name: "packages-member-invoice-post",
      isNVue: false,
      pagePath: "packages/member/invoice/post",
      windowTop: 44
    },
    title: "編輯發票抬頭"
  },
  "packages-property-account-list": {
    path: "/packages/property/account/list",
    name: "packages-property-account-list",
    meta: {
      name: "packages-property-account-list",
      isNVue: false,
      pagePath: "packages/property/account/list",
      windowTop: 44
    },
    title: "賬戶列表"
  },
  "packages-property-account-post": {
    path: "/packages/property/account/post",
    name: "packages-property-account-post",
    meta: {
      name: "packages-property-account-post",
      isNVue: false,
      pagePath: "packages/property/account/post",
      windowTop: 44
    },
    title: "編輯賬戶",
    paramExplain: "type:編輯還是添加,param:編輯賬戶所需参数object"
  },
  "packages-property-account-detail": {
    path: "/packages/property/account/detail",
    name: "packages-property-account-detail",
    meta: {
      name: "packages-property-account-detail",
      isNVue: false,
      pagePath: "packages/property/account/detail",
      windowTop: 44
    },
    title: "賬戶詳情",
    paramExplain: "param:賬戶詳情所需参数object"
  },
  "packages-property-balance": {
    path: "/packages/property/balance",
    name: "packages-property-balance",
    meta: {
      name: "packages-property-balance",
      isNVue: false,
      pagePath: "packages/property/balance",
      windowTop: 44
    },
    title: "餘額"
  },
  "packages-property-log-list": {
    path: "/packages/property/log/list",
    name: "packages-property-log-list",
    meta: {
      name: "packages-property-log-list",
      isNVue: false,
      pagePath: "packages/property/log/list",
      windowTop: 44
    },
    title: "餘額明細"
  },
  "packages-property-log-detail": {
    path: "/packages/property/log/detail",
    name: "packages-property-log-detail",
    meta: {
      name: "packages-property-log-detail",
      isNVue: false,
      pagePath: "packages/property/log/detail",
      windowTop: 44
    },
    title: "餘額詳情",
    paramExplain: "detail_id:詳情id"
  },
  "packages-property-recharge": {
    path: "/packages/property/recharge",
    name: "packages-property-recharge",
    meta: {
      name: "packages-property-recharge",
      isNVue: false,
      pagePath: "packages/property/recharge",
      windowTop: 44
    },
    title: "充值"
  },
  "packages-property-withdraw": {
    path: "/packages/property/withdraw",
    name: "packages-property-withdraw",
    meta: {
      name: "packages-property-withdraw",
      isNVue: false,
      pagePath: "packages/property/withdraw",
      windowTop: 44
    },
    title: "提現"
  },
  "packages-property-points": {
    path: "/packages/property/points",
    name: "packages-property-points",
    meta: {
      name: "packages-property-points",
      isNVue: false,
      pagePath: "packages/property/points",
      windowTop: 44
    },
    title: "積分"
  },
  "packages-property-exchange": {
    path: "/packages/property/exchange",
    name: "packages-property-exchange",
    meta: {
      name: "packages-property-exchange",
      isNVue: false,
      pagePath: "packages/property/exchange",
      windowTop: 44
    },
    title: "兌換"
  },
  "packages-property-transfer": {
    path: "/packages/property/transfer",
    name: "packages-property-transfer",
    meta: {
      name: "packages-property-transfer",
      isNVue: false,
      pagePath: "packages/property/transfer",
      windowTop: 44
    },
    title: "轉賬"
  },
  "packages-property-integraltransfer": {
    path: "/packages/property/integraltransfer",
    name: "packages-property-integraltransfer",
    meta: {
      name: "packages-property-integraltransfer",
      isNVue: false,
      pagePath: "packages/property/integraltransfer",
      windowTop: 44
    },
    title: "積分转赠"
  },
  "packages-shop-home": {
    path: "/packages/shop/home",
    name: "packages-shop-home",
    meta: {
      name: "packages-shop-home",
      isNVue: false,
      pagePath: "packages/shop/home",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "shop"
    },
    title: "店鋪首頁",
    paramExplain: "shop_id:店鋪id"
  },
  "packages-shop-collect": {
    path: "/packages/shop/collect",
    name: "packages-shop-collect",
    meta: {
      name: "packages-shop-collect",
      isNVue: false,
      pagePath: "packages/shop/collect",
      windowTop: 44
    },
    title: "店鋪收藏",
    addon: "shop"
  },
  "packages-shop-search": {
    path: "/packages/shop/search",
    name: "packages-shop-search",
    meta: {
      name: "packages-shop-search",
      isNVue: false,
      pagePath: "packages/shop/search",
      windowTop: 44,
      noLogin: true,
      addon: "shop"
    },
    title: "店鋪搜索"
  },
  "packages-shop-contact": {
    path: "/packages/shop/contact",
    name: "packages-shop-contact",
    meta: {
      name: "packages-shop-contact",
      isNVue: false,
      pagePath: "packages/shop/contact",
      windowTop: 44,
      noLogin: true,
    },
    title: "聯繫我們"
  },
  "packages-shop-business-index": {
    path: "/packages/shop/business/index",
    name: "packages-shop-business-index",
    meta: {
      name: "packages-shop-business-index",
      isNVue: false,
      pagePath: "packages/shop/business/index",
      windowTop: 44,
      possTabBar: true,
      addon: "shop"
    },
    title: "商家中心"
  },
  "packages-shop-business-apply": {
    path: "/packages/shop/business/apply",
    name: "packages-shop-business-apply",
    meta: {
      name: "packages-shop-business-apply",
      isNVue: false,
      pagePath: "packages/shop/business/apply",
      windowTop: 44,
      possTabBar: true,
      addon: "shop"
    },
    title: "商家入駐"
  },
  "packages-shop-business-result": {
    path: "/packages/shop/business/result",
    name: "packages-shop-business-result",
    meta: {
      name: "packages-shop-business-result",
      isNVue: false,
      pagePath: "packages/shop/business/result",
      windowTop: 44,
      addon: "shop"
    },
    title: "申請狀態"
  },
  "packages-store-home": {
    path: "/packages/store/home",
    name: "packages-store-home",
    meta: {
      name: "packages-store-home",
      isNVue: false,
      pagePath: "packages/store/home",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "store"
    },
    title: "門店首頁",
    paramExplain: "store_id:門店id"
  },
  "packages-store-search": {
    path: "/packages/store/search",
    name: "packages-store-search",
    meta: {
      name: "packages-store-search",
      isNVue: false,
      pagePath: "packages/store/search",
      windowTop: 44,
      noLogin: true,
      addon: "store"
    },
    title: "門店搜索"
  },
  "packages-coupon-list": {
    path: "/packages/coupon/list",
    name: "packages-coupon-list",
    meta: {
      name: "packages-coupon-list",
      isNVue: false,
      pagePath: "packages/coupon/list",
      windowTop: 44,
      addon: "coupontype"
    },
    title: "我的優惠券"
  },
  "packages-coupon-detail": {
    path: "/packages/coupon/detail",
    name: "packages-coupon-detail",
    meta: {
      name: "packages-coupon-detail",
      isNVue: false,
      pagePath: "packages/coupon/detail",
      windowTop: 44,
      addon: "coupontype"
    },
    title: "優惠券詳情",
    paramExplain: "coupon_id:優惠券id"
  },
  "packages-coupon-receive": {
    path: "/packages/coupon/receive",
    name: "packages-coupon-receive",
    meta: {
      name: "packages-coupon-receive",
      isNVue: false,
      pagePath: "packages/coupon/receive",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "coupontype"
    },
    title: "領取優惠券",
    paramExplain: "coupon_id:優惠券id"
  },
  "packages-distribute-apply": {
    path: "/packages/distribute/apply",
    name: "packages-distribute-apply",
    meta: {
      name: "packages-distribute-apply",
      isNVue: false,
      pagePath: "packages/distribute/apply",
      windowTop: 44,
      addon: "distribution"
    },
    title: "申請分銷商"
  },
  "packages-distribute-qrcode": {
    path: "/packages/distribute/qrcode",
    name: "packages-distribute-qrcode",
    meta: {
      name: "packages-distribute-qrcode",
      isNVue: false,
      pagePath: "packages/distribute/qrcode",
      windowTop: 44,
      addon: "distribution"
    },
    title: "推廣碼"
  },
  "packages-distribute-detail": {
    path: "/packages/distribute/detail",
    name: "packages-distribute-detail",
    meta: {
      name: "packages-distribute-detail",
      isNVue: false,
      pagePath: "packages/distribute/detail",
      windowTop: 44,
      addon: "distribution"
    },
    title: "佣金"
  },
  "packages-distribute-log": {
    path: "/packages/distribute/log",
    name: "packages-distribute-log",
    meta: {
      name: "packages-distribute-log",
      isNVue: false,
      pagePath: "packages/distribute/log",
      windowTop: 44,
      addon: "distribution"
    },
    title: "佣金明細"
  },
  "packages-distribute-order": {
    path: "/packages/distribute/order",
    name: "packages-distribute-order",
    meta: {
      name: "packages-distribute-order",
      isNVue: false,
      pagePath: "packages/distribute/order",
      windowTop: 44,
      addon: "distribution"
    },
    title: "分销訂單"
  },
  "packages-distribute-team": {
    path: "/packages/distribute/team",
    name: "packages-distribute-team",
    meta: {
      name: "packages-distribute-team",
      isNVue: false,
      pagePath: "packages/distribute/team",
      windowTop: 44,
      addon: "distribution"
    },
    title: "我的團隊"
  },
  "packages-distribute-customer": {
    path: "/packages/distribute/customer",
    name: "packages-distribute-customer",
    meta: {
      name: "packages-distribute-customer",
      isNVue: false,
      pagePath: "packages/distribute/customer",
      windowTop: 44,
      addon: "distribution"
    },
    title: "我的客戶"
  },
  "packages-distribute-withdraw": {
    path: "/packages/distribute/withdraw",
    name: "packages-distribute-withdraw",
    meta: {
      name: "packages-distribute-withdraw",
      isNVue: false,
      pagePath: "packages/distribute/withdraw",
      windowTop: 44,
      addon: "distribution"
    },
    title: "佣金提現"
  },
  "packages-distribute-credential": {
    path: "/packages/distribute/credential",
    name: "packages-distribute-credential",
    meta: {
      name: "packages-distribute-credential",
      isNVue: false,
      pagePath: "packages/distribute/credential",
      windowTop: 44,
      addon: "distribution"
    },
    title: "授權證書"
  },
  "packages-distribute-ranking": {
    path: "/packages/distribute/ranking",
    name: "packages-distribute-ranking",
    meta: {
      name: "packages-distribute-ranking",
      isNVue: false,
      pagePath: "packages/distribute/ranking",
      windowTop: 44,
      addon: "distribution"
    },
    title: "排行榜"
  },
  "packages-distribute-level": {
    path: "/packages/distribute/level",
    name: "packages-distribute-level",
    meta: {
      name: "packages-distribute-level",
      isNVue: false,
      pagePath: "packages/distribute/level",
      windowTop: 44,
      addon: "distribution"
    },
    title: "等級詳情"
  },
  "packages-bonus-apply": {
    path: "/packages/bonus/apply",
    name: "packages-bonus-apply",
    meta: {
      name: "packages-bonus-apply",
      isNVue: false,
      pagePath: "packages/bonus/apply",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "申請分銷商"
  },
  "packages-bonus-detail": {
    path: "/packages/bonus/detail",
    name: "packages-bonus-detail",
    meta: {
      name: "packages-bonus-detail",
      isNVue: false,
      pagePath: "packages/bonus/detail",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "分紅金額"
  },
  "packages-bonus-log": {
    path: "/packages/bonus/log",
    name: "packages-bonus-log",
    meta: {
      name: "packages-bonus-log",
      isNVue: false,
      pagePath: "packages/bonus/log",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "分紅明細"
  },
  "packages-bonus-order": {
    path: "/packages/bonus/order",
    name: "packages-bonus-order",
    meta: {
      name: "packages-bonus-order",
      isNVue: false,
      pagePath: "packages/bonus/order",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "分红訂單"
  },
  "packages-bonus-credential": {
    path: "/packages/bonus/credential",
    name: "packages-bonus-credential",
    meta: {
      name: "packages-bonus-credential",
      isNVue: false,
      pagePath: "packages/bonus/credential",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "授權證書"
  },
  "packages-bonus-level": {
    path: "/packages/bonus/level",
    name: "packages-bonus-level",
    meta: {
      name: "packages-bonus-level",
      isNVue: false,
      pagePath: "packages/bonus/level",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "等級詳情",
    paramExplain: "type:等級類型"
  },
  "packages-bonus-delivery-list": {
    path: "/packages/bonus/delivery/list",
    name: "packages-bonus-delivery-list",
    meta: {
      name: "packages-bonus-delivery-list",
      isNVue: false,
      pagePath: "packages/bonus/delivery/list",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "发货訂單",
    paramExplain: ""
  },
  "packages-bonus-delivery-post": {
    path: "/packages/bonus/delivery/post",
    name: "packages-bonus-delivery-post",
    meta: {
      name: "packages-bonus-delivery-post",
      isNVue: false,
      pagePath: "packages/bonus/delivery/post",
      windowTop: 44,
      addon: ["areabonus", "globalbonus", "teambonus"]
    },
    title: "訂單发货",
    paramExplain: ""
  },
  "packages-channel-apply": {
    path: "/packages/channel/apply",
    name: "packages-channel-apply",
    meta: {
      name: "packages-channel-apply",
      isNVue: false,
      pagePath: "packages/channel/apply",
      windowTop: 44,
      addon: "channel"
    },
    title: "申請分銷商"
  },
  "packages-channel-goods": {
    path: "/packages/channel/goods",
    name: "packages-channel-goods",
    meta: {
      name: "packages-channel-goods",
      isNVue: false,
      pagePath: "packages/channel/goods",
      windowTop: 44,
      addon: "channel"
    },
    title: "商品",
    paramExplain: "type:商品類型(采購/提貨)"
  },
  "packages-channel-team": {
    path: "/packages/channel/team",
    name: "packages-channel-team",
    meta: {
      name: "packages-channel-team",
      isNVue: false,
      pagePath: "packages/channel/team",
      windowTop: 44,
      addon: "channel"
    },
    title: "我的團隊"
  },
  "packages-channel-depot-index": {
    path: "/packages/channel/depot/index",
    name: "packages-channel-depot-index",
    meta: {
      name: "packages-channel-depot-index",
      isNVue: false,
      pagePath: "packages/channel/depot/index",
      windowTop: 44,
      addon: "channel"
    },
    title: "我的倉庫"
  },
  "packages-channel-depot-log": {
    path: "/packages/channel/depot/log",
    name: "packages-channel-depot-log",
    meta: {
      name: "packages-channel-depot-log",
      isNVue: false,
      pagePath: "packages/channel/depot/log",
      windowTop: 44,
      addon: "channel"
    },
    title: "雲倉日誌"
  },
  "packages-channel-depot-list": {
    path: "/packages/channel/depot/list",
    name: "packages-channel-depot-list",
    meta: {
      name: "packages-channel-depot-list",
      isNVue: false,
      pagePath: "packages/channel/depot/list",
      windowTop: 44,
      addon: "channel"
    },
    title: "雲倉庫"
  },
  "packages-channel-depot-detail": {
    path: "/packages/channel/depot/detail",
    name: "packages-channel-depot-detail",
    meta: {
      name: "packages-channel-depot-detail",
      isNVue: false,
      pagePath: "packages/channel/depot/detail",
      windowTop: 44,
      addon: "channel"
    },
    title: "商品明細",
    paramExplain: "sku_id:商品skuid"
  },
  "packages-channel-achieve": {
    path: "/packages/channel/achieve",
    name: "packages-channel-achieve",
    meta: {
      name: "packages-channel-achieve",
      isNVue: false,
      pagePath: "packages/channel/achieve",
      windowTop: 44,
      addon: "channel"
    },
    title: "我的業績"
  },
  "packages-channel-finance": {
    path: "/packages/channel/finance",
    name: "packages-channel-finance",
    meta: {
      name: "packages-channel-finance",
      isNVue: false,
      pagePath: "packages/channel/finance",
      windowTop: 44,
      addon: "channel"
    },
    title: "財務管理"
  },
  "packages-channel-order-list": {
    path: "/packages/channel/order/list",
    name: "packages-channel-order-list",
    meta: {
      name: "packages-channel-order-list",
      isNVue: false,
      pagePath: "packages/channel/order/list",
      windowTop: 44,
      addon: "channel"
    },
    title: "訂單列表",
    paramExplain: "type:訂單类型"
  },
  "packages-channel-order-detail": {
    path: "/packages/channel/order/detail",
    name: "packages-channel-order-detail",
    meta: {
      name: "packages-channel-order-detail",
      isNVue: false,
      pagePath: "packages/channel/order/detail",
      windowTop: 44,
      addon: "channel"
    },
    title: "訂單詳情",
    paramExplain: "type:訂單类型,order_id:訂單id"
  },
  "packages-channel-order-confirm": {
    path: "/packages/channel/order/confirm",
    name: "packages-channel-order-confirm",
    meta: {
      name: "packages-channel-order-confirm",
      isNVue: false,
      pagePath: "packages/channel/order/confirm",
      windowTop: 44,
      addon: "channel"
    },
    title: "確認訂單",
    paramExplain: "type:商品類型"
  },
  "packages-channel-credential": {
    path: "/packages/channel/credential",
    name: "packages-channel-credential",
    meta: {
      name: "packages-channel-credential",
      isNVue: false,
      pagePath: "packages/channel/credential",
      windowTop: 44,
      addon: "channel"
    },
    title: "授權證書"
  },
  "packages-agent-apply": {
    path: "/packages/agent/apply",
    name: "packages-agent-apply",
    meta: {
      name: "packages-agent-apply",
      isNVue: false,
      pagePath: "packages/agent/apply",
      windowTop: 44,
      addon: "agent"
    },
    title: "申請"
  },
  "packages-agent-qrcode": {
    path: "/packages/agent/qrcode",
    name: "packages-agent-qrcode",
    meta: {
      name: "packages-agent-qrcode",
      isNVue: false,
      pagePath: "packages/agent/qrcode",
      windowTop: 44,
      addon: "agent"
    },
    title: "推廣碼"
  },
  "packages-agent-detail": {
    path: "/packages/agent/detail",
    name: "packages-agent-detail",
    meta: {
      name: "packages-agent-detail",
      isNVue: false,
      pagePath: "packages/agent/detail",
      windowTop: 44,
      addon: "agent"
    },
    title: "代理佣金"
  },
  "packages-agent-log": {
    path: "/packages/agent/log",
    name: "packages-agent-log",
    meta: {
      name: "packages-agent-log",
      isNVue: false,
      pagePath: "packages/agent/log",
      windowTop: 44,
      addon: "agent"
    },
    title: "佣金明細"
  },
  "packages-agent-team": {
    path: "/packages/agent/team",
    name: "packages-agent-team",
    meta: {
      name: "packages-agent-team",
      isNVue: false,
      pagePath: "packages/agent/team",
      windowTop: 44,
      addon: "agent"
    },
    title: "我的團隊"
  },
  "packages-agent-customer": {
    path: "/packages/agent/customer",
    name: "packages-agent-customer",
    meta: {
      name: "packages-agent-customer",
      isNVue: false,
      pagePath: "packages/agent/customer",
      windowTop: 44,
      addon: "agent"
    },
    title: "我的客戶"
  },
  "packages-agent-withdraw": {
    path: "/packages/agent/withdraw",
    name: "packages-agent-withdraw",
    meta: {
      name: "packages-agent-withdraw",
      isNVue: false,
      pagePath: "packages/agent/withdraw",
      windowTop: 44,
      addon: "agent"
    },
    title: "佣金提現"
  },
  "packages-agent-credential": {
    path: "/packages/agent/credential",
    name: "packages-agent-credential",
    meta: {
      name: "packages-agent-credential",
      isNVue: false,
      pagePath: "packages/agent/credential",
      windowTop: 44,
      addon: "agent"
    },
    title: "授權證書"
  },
  "packages-agent-ranking": {
    path: "/packages/agent/ranking",
    name: "packages-agent-ranking",
    meta: {
      name: "packages-agent-ranking",
      isNVue: false,
      pagePath: "packages/agent/ranking",
      windowTop: 44,
      addon: "agent"
    },
    title: "排行榜"
  },
  "packages-agent-level": {
    path: "/packages/agent/level",
    name: "packages-agent-level",
    meta: {
      name: "packages-agent-level",
      isNVue: false,
      pagePath: "packages/agent/level",
      windowTop: 44,
      addon: "agent"
    },
    title: "等級詳情"
  },
  "packages-agent-goods": {
    path: "/packages/agent/goods",
    name: "packages-agent-goods",
    meta: {
      name: "packages-agent-goods",
      isNVue: false,
      pagePath: "packages/agent/goods",
      windowTop: 44,
      addon: "agent"
    },
    title: "商品",
    paramExplain: "type:商品類型"
  },
  "packages-agent-depot-index": {
    path: "/packages/agent/depot/index",
    name: "packages-agent-depot-index",
    meta: {
      name: "packages-agent-depot-index",
      isNVue: false,
      pagePath: "packages/agent/depot/index",
      windowTop: 44,
      addon: "agent"
    },
    title: "我的倉庫"
  },
  "packages-agent-depot-log": {
    path: "/packages/agent/depot/log",
    name: "packages-agent-depot-log",
    meta: {
      name: "packages-agent-depot-log",
      isNVue: false,
      pagePath: "packages/agent/depot/log",
      windowTop: 44,
      addon: "agent"
    },
    title: "雲倉日誌"
  },
  "packages-agent-depot-list": {
    path: "/packages/agent/depot/list",
    name: "packages-agent-depot-list",
    meta: {
      name: "packages-agent-depot-list",
      isNVue: false,
      pagePath: "packages/agent/depot/list",
      windowTop: 44,
      addon: "agent"
    },
    title: "雲倉庫"
  },
  "packages-agent-depot-detail": {
    path: "/packages/agent/depot/detail",
    name: "packages-agent-depot-detail",
    meta: {
      name: "packages-agent-depot-detail",
      isNVue: false,
      pagePath: "packages/agent/depot/detail",
      windowTop: 44,
      addon: "agent"
    },
    title: "商品明細",
    paramExplain: "sku_id:商品skuid"
  },
  "packages-agent-achieve": {
    path: "/packages/agent/achieve",
    name: "packages-agent-achieve",
    meta: {
      name: "packages-agent-achieve",
      isNVue: false,
      pagePath: "packages/agent/achieve",
      windowTop: 44,
      addon: "agent"
    },
    title: "我的業績"
  },
  "packages-agent-achievereward": {
    path: "/packages/agent/achievereward",
    name: "packages-agent-achievereward",
    meta: {
      name: "packages-agent-achievereward",
      isNVue: false,
      pagePath: "packages/agent/achievereward",
      windowTop: 44,
      addon: "agent"
    },
    title: "業績獎"
  },
  "packages-agent-order-list": {
    path: "/packages/agent/order/list",
    name: "packages-agent-order-list",
    meta: {
      name: "packages-agent-order-list",
      isNVue: false,
      pagePath: "packages/agent/order/list",
      windowTop: 44,
      addon: "agent"
    },
    title: "訂單列表",
    paramExplain: "type:訂單类型"
  },
  "packages-agent-order-detail": {
    path: "/packages/agent/order/detail",
    name: "packages-agent-order-detail",
    meta: {
      name: "packages-agent-order-detail",
      isNVue: false,
      pagePath: "packages/agent/order/detail",
      windowTop: 44,
      addon: "agent"
    },
    title: "訂單詳情",
    paramExplain: "type:訂單类型,order_id:訂單id"
  },
  "packages-agent-order-confirm": {
    path: "/packages/agent/order/confirm",
    name: "packages-agent-order-confirm",
    meta: {
      name: "packages-agent-order-confirm",
      isNVue: false,
      pagePath: "packages/agent/order/confirm",
      windowTop: 44,
      addon: "agent"
    },
    title: "確認訂單",
    paramExplain: "type:商品類型"
  },
  "packages-microshop-apply": {
    path: "/packages/microshop/apply",
    name: "packages-microshop-apply",
    meta: {
      name: "packages-microshop-apply",
      isNVue: false,
      pagePath: "packages/microshop/apply",
      windowTop: 44,
      addon: "microshop"
    },
    title: "申請"
  },
  "packages-microshop-home": {
    path: "/packages/microshop/home",
    name: "packages-microshop-home",
    meta: {
      name: "packages-microshop-home",
      isNVue: false,
      pagePath: "packages/microshop/home",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "microshop"
    },
    title: "微店"
  },
  "packages-microshop-qrcode": {
    path: "/packages/microshop/qrcode",
    name: "packages-microshop-qrcode",
    meta: {
      name: "packages-microshop-qrcode",
      isNVue: false,
      pagePath: "packages/microshop/qrcode",
      windowTop: 44,
      addon: "microshop"
    },
    title: "分享微店"
  },
  "packages-microshop-profit-detail": {
    path: "/packages/microshop/profit/detail",
    name: "packages-microshop-profit-detail",
    meta: {
      name: "packages-microshop-profit-detail",
      isNVue: false,
      pagePath: "packages/microshop/profit/detail",
      windowTop: 44,
      addon: "microshop"
    },
    title: "微店收益"
  },
  "packages-microshop-profit-log": {
    path: "/packages/microshop/profit/log",
    name: "packages-microshop-profit-log",
    meta: {
      name: "packages-microshop-profit-log",
      isNVue: false,
      pagePath: "packages/microshop/profit/log",
      windowTop: 44,
      addon: "microshop"
    },
    title: "收益明細"
  },
  "packages-microshop-profit-withdraw": {
    path: "/packages/microshop/profit/withdraw",
    name: "packages-microshop-profit-withdraw",
    meta: {
      name: "packages-microshop-profit-withdraw",
      isNVue: false,
      pagePath: "packages/microshop/profit/withdraw",
      windowTop: 44,
      addon: "microshop"
    },
    title: "收益提現"
  },
  "packages-microshop-level": {
    path: "/packages/microshop/level",
    name: "packages-microshop-level",
    meta: {
      name: "packages-microshop-level",
      isNVue: false,
      pagePath: "packages/microshop/level",
      windowTop: 44,
      addon: "microshop"
    },
    title: "等級中心"
  },
  "packages-microshop-goods-category": {
    path: "/packages/microshop/goods/category",
    name: "packages-microshop-goods-category",
    meta: {
      name: "packages-microshop-goods-category",
      isNVue: false,
      pagePath: "packages/microshop/goods/category",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "microshop"
    },
    title: "商品分類"
  },
  "packages-microshop-goods-list": {
    path: "/packages/microshop/goods/list",
    name: "packages-microshop-goods-list",
    meta: {
      name: "packages-microshop-goods-list",
      isNVue: false,
      pagePath: "packages/microshop/goods/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "microshop"
    },
    title: "商品列表"
  },
  "packages-microshop-set-index": {
    path: "/packages/microshop/set/index",
    name: "packages-microshop-set-index",
    meta: {
      name: "packages-microshop-set-index",
      isNVue: false,
      pagePath: "packages/microshop/set/index",
      windowTop: 44,
      addon: "microshop"
    },
    title: "微店管理"
  },
  "packages-microshop-set-info": {
    path: "/packages/microshop/set/info",
    name: "packages-microshop-set-info",
    meta: {
      name: "packages-microshop-set-info",
      isNVue: false,
      pagePath: "packages/microshop/set/info",
      windowTop: 44,
      addon: "microshop"
    },
    title: "微店信息"
  },
  "packages-microshop-set-logo": {
    path: "/packages/microshop/set/logo",
    name: "packages-microshop-set-logo",
    meta: {
      name: "packages-microshop-set-logo",
      isNVue: false,
      pagePath: "packages/microshop/set/logo",
      windowTop: 44,
      addon: "microshop"
    },
    title: "logo"
  },
  "packages-microshop-order-confirm": {
    path: "/packages/microshop/order/confirm",
    name: "packages-microshop-order-confirm",
    meta: {
      name: "packages-microshop-order-confirm",
      isNVue: false,
      pagePath: "packages/microshop/order/confirm",
      windowTop: 44,
      addon: "microshop"
    },
    title: "確認訂單"
  },
  "packages-microshop-credential": {
    path: "/packages/microshop/credential",
    name: "packages-microshop-credential",
    meta: {
      name: "packages-microshop-credential",
      isNVue: false,
      pagePath: "packages/microshop/credential",
      windowTop: 44,
      addon: "microshop"
    },
    title: "授權證書"
  },
  "packages-integral-goods-list": {
    path: "/packages/integral/goods/list",
    name: "packages-integral-goods-list",
    meta: {
      name: "packages-integral-goods-list",
      isNVue: false,
      pagePath: "packages/integral/goods/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "商品列表"
  },
  "packages-integral-goods-category": {
    path: "/packages/integral/goods/category",
    name: "packages-integral-goods-category",
    meta: {
      name: "packages-integral-goods-category",
      isNVue: false,
      pagePath: "packages/integral/goods/category",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "商品分類"
  },
  "packages-integral-goods-detail": {
    path: "/packages/integral/goods/detail",
    name: "packages-integral-goods-detail",
    meta: {
      name: "packages-integral-goods-detail",
      isNVue: false,
      pagePath: "packages/integral/goods/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "integral"
    },
    title: "商品詳情",
    paramExplain: "goods_id:商品id"
  },
  "packages-integral-order-confirm": {
    path: "/packages/integral/order/confirm",
    name: "packages-integral-order-confirm",
    meta: {
      name: "packages-integral-order-confirm",
      isNVue: false,
      pagePath: "packages/integral/order/confirm",
      windowTop: 44,
      addon: "integral"
    },
    title: "確認訂單",
    paramExplain: "param:確認訂單所需参数object"
  },
  "packages-message-notice": {
    path: "/packages/message/notice",
    name: "packages-message-notice",
    meta: {
      name: "packages-message-notice",
      isNVue: false,
      pagePath: "packages/message/notice",
      windowTop: 44
    },
    title: "消息通知"
  },
  "packages-message-wxnotice": {
    path: "/packages/message/wxnotice",
    name: "packages-message-wxnotice",
    meta: {
      name: "packages-message-wxnotice",
      isNVue: false,
      pagePath: "packages/message/wxnotice",
      windowTop: 44
    },
    title: "微店信息"
  },
  "packages-message-list": {
    path: "/packages/message/list",
    name: "packages-message-list",
    meta: {
      name: "packages-message-list",
      isNVue: false,
      pagePath: "packages/message/list",
      windowTop: 44
    },
    title: "消息列表"
  },
  "packages-message-chat": {
    path: "/packages/message/chat",
    name: "packages-message-chat",
    meta: {
      name: "packages-message-chat",
      isNVue: false,
      pagePath: "packages/message/chat",
      windowTop: 44,
      addon: "qlkefu"
    },
    title: "消息會話",
    paramExplain: "seller:商戶標識,kefu_code:客服標識"
  },
  "packages-message-wxchat": {
    path: "/packages/message/wxchat",
    name: "packages-message-wxchat",
    meta: {
      name: "packages-message-wxchat",
      isNVue: false,
      pagePath: "packages/message/wxchat",
      windowTop: 44,
    },
    title: "消息會話",
    paramExplain: ""
  },
  "packages-wheelsurf-index": {
    path: "/packages/wheelsurf/index",
    name: "packages-wheelsurf-index",
    meta: {
      name: "packages-wheelsurf-index",
      isNVue: false,
      pagePath: "packages/wheelsurf/index",
      windowTop: 44,
      shareType: "current",
      addon: "wheelsurf",
      noLogin: true
    },
    title: "幸運大轉盤",
    paramExplain: "wheelsurf_id:大轉盤id"
  },
  "packages-smashegg-index": {
    path: "/packages/smashegg/index",
    name: "packages-smashegg-index",
    meta: {
      name: "packages-smashegg-index",
      isNVue: false,
      pagePath: "packages/smashegg/index",
      windowTop: 44,
      shareType: "current",
      addon: "smashegg",
      noLogin: true
    },
    title: "砸金蛋",
    paramExplain: "smashegg_id:砸金蛋id"
  },
  "packages-prize-list": {
    path: "/packages/prize/list",
    name: "packages-prize-list",
    meta: {
      name: "packages-prize-list",
      isNVue: false,
      pagePath: "packages/prize/list",
      windowTop: 44
    },
    title: "獎品列表"
  },
  "packages-prize-confirm": {
    path: "/packages/prize/confirm",
    name: "packages-prize-confirm",
    meta: {
      name: "packages-prize-confirm",
      isNVue: false,
      pagePath: "packages/prize/confirm",
      windowTop: 44
    },
    title: "獎品確認"
  },
  "packages-prize-result": {
    path: "/packages/prize/result",
    name: "packages-prize-result",
    meta: {
      name: "packages-prize-result",
      isNVue: false,
      pagePath: "packages/prize/result",
      windowTop: 44
    },
    title: "領取結果"
  },
  "packages-scratchcard-index": {
    path: "/packages/scratchcard/index",
    name: "packages-scratchcard-index",
    meta: {
      name: "packages-scratchcard-index",
      isNVue: false,
      pagePath: "packages/scratchcard/index",
      windowTop: 44,
      shareType: "current",
      addon: "scratchcard",
      noLogin: true
    },
    title: "刮刮樂",
    paramExplain: "scratchcard_id:刮刮樂id"
  },
  "packages-followgift-index": {
    path: "/packages/followgift/index",
    name: "packages-followgift-index",
    meta: {
      name: "packages-followgift-index",
      isNVue: false,
      pagePath: "packages/followgift/index",
      windowTop: 44,
      shareType: "current",
      addon: "followgift"
    },
    title: "關注有禮",
    paramExplain: "followgift_id:關注有禮id"
  },
  "packages-festivalcare-index": {
    path: "/packages/festivalcare/index",
    name: "packages-festivalcare-index",
    meta: {
      name: "packages-festivalcare-index",
      isNVue: false,
      pagePath: "packages/festivalcare/index",
      windowTop: 44,
      shareType: "current",
      addon: "festivalcare"
    },
    title: "節日關懷",
    paramExplain: "festivalcare_id:節日關懷id"
  },
  "packages-signin-log": {
    path: "/packages/signin/log",
    name: "packages-signin-log",
    meta: {
      name: "packages-signin-log",
      isNVue: false,
      pagePath: "packages/signin/log",
      windowTop: 44,
      addon: "signin"
    },
    title: "簽到明細"
  },
  "packages-task-list": {
    path: "/packages/task/list",
    name: "packages-task-list",
    meta: {
      name: "packages-task-list",
      isNVue: false,
      pagePath: "packages/task/list",
      windowTop: 44,
      addon: "taskcenter"
    },
    title: "我的任務"
  },
  "packages-task-detail": {
    path: "/packages/task/detail",
    name: "packages-task-detail",
    meta: {
      name: "packages-task-detail",
      isNVue: false,
      pagePath: "packages/task/detail",
      windowTop: 44,
      addon: "taskcenter"
    },
    title: "任務詳情",
    paramExplain: "task_id:任務id"
  },
  "packages-course-list": {
    path: "/packages/course/list",
    name: "packages-course-list",
    meta: {
      name: "packages-course-list",
      isNVue: false,
      pagePath: "packages/course/list",
      windowTop: 44
    },
    title: "我的課程"
  },
  "packages-course-detail": {
    path: "/packages/course/detail",
    name: "packages-course-detail",
    meta: {
      name: "packages-course-detail",
      isNVue: false,
      pagePath: "packages/course/detail",
      windowTop: 44
    },
    title: "課程詳情",
    paramExplain: "goods_id:商品id/knowledge_payment_id:課程id"
  },
  "packages-invoice-detail": {
    path: "/packages/invoice/detail",
    name: "packages-invoice-detail",
    meta: {
      name: "packages-invoice-detail",
      isNVue: false,
      pagePath: "packages/invoice/detail",
      windowTop: 44,
      addon: "invoice"
    },
    title: "发票詳情",
    paramExplain: "order_no:訂單no"
  },
  "packages-anticounterfeiting-index": {
    path: "/packages/anticounterfeiting/index",
    name: "packages-anticounterfeiting-index",
    meta: {
      name: "packages-anticounterfeiting-index",
      isNVue: false,
      pagePath: "packages/anticounterfeiting/index",
      windowTop: 44,
      noLogin: true,
      addon: "anticounterfeiting"
    },
    title: "防偽溯源商品查詢"
  },
  "packages-anticounterfeiting-result": {
    path: "/packages/anticounterfeiting/result",
    name: "packages-anticounterfeiting-result",
    meta: {
      name: "packages-anticounterfeiting-result",
      isNVue: false,
      pagePath: "packages/anticounterfeiting/result",
      windowTop: 44,
      noLogin: true,
      addon: "anticounterfeiting"
    },
    title: "查詢結果"
  },
  "packages-credential-index": {
    path: "/packages/credential/index",
    name: "packages-credential-index",
    meta: {
      name: "packages-credential-index",
      isNVue: false,
      pagePath: "packages/credential/index",
      windowTop: 44,
      noLogin: true,
      addon: "credential"
    },
    title: "查询授權證書"
  },
  "packages-credential-result": {
    path: "/packages/credential/result",
    name: "packages-credential-result",
    meta: {
      name: "packages-credential-result",
      isNVue: false,
      pagePath: "packages/credential/result",
      windowTop: 44,
      addon: "credential"
    },
    title: "授權證書查詢結果"
  },
  "packages-thingcircle-report": {
    path: "/packages/thingcircle/report",
    name: "packages-thingcircle-report",
    meta: {
      name: "packages-thingcircle-report",
      isNVue: false,
      pagePath: "packages/thingcircle/report",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "舉報評論",
    paramExplain: "comment_id:舉報評論id"
  },
  "packages-thingcircle-fans": {
    path: "/packages/thingcircle/fans",
    name: "packages-thingcircle-fans",
    meta: {
      name: "packages-thingcircle-fans",
      isNVue: false,
      pagePath: "packages/thingcircle/fans",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "我的粉絲"
  },
  "packages-thingcircle-follow": {
    path: "/packages/thingcircle/follow",
    name: "packages-thingcircle-follow",
    meta: {
      name: "packages-thingcircle-follow",
      isNVue: false,
      pagePath: "packages/thingcircle/follow",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "我的關注"
  },
  "packages-thingcircle-release-index": {
    path: "/packages/thingcircle/release/index",
    name: "packages-thingcircle-release-index",
    meta: {
      name: "packages-thingcircle-release-index",
      isNVue: false,
      pagePath: "packages/thingcircle/release/index",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "發布乾貨"
  },
  "packages-thingcircle-release-goods": {
    path: "/packages/thingcircle/release/goods",
    name: "packages-thingcircle-release-goods",
    meta: {
      name: "packages-thingcircle-release-goods",
      isNVue: false,
      pagePath: "packages/thingcircle/release/goods",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "推薦商品"
  },
  "packages-thingcircle-release-topic": {
    path: "/packages/thingcircle/release/topic",
    name: "packages-thingcircle-release-topic",
    meta: {
      name: "packages-thingcircle-release-topic",
      isNVue: false,
      pagePath: "packages/thingcircle/release/topic",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "話題"
  },
  "packages-thingcircle-release-location": {
    path: "/packages/thingcircle/release/location",
    name: "packages-thingcircle-release-location",
    meta: {
      name: "packages-thingcircle-release-location",
      isNVue: false,
      pagePath: "packages/thingcircle/release/location",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "定位"
  },
  "packages-thingcircle-collect": {
    path: "/packages/thingcircle/collect",
    name: "packages-thingcircle-collect",
    meta: {
      name: "packages-thingcircle-collect",
      isNVue: false,
      pagePath: "packages/thingcircle/collect",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "贊和收藏"
  },
  "packages-thingcircle-comment": {
    path: "/packages/thingcircle/comment",
    name: "packages-thingcircle-comment",
    meta: {
      name: "packages-thingcircle-comment",
      isNVue: false,
      pagePath: "packages/thingcircle/comment",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "評論和@"
  },
  "packages-thingcircle-notice": {
    path: "/packages/thingcircle/notice",
    name: "packages-thingcircle-notice",
    meta: {
      name: "packages-thingcircle-notice",
      isNVue: false,
      pagePath: "packages/thingcircle/notice",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "消息通知"
  },
  "packages-thingcircle-mine": {
    path: "/packages/thingcircle/mine",
    name: "packages-thingcircle-mine",
    meta: {
      name: "packages-thingcircle-mine",
      isNVue: false,
      pagePath: "packages/thingcircle/mine",
      windowTop: 44,
      addon: "thingcircle"
    },
    title: "我的",
    paramExplain: ""
  },
  "packages-thingcircle-detail": {
    path: "/packages/thingcircle/detail",
    name: "packages-thingcircle-detail",
    meta: {
      name: "packages-thingcircle-detail",
      isNVue: false,
      pagePath: "packages/thingcircle/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "thingcircle"
    },
    title: "干货詳情",
    paramExplain: "thing_id:圈id"
  },
  "packages-blockchain-index": {
    path: "/packages/blockchain/index",
    name: "packages-blockchain-index",
    meta: {
      name: "packages-blockchain-index",
      isNVue: false,
      pagePath: "packages/blockchain/index",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "數字資產"
  },
  "packages-blockchain-wallet": {
    path: "/packages/blockchain/wallet",
    name: "packages-blockchain-wallet",
    meta: {
      name: "packages-blockchain-wallet",
      isNVue: false,
      pagePath: "packages/blockchain/wallet",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "錢包地址",
    paramExplain: "type:資產類型"
  },
  "packages-blockchain-trade-log": {
    path: "/packages/blockchain/trade/log",
    name: "packages-blockchain-trade-log",
    meta: {
      name: "packages-blockchain-trade-log",
      isNVue: false,
      pagePath: "packages/blockchain/trade/log",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "交易明細",
    paramExplain: "type:資產類型"
  },
  "packages-blockchain-trade-detail": {
    path: "/packages/blockchain/trade/detail",
    name: "packages-blockchain-trade-detail",
    meta: {
      name: "packages-blockchain-trade-detail",
      isNVue: false,
      pagePath: "packages/blockchain/trade/detail",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "交易詳情",
    paramExplain: "type:資產類型,trade_id:交易id"
  },
  "packages-blockchain-exchange": {
    path: "/packages/blockchain/exchange",
    name: "packages-blockchain-exchange",
    meta: {
      name: "packages-blockchain-exchange",
      isNVue: false,
      pagePath: "packages/blockchain/exchange",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "兌換",
    paramExplain: "type:資產類型"
  },
  "packages-blockchain-transfer": {
    path: "/packages/blockchain/transfer",
    name: "packages-blockchain-transfer",
    meta: {
      name: "packages-blockchain-transfer",
      isNVue: false,
      pagePath: "packages/blockchain/transfer",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "轉賬",
    paramExplain: "type:資產類型"
  },
  "packages-blockchain-export": {
    path: "/packages/blockchain/export",
    name: "packages-blockchain-export",
    meta: {
      name: "packages-blockchain-export",
      isNVue: false,
      pagePath: "packages/blockchain/export",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "導出",
    paramExplain: "type:資產類型,key:導出key"
  },
  "packages-blockchain-resource": {
    path: "/packages/blockchain/resource",
    name: "packages-blockchain-resource",
    meta: {
      name: "packages-blockchain-resource",
      isNVue: false,
      pagePath: "packages/blockchain/resource",
      windowTop: 44,
      addon: "blockchain"
    },
    title: "EOS資源"
  },
  "packages-assemble-list": {
    path: "/packages/assemble/list",
    name: "packages-assemble-list",
    meta: {
      name: "packages-assemble-list",
      isNVue: false,
      pagePath: "packages/assemble/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "groupshopping"
    },
    title: "拼團列表"
  },
  "packages-assemble-detail": {
    path: "/packages/assemble/detail",
    name: "packages-assemble-detail",
    meta: {
      name: "packages-assemble-detail",
      isNVue: false,
      pagePath: "packages/assemble/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "groupshopping"
    },
    title: "拼糰詳情",
    paramExplain: "record_id:糰id"
  },
  "packages-seckill-list": {
    path: "/packages/seckill/list",
    name: "packages-seckill-list",
    meta: {
      name: "packages-seckill-list",
      isNVue: false,
      pagePath: "packages/seckill/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "seckill"
    },
    title: "秒殺列表"
  },
  "packages-bargain-list": {
    path: "/packages/bargain/list",
    name: "packages-bargain-list",
    meta: {
      name: "packages-bargain-list",
      isNVue: false,
      pagePath: "packages/bargain/list",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "bargain"
    },
    title: "砍價列表"
  },
  "packages-bargain-mybargainlist": {
    path: "/packages/bargain/mybargainlist",
    name: "packages-bargain-mybargainlist",
    meta: {
      name: "packages-bargain-mybargainlist",
      isNVue: false,
      pagePath: "packages/bargain/mybargainlist",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "bargain"
    },
    title: "我的砍價列表"
  },
  "packages-bargain-detail": {
    path: "/packages/bargain/detail",
    name: "packages-bargain-detail",
    meta: {
      name: "packages-bargain-detail",
      isNVue: false,
      pagePath: "packages/bargain/detail",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "bargain"
    },
    title: "砍價詳情",
    paramExplain: "goods_id:商品id,bargain_id:砍價id,bargain_uid:砍價用户id"
  },
  "packages-giftvoucher-list": {
    path: "/packages/giftvoucher/list",
    name: "packages-giftvoucher-list",
    meta: {
      name: "packages-giftvoucher-list",
      isNVue: false,
      pagePath: "packages/giftvoucher/list",
      windowTop: 44,
      addon: "giftvoucher"
    },
    title: "禮品券列表"
  },
  "packages-giftvoucher-detail": {
    path: "/packages/giftvoucher/detail",
    name: "packages-giftvoucher-detail",
    meta: {
      name: "packages-giftvoucher-detail",
      isNVue: false,
      pagePath: "packages/giftvoucher/detail",
      windowTop: 44,
      addon: "giftvoucher"
    },
    title: "禮品券詳情",
    paramExplain: "record_id:禮品券記錄id"
  },
  "packages-giftvoucher-receive": {
    path: "/packages/giftvoucher/receive",
    name: "packages-giftvoucher-receive",
    meta: {
      name: "packages-giftvoucher-receive",
      isNVue: false,
      pagePath: "packages/giftvoucher/receive",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
      addon: "giftvoucher"
    },
    title: "領取禮品券",
    paramExplain: "giftvoucher_id:禮品券id"
  },
  "packages-voucherpackage-index": {
    path: "/packages/voucherpackage/index",
    name: "packages-voucherpackage-index",
    meta: {
      name: "packages-voucherpackage-index",
      isNVue: false,
      pagePath: "packages/voucherpackage/index",
      windowTop: 44,
      noLogin: true,
      addon: "voucherpackage"
    },
    title: "券包詳情",
    paramExplain: "voucher_package_id:券包id"
  },
  "packages-consumercard-list": {
    path: "/packages/consumercard/list",
    name: "packages-consumercard-list",
    meta: {
      name: "packages-consumercard-list",
      isNVue: false,
      pagePath: "packages/consumercard/list",
      windowTop: 44
    },
    title: "消費卡"
  },
  "packages-consumercard-detail": {
    path: "/packages/consumercard/detail",
    name: "packages-consumercard-detail",
    meta: {
      name: "packages-consumercard-detail",
      isNVue: false,
      pagePath: "packages/consumercard/detail",
      windowTop: 44
    },
    title: "消費卡詳情",
    paramExplain: "card_id:消費卡id"
  },
  "packages-deliverycode-list": {
    path: "/packages/deliverycode/list",
    name: "packages-deliverycode-list",
    meta: {
      name: "packages-deliverycode-list",
      isNVue: false,
      pagePath: "packages/deliverycode/list",
      windowTop: 44
    },
    title: "領貨碼"
  },
  "packages-deliverycode-bindcode": {
    path: "/packages/deliverycode/bindcode",
    name: "packages-deliverycode-bindcode",
    meta: {
      name: "packages-deliverycode-bindcode",
      isNVue: false,
      pagePath: "packages/deliverycode/bindcode",
      windowTop: 44
    },
    title: "绑定領貨碼"
  },
  "packages-help-list": {
    path: "/packages/help/list",
    name: "packages-help-list",
    meta: {
      name: "packages-help-list",
      isNVue: false,
      pagePath: "packages/help/list",
      windowTop: 44,
      addon: "helpcenter"
    },
    title: "幫助分類列表",
    paramExplain: ""
  },
  "packages-help-detail": {
    path: "/packages/help/detail",
    name: "packages-help-detail",
    meta: {
      name: "packages-help-detail",
      isNVue: false,
      pagePath: "packages/help/detail",
      windowTop: 44,
      noLogin: true,
      addon: "helpcenter"
    },
    title: "帮助詳情",
    paramExplain: "detail_id:幫助文章id"
  },
  "packages-mplive-list": {
    path: "/packages/mplive/list",
    name: "packages-mplive-list",
    meta: {
      name: "packages-mplive-list",
      isNVue: false,
      pagePath: "packages/mplive/list",
      windowTop: 44,
      shareType: "current",
      addon: "mplive"
    },
    title: "直播廣場",
    paramExplain: ""
  },
  "packages-membercard-index": {
    path: "/packages/membercard/index",
    name: "packages-membercard-index",
    meta: {
      name: "packages-membercard-index",
      isNVue: false,
      pagePath: "packages/membercard/index",
      windowTop: 44,
      addon: "membercard"
    },
    title: "會員卡",
    paramExplain: ""
  },
  "packages-membercard-code": {
    path: "/packages/membercard/code",
    name: "packages-membercard-code",
    meta: {
      name: "packages-membercard-code",
      isNVue: false,
      pagePath: "packages/membercard/code",
      windowTop: 44,
      addon: "membercard"
    },
    title: "會員碼",
    paramExplain: ""
  },
  "packages-membercard-profit": {
    path: "/packages/membercard/profit",
    name: "packages-membercard-profit",
    meta: {
      name: "packages-membercard-profit",
      isNVue: false,
      pagePath: "packages/membercard/profit",
      windowTop: 44,
      addon: "membercard"
    },
    title: "權益介紹",
    paramExplain: ""
  },
  "packages-membercard-recharge": {
    path: "/packages/membercard/recharge",
    name: "packages-membercard-recharge",
    meta: {
      name: "packages-membercard-recharge",
      isNVue: false,
      pagePath: "packages/membercard/recharge",
      windowTop: 44,
      addon: "membercard"
    },
    title: "充值",
    paramExplain: ""
  },
  "packages-membercard-upgrade": {
    path: "/packages/membercard/upgrade",
    name: "packages-membercard-upgrade",
    meta: {
      name: "packages-membercard-upgrade",
      isNVue: false,
      pagePath: "packages/membercard/upgrade",
      windowTop: 44,
      addon: "membercard"
    },
    title: "升級",
    paramExplain: ""
  },
  "packages-membercard-log-list": {
    path: "/packages/membercard/log/list",
    name: "packages-membercard-log-list",
    meta: {
      name: "packages-membercard-log-list",
      isNVue: false,
      pagePath: "packages/membercard/log/list",
      windowTop: 44,
      addon: "membercard"
    },
    title: "明細列表",
    paramExplain: ""
  },
  "packages-membercard-log-detail": {
    path: "/packages/membercard/log/detail",
    name: "packages-membercard-log-detail",
    meta: {
      name: "packages-membercard-log-detail",
      isNVue: false,
      pagePath: "packages/membercard/log/detail",
      windowTop: 44,
      addon: "membercard"
    },
    title: "明細詳情",
    paramExplain: ""
  },
  "packages-live-player": {
    path: "/packages/live/player",
    name: "packages-live-player",
    meta: {
      name: "packages-live-player",
      isNVue: false,
      pagePath: "packages/live/player",
      windowTop: 44,
      shareType: "current",
      addon: "liveshopping"
    },
    title: "直播間"
  },
  "packages-live-notice": {
    path: "/packages/live/notice",
    name: "packages-live-notice",
    meta: {
      name: "packages-live-notice",
      isNVue: false,
      pagePath: "packages/live/notice",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "開播通告"
  },
  "packages-live-end": {
    path: "/packages/live/end",
    name: "packages-live-end",
    meta: {
      name: "packages-live-end",
      isNVue: false,
      pagePath: "packages/live/end",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "直播結束"
  },
  "packages-live-report": {
    path: "/packages/live/report",
    name: "packages-live-report",
    meta: {
      name: "packages-live-report",
      isNVue: false,
      pagePath: "packages/live/report",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "舉報"
  },
  "packages-live-anchor-player": {
    path: "/packages/live/anchor/player",
    name: "packages-live-anchor-player",
    meta: {
      name: "packages-live-anchor-player",
      isNVue: false,
      pagePath: "packages/live/anchor/player",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "主播間"
  },
  "packages-live-anchor-apply": {
    path: "/packages/live/anchor/apply",
    name: "packages-live-anchor-apply",
    meta: {
      name: "packages-live-anchor-apply",
      isNVue: false,
      pagePath: "packages/live/anchor/apply",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "直播申請"
  },
  "packages-live-anchor-info": {
    path: "/packages/live/anchor/info",
    name: "packages-live-anchor-info",
    meta: {
      name: "packages-live-anchor-info",
      isNVue: false,
      pagePath: "packages/live/anchor/info",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "開播信息"
  },
  "packages-live-anchor-notice": {
    path: "/packages/live/anchor/notice",
    name: "packages-live-anchor-notice",
    meta: {
      name: "packages-live-anchor-notice",
      isNVue: false,
      pagePath: "packages/live/anchor/notice",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "開播通告"
  },
  "packages-live-anchor-set": {
    path: "/packages/live/anchor/set",
    name: "packages-live-anchor-set",
    meta: {
      name: "packages-live-anchor-set",
      isNVue: false,
      pagePath: "packages/live/anchor/set",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "開播設置"
  },
  "packages-live-anchor-goods": {
    path: "/packages/live/anchor/goods",
    name: "packages-live-anchor-goods",
    meta: {
      name: "packages-live-anchor-goods",
      isNVue: false,
      pagePath: "packages/live/anchor/goods",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "添加商品"
  },
  "packages-live-anchor-end": {
    path: "/packages/live/anchor/end",
    name: "packages-live-anchor-end",
    meta: {
      name: "packages-live-anchor-end",
      isNVue: false,
      pagePath: "packages/live/anchor/end",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "直播結束"
  },
  "packages-live-mine-index": {
    path: "/packages/live/mine/index",
    name: "packages-live-mine-index",
    meta: {
      name: "packages-live-mine-index",
      isNVue: false,
      pagePath: "packages/live/mine/index",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "我的"
  },
  "packages-live-mine-apply": {
    path: "/packages/live/mine/apply",
    name: "packages-live-mine-apply",
    meta: {
      name: "packages-live-mine-apply",
      isNVue: false,
      pagePath: "packages/live/mine/apply",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "申請"
  },
  "packages-live-mine-info": {
    path: "/packages/live/mine/info",
    name: "packages-live-mine-info",
    meta: {
      name: "packages-live-mine-info",
      isNVue: false,
      pagePath: "packages/live/mine/info",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "主播信息"
  },
  "packages-live-mine-follow": {
    path: "/packages/live/mine/follow",
    name: "packages-live-mine-follow",
    meta: {
      name: "packages-live-mine-follow",
      isNVue: false,
      pagePath: "packages/live/mine/follow",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "我的關注"
  },
  "packages-live-mine-fans": {
    path: "/packages/live/mine/fans",
    name: "packages-live-mine-fans",
    meta: {
      name: "packages-live-mine-fans",
      isNVue: false,
      pagePath: "packages/live/mine/fans",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "我的粉絲"
  },
  "packages-live-mine-shop": {
    path: "/packages/live/mine/shop",
    name: "packages-live-mine-shop",
    meta: {
      name: "packages-live-mine-shop",
      isNVue: false,
      pagePath: "packages/live/mine/shop",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "主播小店"
  },
  "packages-live-mine-goods": {
    path: "/packages/live/mine/goods",
    name: "packages-live-mine-goods",
    meta: {
      name: "packages-live-mine-goods",
      isNVue: false,
      pagePath: "packages/live/mine/goods",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "挑選商品"
  },
  "packages-live-mine-history": {
    path: "/packages/live/mine/history",
    name: "packages-live-mine-history",
    meta: {
      name: "packages-live-mine-history",
      isNVue: false,
      pagePath: "packages/live/mine/history",
      windowTop: 44,
      addon: "liveshopping"
    },
    title: "觀看歷史"
  },
  "packages-merchant-apply": {
    path: "/packages/merchant/apply",
    name: "packages-merchant-apply",
    meta: {
      name: "packages-merchant-apply",
      isNVue: false,
      pagePath: "packages/merchant/apply",
      windowTop: 44,
      addon: "merchants"
    },
    title: "申請"
  },
  "packages-merchant-detail": {
    path: "/packages/merchant/detail",
    name: "packages-merchant-detail",
    meta: {
      name: "packages-merchant-detail",
      isNVue: false,
      pagePath: "packages/merchant/detail",
      windowTop: 44,
      addon: "merchants"
    },
    title: "詳情"
  },
  "packages-merchant-log": {
    path: "/packages/merchant/log",
    name: "packages-merchant-log",
    meta: {
      name: "packages-merchant-log",
      isNVue: false,
      pagePath: "packages/merchant/log",
      windowTop: 44,
      addon: "merchants"
    },
    title: "明細"
  },
  "packages-merchant-member": {
    path: "/packages/merchant/member",
    name: "packages-merchant-member",
    meta: {
      name: "packages-merchant-member",
      isNVue: false,
      pagePath: "packages/merchant/member",
      windowTop: 44,
      addon: "merchants"
    },
    title: "招商員"
  },
  "packages-merchant-order": {
    path: "/packages/merchant/order",
    name: "packages-merchant-order",
    meta: {
      name: "packages-merchant-order",
      isNVue: false,
      pagePath: "packages/merchant/order",
      windowTop: 44,
      addon: "merchants"
    },
    title: "訂單列表"
  },
  "packages-merchant-qrcode": {
    path: "/packages/merchant/qrcode",
    name: "packages-merchant-qrcode",
    meta: {
      name: "packages-merchant-qrcode",
      isNVue: false,
      pagePath: "packages/merchant/qrcode",
      windowTop: 44,
      addon: "merchants"
    },
    title: "推廣碼"
  },
  "packages-merchant-ranking": {
    path: "/packages/merchant/ranking",
    name: "packages-merchant-ranking",
    meta: {
      name: "packages-merchant-ranking",
      isNVue: false,
      pagePath: "packages/merchant/ranking",
      windowTop: 44,
      addon: "merchants"
    },
    title: "排行榜"
  },
  "packages-merchant-shop": {
    path: "/packages/merchant/shop",
    name: "packages-merchant-shop",
    meta: {
      name: "packages-merchant-shop",
      isNVue: false,
      pagePath: "packages/merchant/shop",
      windowTop: 44,
      addon: "merchants"
    },
    title: "店鋪"
  },
  "packages-merchant-team": {
    path: "/packages/merchant/team",
    name: "packages-merchant-team",
    meta: {
      name: "packages-merchant-team",
      isNVue: false,
      pagePath: "packages/merchant/team",
      windowTop: 44,
      addon: "merchants"
    },
    title: "我的團隊"
  },
  "packages-merchant-withdraw": {
    path: "/packages/merchant/withdraw",
    name: "packages-merchant-withdraw",
    meta: {
      name: "packages-merchant-withdraw",
      isNVue: false,
      pagePath: "packages/merchant/withdraw",
      windowTop: 44,
      addon: "merchants"
    },
    title: "提現"
  },
  "packages-level-index": {
    path: "/packages/level/index",
    name: "packages-level-index",
    meta: {
      name: "packages-level-index",
      isNVue: false,
      pagePath: "packages/level/index",
      windowTop: 44,
      addon: "paygrade"
    },
    title: "等級中心"
  },
  "packages-cps-list": {
    path: "/packages/cps/list",
    name: "packages-cps-list",
    meta: {
      name: "packages-cps-list",
      isNVue: false,
      pagePath: "packages/cps/list",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "商品列表"
  },
  "packages-cps-detail": {
    path: "/packages/cps/detail",
    name: "packages-cps-detail",
    meta: {
      name: "packages-cps-detail",
      isNVue: false,
      pagePath: "packages/cps/detail",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "商品詳情"
  },
  "packages-cps-rule": {
    path: "/packages/cps/rule",
    name: "packages-cps-rule",
    meta: {
      name: "packages-cps-rule",
      isNVue: false,
      pagePath: "packages/cps/rule",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "規則"
  },
  "packages-cps-search": {
    path: "/packages/cps/search",
    name: "packages-cps-search",
    meta: {
      name: "packages-cps-search",
      isNVue: false,
      pagePath: "packages/cps/search",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "商品搜索"
  },
  "packages-cps-search-result": {
    path: "/packages/cps/search/result",
    name: "packages-cps-search-result",
    meta: {
      name: "packages-cps-search-result",
      isNVue: false,
      pagePath: "packages/cps/search/result",
      windowTop: 44,
      addon: "cpsunion"
    },
    title: "搜索結果"
  },
  "packages-friendster-index": {
    path: "/packages/friendster/index",
    name: "packages-friendster-index",
    meta: {
      name: "packages-friendster-index",
      isNVue: false,
      pagePath: "packages/friendster/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current",
      addon: "friendscircle"
    },
    title: "朋友圈"
  },
  "packages-lucklyspell-detail": {
    path: "/packages/lucklyspell/detail",
    name: "packages-lucklyspell-detail",
    meta: {
      name: "packages-lucklyspell-detail",
      isNVue: false,
      pagePath: "packages/lucklyspell/detail",
      windowTop: 44,
      shareType: "current"
    },
    title: "幸运拼糰詳情"
  },
  "packages-supplier-apply": {
    path: "/packages/supplier/apply",
    name: "packages-supplier-apply",
    meta: {
      name: "packages-supplier-apply",
      isNVue: false,
      pagePath: "packages/supplier/apply",
      windowTop: 44,
      shareType: "current",
      addon:"supplier"
    },
    title: "供應商入駐"
  },
  "pages-smallshop-index": {
    path: "/pages/smallshop/index",
    name: "pages-smallshop-index",
    meta: {
      name: "pages-smallshop-index",
      isNVue: false,
      pagePath: "pages/smallshop/index",
      windowTop: 44,
      possTabBar: true,
      shareType: "current"
    },
    title: "微小店"
  },
  "packages-smallshop-goodslist": {
    path: "/packages/smallshop/goodslist",
    name: "packages-smallshop-goodslist",
    meta: {
      name: "packages-smallshop-goodslist",
      isNVue: false,
      pagePath: "packages/smallshop/goodslist",
      windowTop: 44,
      shareType: "current",
    },
    title: "商品庫"
  },
  "packages-smallshop-orderlist": {
    path: "/packages/smallshop/orderlist",
    name: "packages-smallshop-orderlist",
    meta: {
      name: "packages-smallshop-orderlist",
      isNVue: false,
      pagePath: "packages/smallshop/orderlist",
      windowTop: 44,
      shareType: "current",
    },
    title: "訂單管理"
  },
  "packages-smallshop-asset": {
    path: "/packages/smallshop/asset",
    name: "packages-smallshop-asset",
    meta: {
      name: "packages-smallshop-asset",
      isNVue: false,
      pagePath: "packages/smallshop/asset",
      windowTop: 44,
      shareType: "current",
    },
    title: "資產管理"
  },
  "packages-smallshop-data": {
    path: "/packages/smallshop/data",
    name: "packages-smallshop-data",
    meta: {
      name: "packages-smallshop-data",
      isNVue: false,
      pagePath: "packages/smallshop/data",
      windowTop: 44,
      shareType: "current",
    },
    title: "流水記錄"
  },
  "packages-smallshop-statistics": {
    path: "/packages/smallshop/statistics",
    name: "packages-smallshop-statistics",
    meta: {
      name: "packages-smallshop-statistics",
      isNVue: false,
      pagePath: "packages/smallshop/statistics",
      windowTop: 44,
      shareType: "current",
    },
    title: "數據統計"
  },
  "packages-smallshop-shopcollection": {
    path: "/packages/smallshop/shopcollection",
    name: "packages-smallshop-shopcollection",
    meta: {
      name: "packages-smallshop-shopcollection",
      isNVue: false,
      pagePath: "packages/smallshop/shopcollection",
      windowTop: 44,
      shareType: "current",
    },
    title: "收藏店鋪"
  },
  "packages-smallshop-shop": {
    path: "/packages/smallshop/shop",
    name: "packages-smallshop-shop",
    meta: {
      name: "packages-smallshop-shop",
      isNVue: false,
      pagePath: "packages/smallshop/shop",
      windowTop: 44,
      shareType: "current",
    },
    title: "我的店鋪"
  },
  "packages-smallshop-apply": {
    path: "/packages/smallshop/apply",
    name: "packages-smallshop-apply",
    meta: {
      name: "packages-smallshop-apply",
      isNVue: false,
      pagePath: "packages/smallshop/apply",
      windowTop: 44,
      shareType: "current",
    },
    title: "申請入驻"
  },
  "packages-smallshop-goodsedit": {
    path: "/packages/smallshop/goodsedit",
    name: "packages-smallshop-goodsedit",
    meta: {
      name: "packages-smallshop-goodsedit",
      isNVue: false,
      pagePath: "packages/smallshop/goodsedit",
      windowTop: 44,
      shareType: "current",
    },
    title: "商品編輯"
  },
  "packages-smallshop-recharge": {
    path: "/packages/smallshop/recharge",
    name: "packages-smallshop-recharge",
    meta: {
      name: "packages-smallshop-recharge",
      isNVue: false,
      pagePath: "packages/smallshop/recharge",
      windowTop: 44,
      shareType: "current",
    },
    title: "充值"
  },
  "packages-smallshop-log": {
    path: "/packages/smallshop/log",
    name: "packages-smallshop-log",
    meta: {
      name: "packages-smallshop-log",
      isNVue: false,
      pagePath: "packages/smallshop/log",
      windowTop: 44,
      shareType: "current",
    },
    title: "充值記錄"
  },
  "packages-smallshop-withdraw": {
    path: "/packages/smallshop/withdraw",
    name: "packages-smallshop-withdraw",
    meta: {
      name: "packages-smallshop-withdraw",
      isNVue: false,
      pagePath: "packages/smallshop/withdraw",
      windowTop: 44,
      shareType: "current",
    },
    title: "充值記錄"
  },
  "packages-smallshop-home": {
    path: "/packages/smallshop/home",
    name: "packages-smallshop-home",
    meta: {
      name: "packages-smallshop-home",
      isNVue: false,
      pagePath: "packages/smallshop/home",
      windowTop: 44,
      noLogin: true,
      shareType: "current",
    },
    title: "微店首頁",
    paramExplain: "wx_id:店鋪id"
  },
  
};
