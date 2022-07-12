import $Request from "@/api/requset";

// 獲取數字資產設置
export function GET_BLOCKCHAINSET(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/blockChainSet",
    data,
    ...config
  });
}

// 獲取eth資產信息
export function GET_BLOCKCHAINETHINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getEthWallet",
    data,
    ...config
  });
}

// 獲取eos資產信息
export function GET_BLOCKCHAINEOSINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getEosWallet",
    data,
    ...config
  });
}

// 創建eth賬戶
export function CREAT_BLOCKCHAINETHACCOUNT(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/createEthWallet",
    data,
    isWriteIn: true,
    isShowLoading: true,
    loadingText: "創建中",
    ...config
  });
}

// 獲取gas費用
export function GET_BLOCKCHAINETHGAS(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/ethGas",
    data,
    ...config
  });
}

// 檢測eth錢包地址是否存在
export function CHECK_BLOCKCHAINETHADDRESS(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/checkEthAddress",
    data,
    isShowLoading: true,
    loadingText: "驗證地址中",
    ...config
  });
}

// 交易明細詳情
export function GET_BLOCKCHAINLOGDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/memberBlockChainRecordDetail",
    data,
    ...config
  });
}

// 驗證eos賬號是否存在
export function CHECK_BLOCKCHAINEOSACCOUNTNAME(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/checkEosAccountName",
    data,
    ...config
  });
}

// 創建eos錢包(購買內存)獲取预訂單交易号
export function CREATE_BLOCKCHAINEOSWALLET(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/createEosWallet",
    data,
    isWriteIn: true,
    ...config
  });
}

// 創建eos錢包(无需購買內存)
export function CREATE_BLOCKCHAINEOSWALLETUNPAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/createEosWalletUnPay",
    data,
    isWriteIn: true,
    ...config
  });
}

// 創建eos錢包余額支付
export function PAY_BLOCKCHAINEOSBALANCEPAY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/balancePay",
    data,
    isWriteIn: true,
    ...config
  });
}

// 獲取eth/eos圖表
export function GET_BLOCKCHAINCHART(data = {}, config = {}) {
  // let url = config.type=='eos'?"/addons/blockchain/blockchain/" + config.type + "MarketInfo":'/addons/blockchain/blockchain/getKline'
  return $Request({
    url: "/addons/blockchain/blockchain/getKline",
    data,
    ...config
  });
}

// 抵押/贖回 eos
export function SUB_BLOCKCHAINRESOURCE(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/" + config.type,
    data,
    isShowLoading: true,
    loadingText: config.typeText + "中",
    isWriteIn: true,
    ...config
  });
}

// 換算 積分和eth、eos
export function COUNT_BLOCKCHAINEXPORT(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/pointExMoney",
    data,
    ...config
  });
}

// 獲取货币列表
export function GET_BLOCKCHAINBILIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getTokenAccountList",
    data,
    ...config
  });
}

// 獲取货币信息
export function GET_BLOCKCHAINBIINFO(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getCurrencyWallet",
    data,
    ...config
  });
}

// 獲取Gwei大小值
export function GET_BLOCKCHAINGWEISIZE(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getGasGwei",
    data,
    ...config
  });
}

// 虛擬幣跟積分兌換- 換算的金额
export function COUNT_BLOCKCHAINEXMONEY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/exchangeCurrency",
    data,
    ...config
  });
}

// 兌換
export function EXCHANGE_BLOCKCHAIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/exchangeCurrencyPoint",
    data,
    isShowLoading: true,
    loadingText: "申请兌換中",
    ...config
  });
}

// 獲取gas費用
export function GET_BLOCKCHAINGAS(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getGasPrice",
    data,
    ...config
  });
}

// 轉賬
export function TRANSFER_BLOCKCHAIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/currencyTransfer",
    data,
    isShowLoading: true,
    loadingText: "申请轉賬中",
    ...config
  });
}

// 交易明細
export function GET_BLOCKCHAINLOGLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/memberCurrencyRecord",
    data,
    ...config
  });
}

// 導出eth/eos  keystore/私鑰
export function EXPORT_BLOCKCHAINKEY(data = {}, config = {}) {
  let api = config.key == "keystore" ? "exportKeyStore" : "exportPrivateKey";
  return $Request({
    url: "/addons/blockchain/blockchain/" + api,
    data,
    isShowLoading: true,
    loadingText: "導出中",
    ...config
  });
}

// 支付金額轉換成貨幣金額
export function TRAN_BLOCKCHAINPAYMONEY(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getBlockChainBalance",
    data,
    ...config
  });
}

// 支付金額轉換成貨幣金額
export function PAY_BLOCKCHAINCOIN(data = {}, config = {}) {
  return $Request({
    url: "/Member/currencyPay",
    data,
    loadingText: "支付中",
    ...config
  });
}

// 商品金額轉換貨幣金額
export function GET_BLOCKCHAINGOODSTRANCOIN(data = {}, config = {}) {
  return $Request({
    url: "/addons/blockchain/blockchain/getGoodsPrice",
    data,
    isShowLoading: true,
    ...config
  });
}
