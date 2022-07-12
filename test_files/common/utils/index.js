import md5 from "@/common/lib/md5.min";
import $Store from "@/store";
import config from "@/config";

export const envConfig = config[process.env.NODE_ENV];

/**
 * 獲取當前平臺  H5/APP/MP...
 * @param {string} value 傳入指定平臺名稱 返回Boolean
 */
export function platform(value) {
  let name = "";
  let isMp = false;

  // #ifdef APP-PLUS-NVUE
  name = "APPNVUE";
  // #endif

  // #ifdef APP-PLUS
  name = "APP";
  // #endif

  // #ifdef H5
  name = "H5";
  // #endif

  // #ifdef MP-ALIPAY
  name = "ALIPAY";
  isMp = true;
  // #endif

  // #ifdef MP-BAIDU
  name = "BAIDU";
  isMp = true;
  // #endif

  // #ifdef MP-QQ
  name = "QQ";
  isMp = true;
  // #endif

  // #ifdef MP-WEIXIN
  name = "WEIXIN";
  isMp = true;
  // #endif

  // #ifdef MP-TOUTIAO
  name = "TOUTIAO";
  isMp = true;
  // #endif

  return value ? value === name || (value === "MP" && isMp) : name;
}

/**
 * 判斷是否在微信環境
 */
export function isWeixin() {
  // #ifndef H5
  return false;
  // #endif
  if (!navigator) return false;
  const ua = navigator.userAgent.toLowerCase();
  return false;
}

/**
 * 判斷客戶端系統
 * system  系統名稱  android/ios
 */
export function isBrowser(system) {
  const pf = uni.getSystemInfoSync().platform;
  return system === pf;
  // if (!navigator || !system) return null;
  // const arr = ["android", "ios"];
  // if (arr.indexOf(system) == -1) return null;
  // var u = navigator.userAgent;
  // var s = {
  //   android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android終端
  //   ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios終端
  // };
  // return s[system];
}

/**
 * 驗證請求接口簽名
 * @param obj  請求參數
 * @returns string
 */
export function authSign(obj, key) {
  let api_key = key || $Store.state.authKey;
  // console.log(obj)
  // let newObj = "";
  // if (obj && typeof obj == "object") {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       obj[key] = obj[key] === undefined ? "" : obj[key];
  //     }
  //   }
  //   newObj = Object.keys(obj).join("");
  // }
  return md5(api_key + String(obj).toLocaleLowerCase());
}

/**
 * 首字母大寫
 */
export function firstToUpperCase(str) {
  var temp = [];
  str = str.toLowerCase();
  temp = str.split(" ");
  for (var i = 0; i < temp.length; i++) {
    var str_temp = temp[i].charAt(0);
    str_temp = str_temp.toUpperCase();
    temp[i] = temp[i].replace(temp[i].charAt(0), str_temp);
  }
  str = temp.join(" ");
  return str;
}

/**
 * 時間日期轉時間戳
 */
export function dateToTimestamp(time, millisecond) {
  time = String(time || "");
  var timestr = time.indexOf("-") != -1 ? time.replace(/-/g, "/") : time;
  var date = new Date(timestr);
  var time1 = date.getTime(); //毫秒
  var time3 = Math.round(date / 1000); // 秒
  if (millisecond) {
    return time1;
  } else {
    return time3;
  }
}

/**
 * 處理時間戳
 * @param {*} timestamp 時間戳
 * @param {*} fmt 日期格式(YYYY-MM-DD hh:mm:ss)
 */
export function formatDate(timestamp = "", fmt = "YYYY-MM-DD") {
  // yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh時MM分等,可自定義組合
  timestamp = parseInt(timestamp);
  // 如果為null,则格式化当前時间
  if (timestamp == null) timestamp = Number(new Date());
  /**
   * 判断用户输入的時間戳是秒还是毫秒,一般前端js获取的時間戳是毫秒(13位),後端傳過來的為秒(10位)
   * 或者存在負數情況
   */

  if (timestamp.toString().length <= 10 || timestamp < 0) {
    timestamp *= 1000;
  }

  let date = new Date(timestamp);
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "D+": date.getDate().toString(), // 日
    "h+": date.getHours().toString(), // 時
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以繼續添加，必須轉化成字符串
  };

  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      var tkey = ret[1];
      var val = tkey.length == 1 ? opt[k] : opt[k].padStart(tkey.length, "0");
      fmt = fmt.replace(tkey, val);
    }
  }
  return fmt;
}
/**
 * 時間戳轉為 時分秒 多久之前
 * @param value 秒
 */
export function formatSeconds(value) {
  var theTime = parseInt(value); // 秒
  var middle = 0; // 分
  var hour = 0; // 小時

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (middle > 0) {
    result = "" + parseInt(middle) + "分" + result;
  }
  if (hour > 0) {
    result = "" + parseInt(hour) + "小時" + result;
  }
  return result;
}

/**
 * 時間戳轉為多久之前
 * @param String timestamp 時間戳
 * @param String | Boolean format 如果為時间格式字符串，超出一定時间范围，返回固定的時间格式；
 * 如果為布尔值false，无论什么時间，都返回多久以前的格式
 */
export function dateFormatFrom(timestamp = "", format = "YYYY-MM-DD") {
  if (timestamp == null) timestamp = Number(new Date());
  timestamp = parseInt(timestamp);
  // 判断用户输入的時間戳是秒还是毫秒,一般前端js获取的時間戳是毫秒(13位),後端傳過來的為秒(10位)
  if (timestamp.toString().length == 10) timestamp *= 1000;
  var timer = new Date().getTime() - timestamp;
  timer = parseInt(timer / 1000);
  // 如果小於5分鐘,則返回"剛剛",其他以此類推
  let tips = "";
  // console.log(timer);
  switch (true) {
    case timer < 300:
      tips = "剛剛";
      break;
    case timer >= 300 && timer < 3600:
      tips = parseInt(timer / 60) + "分鐘前";
      break;
    case timer >= 3600 && timer < 86400:
      tips = parseInt(timer / 3600) + "小時前";
      break;
    case timer >= 86400 && timer < 2592000:
      tips = parseInt(timer / 86400) + "天前";
      break;
    default:
      // 如果format為false，则无论什么時間戳，都顯示xx之前
      if (format === false) {
        if (timer >= 2592000 && timer < 365 * 86400) {
          tips = parseInt(timer / (86400 * 30)) + "個月前";
        } else {
          tips = parseInt(timer / (86400 * 365)) + "年前";
        }
      } else {
        tips = formatDate(timestamp, format);
      }
  }
  return tips;
}

/**
 * 拼接單位符號
 * @param {string} value 值
 * @param {string} symbol 單位符號
 * @param {Boolean} isBefore 位置 是否在前面添加（默認false）
 */
export function symbol(value, symbol, isBefore) {
  let str = String(value);
  return isBefore ? symbol + str : str + symbol;
}

/**
 * 價格符號
 * @param {string/number} value 值
 */
export function yuan(value = 0) {
  var p = parseFloat(value || 0);
  var isDot = p.toString().indexOf(".") != -1;
  var fix = !isDot ? 0 : 2;
  var num = p.toFixed(fix);
  return "$" + num;
}

// 虛擬幣保留小數點四位
export function bi(value = 0, fixedNum = 4, symbol) {
  return symbol
    ? symbol + parseFloat(value).toFixed(fixedNum)
    : parseFloat(value).toFixed(fixedNum);
}

/**
 * 獲取字符串url指定參數值
 * @param {string} str 字符串url
 * @param {string} param  指定參數名
 */
export function getUriParam(str, param) {
  var query = str.split("?")[1];
  if (query) {
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == param) {
        return pair[1];
      }
    }
  }
  return false;
}

/**
 * url中的參數解析成對象
 * @param {*} url
 */
export function decodeUriParams(url = "") {
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substr(1).split("=");
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

/**
 * 拼接对象為请求字符串
 * @param {Object} obj - 待拼接的對象
 * @returns {string} - 拼接成的請求字符串
 */
export function encodeUriParams(obj = {}, encode) {
  const params = [];
  Object.keys(obj).forEach(key => {
    let value = obj[key];
    // 如果值為undefined將其置空
    if (typeof value === "undefined") {
      value = "";
    }
    // 對於需要編碼的文本（比如中文）進行編碼
    let uriValue = encode ? encodeURIComponent(value) : value;
    params.push([key, uriValue].join("="));
  });

  return params.join("&");
}

/**
 * 判断是否為对象
 * @param {any} x
 */
export function isObject(x) {
  const type = typeof x;
  return x !== null && (type === "object" || type === "function");
}

/**
 * 判斷是否有值
 * @param {any} x
 */
export function isDef(value) {
  return value !== undefined && value !== null && value !== "";
}

/**
 * 判断是否為空对象或空数组
 * @param obj
 */
export function isEmpty(obj) {
  if (!obj && obj !== 0 && obj !== "") {
    return true;
  }
  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  }
  if (isObject(obj) && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
}

/**
 * 把一些不必要的參數進行格式化掉，完成url的美觀
 * @param {String} URLQuery URL中傳遞的參數
 */
export function formatURLQuery(query) {
  switch (query.trim()) {
    case `query=%7B%7D`:
    case `%7B%7D`:
    case `?query=%7B%7D`:
    case `?`:
    case `?undefined`:
    case `?null`:
    case `?[object Object]`:
    case `?query={}`:
      query = "";
      break;
  }
  return query;
}

/**
 * 路由path轉name
 * @param {string} path 路徑
 * /pages/mall/index ==> pages-mall-index
 */
export function routePathToName(path = "") {
  const p = path.split("?")[0];
  return p
    .split("/")
    .filter(s => s && String(s).trim())
    .join("-");
}

/**
 * px轉rpx單位
 * @param {number/string} value
 */
export function pxTorpx(value) {
  return typeof value !== "number" && String(value).indexOf("rpx") !== -1
    ? value
    : `${parseInt(value) * 2}rpx`;
}

/**
 * 添加圖片資源域名
 */
export function addImgSrcDomain(src) {
  const domain =
    platform("H5") && process.env.NODE_ENV === "production"
      ? location.origin
      : $Store.state.domain;
  let newSrc = "";
  if (typeof src != "string") return "";
  if (src.indexOf("http://") == 0 || src.indexOf("https://") == 0) return src;
  src.substr(0, 1) !== "/"
    ? (newSrc = domain + "/" + src)
    : (newSrc = domain + src);
  return newSrc;
}

/**
 * 获取服务端時间
 */
export function getServerTime() {
  return new Promise((resolve, reject) => {
    uni.request({
      // #ifdef H5
      url: "?t=" + new Date().getTime(),
      // #endif

      // #ifndef H5
      url: $Store.getters.route.origin + "/?t=" + new Date().getTime(),
      // #endif
      data: {},
      header: {},
      complete: ({ statusCode, header }) => {
        if (statusCode == 200) {
          header.date = header.date || header.Date;
          var timestamp = new Date(header.date).getTime();
          resolve(timestamp);
        } else {
          resolve(new Date().getTime());
        }
      }
    });
  });
}

/**
 * 合併對象
 * @param {} target
 */
export function merge(target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    let source = arguments[i] || {};
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        let value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }
  return target;
}

/**
 * 手機號中間數字以星號表示
 */
export function encryptMobile(s) {
  var reg = /^(\d{3})\d+(\d{4})$/;
  var str = String(s || "");
  str = str.replace(reg, "$1 **** $2");
  return str;
}

/**
 * 銀行卡中間數字以星號表示
 */
export function encryptBankCard(s) {
  var reg = /^(\d{4})\d+(\d{4})$/;
  var str = String(s || "");
  str = str.replace(reg, "$1 **** **** $2");
  return str;
}

/**
 * 當數量超過5位数時，已w替代
 */
export function wan(value = 0) {
  var value = parseFloat(value) || 0;
  let num = 0;
  if (value > 10000) {
    num = (value - (value % 1000)) / 10000 + "w";
  } else {
    num = value;
  }
  return num;
}

/**
 * 处理发布信息時间
 */
export function timeText(value = 0) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var month = day * 30;
  var year = month * 12;
  var time1 = new Date().getTime(); //当前的時間戳
  var time2 = parseInt(value * 1000); //指定時间的時間戳
  var time = time1 - time2;

  var result = null;
  if (time < 0) {
  } else if (time / year >= 1) {
    result = parseInt(time / year) + "年前";
  } else if (time / month >= 1) {
    result = parseInt(time / month) + "月前";
  } else if (time / week >= 1) {
    result = parseInt(time / week) + "周前";
  } else if (time / day >= 1) {
    result = parseInt(time / day) + "天前";
  } else if (time / hour >= 1) {
    result = parseInt(time / hour) + "小時前";
  } else if (time / minute >= 1) {
    result = parseInt(time / minute) + "分鐘前";
  } else {
    result = "剛剛发布";
  }
  return result;
}

/**
 * 函數節流
 * @param {*} fn 事件回調
 * @param {*} delay 時间间隔的阈值
 */
export function throttle(fn, delay = 500) {
  // last為上一次触发回调的時间, timer是定時器
  let last = 0,
    timer = null;
  // 將throttle處理結果當作函數返回

  return function () {
    // 保留调用時的this上下文
    let context = this;
    // 保留调用時传入的参数
    let args = arguments;
    // 记录本次触发回调的時间
    let now = +new Date();

    // 判断上次触发的時间和本次触发的時间差是否小於時间间隔的阈值
    if (now - last < delay) {
      // 如果時间间隔小於我们设定的時间间隔阈值，则為本次触发操作设立一个新的定時器
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      // 如果時间间隔超出了我们设定的時间间隔阈值，那就不等了，無論如何要反饋給用戶一次響應
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 函數防抖
 * @param {*} fn 事件回調
 * @param {*} interval 時间间隔的阈值
 */
export function debounce(fn, interval = 500) {
  let timeout = null;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, interval);
  };
}

/**
 * 限制輸入框小數點後保留四位小數
 */
export function handleInput(e, n = 4) {
  let val = e;
  // 通過正則過濾小數點後四位
  if (n === 6) {
    val = e.match(/^\d*(\.?\d{0,5})/g)[0] || null;
  } else {
    val = e.match(/^\d*(\.?\d{0,3})/g)[0] || null;
  }
  return val;
}
/**
 * 限制輸入正整數，不能小數點
 */
export function handleInt(e) {
  let val = String(e || "");
  val = val.replace(/\D/g, "");
  return val;
}

/**
 * 計算圖片在視圖上的高度
 * 圖片原始寬度 w
 * 圖片原始高度 h
 *
 * @reutrn height  單位px
 */
export function countImageHeight(w = 0, h = 0) {
  const windowWidth = uni.getSystemInfoSync().windowWidth; // 屏幕視圖寬度
  const s = parseFloat(w) / windowWidth;
  return parseFloat(h) / s;
}

/**
 * 計算圖片在視圖上的高度
 * 圖片原始寬度 w
 * 圖片原始高度 h
 * 視圖寬度 dw
 *
 * @reutrn height  單位px
 */
export function countForViewImgHeight(w = 0, h = 0, dw = 0) {
  var _w = parseFloat(w) || 0;
  var _h = parseFloat(h) || 0;
  var _dw = parseFloat(dw) || uni.getSystemInfoSync().windowWidth;
  var s = _w / _dw;
  var v = isNaN(_h / s) ? 0 : _h / s;
  return v;
}

// 隨機生成RGBA顏色
export function randomRgbaColor() {
  var r = Math.floor(Math.random() * 256); //隨機生成256以內r值
  var g = Math.floor(Math.random() * 256); //隨機生成256以內g值
  var b = Math.floor(Math.random() * 256); //隨機生成256以內b值
  var alpha = Math.random(); //隨機生成1以內a值
  return `rgba(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式顏色
}

// 遞歸遍歷對象，將所有属性值為 string 可轉成 number 的屬性值 全部轉為number
export function strNumToNmber(data = {}) {
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key]) {
      if (typeof data[key] === "string") {
        if (!isNaN(Number(data[key]))) {
          if (Number(data[key]) < 10) {
            // 小於 10的數值， 轉换成整数 并 字符串長度 為1，避免 01,001等情况被轉换
            if (Number.isInteger(Number(data[key])) && data[key].length === 1) {
              data[key] = Number(data[key]);
            }
          }
        }
      } else {
        if (typeof data[key] === "object") {
          strNumToNmber(data[key]);
        }
      }
    }
  }
  return data;
}
