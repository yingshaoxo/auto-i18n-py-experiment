import $Request from "@/api/requset";

// 秒殺商品列表標籤
export function GET_SECKILLTAG(data = {}, config = {}) {
  return $Request({
    url: "/addons/seckill/seckill/getAllSecTime",
    data,
    noLogin: true,
    ...config
  });
}

// 秒殺商品列表
export function GET_SECKILLLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/seckill/seckill/getSeckillGoodsList",
    data,
    noLogin: true,
    ...config
  });
}

// 首頁裝修模板
export function GET_CUSTOMSECKILL(data = {}, config = {}) {
  return $Request({
    url: "/addons/seckill/seckill/getIndexSeckillList",
    data,
    noLogin: true,
    ...config
  });
}
