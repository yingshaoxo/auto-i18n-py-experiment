const utils = require("./common/utils");
const manifest = require("./manifest.json");
/**
 * 其他配置需前往manifest.json 配置文件修改
 *
 * 開發h5時解決跨域需前往manifest.json 配置文件修改 h5->devServer ，填寫相關請求域名
 *
 * 開發微信小程序需前往manifest.json 配置文件修改 mp-weixin->appid  (開發其他平台小程序也一样需要修改appid)
 *
 * name       ==>    應用名稱(一般不修改，用於項目標識用，存儲的key值會以name值為其中一個字符)
 * version    ==>    版本號
 * domain     ==>    域名(h5端自動獲取訪問域名，開發环境需要填写域名)
 * subDomain  ==>    子域名、二級域名，獨立域名(小程序用到)(h5端自動獲取訪問域名)
 * websiteid  ==>    商戶id(小程序用到)
 * static     ==>    資源路徑 (存放圖片資源，字體icon等)
 * base_api   ==>    請求域名(域名拼接/wapapi) 一般不修改
 * auth_key   ==>    請求接口授權碼 由後臺提供
 */

/**
 * 版本定義（順序指向）：
 * 1，主版本號，特指發生重大變革
 * 2，次要版本，發生功能變更（如增加應用等）
 * 3，修復版本，完善和修復
 */

// 生產環境配置
const production = {
  NAME: "shopvslai",
  VERSION: manifest.versionName,
  // DOMAIN: "http://shopdadmin.cheyun666.com",
  // SUBDOMAIN: "http://shopdadmin.cheyun666.com",
  DOMAIN: "https://shop.yahtai.com",
  SUBDOMAIN: "https://shop.yahtai.com",
  WEBSITE_ID: 0,
  STATIC: "/public/app",
  BASE_API: "wapapi",
  AUTH_KEY: "3qf20o9lrbfc9qsb"
};

// 開發环境配置
const development = {};

console.info("version", production.VERSION);

export default {
  production,
  development: utils.merge(production, development)
};
