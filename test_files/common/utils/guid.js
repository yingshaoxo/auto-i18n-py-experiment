/**
 * 本算法來源於簡書開源代碼，詳見：https://www.jianshu.com/p/fdbf293d0a85
 * 全局唯一標識符（uuid，Globally Unique Identifier）,也稱作 uuid(Universally Unique IDentifier)
 * 一般用於多個組件之間,給它一個唯一的標識符,或者v-for循環的時候,如果使用數組的index可能會導致更新列表出現問題
 * 最可能的情況是左滑刪除item或者對某條信息流"不喜歡"並去掉它的時候,會導致組件內的數據可能出現錯亂
 * v-for的時候,推薦使用後端返回的id而不是循環的index
 * @param {Number} len uuid的長度
 * @param {Boolean} firstU 將返回的首字母置為"u"
 * @param {Nubmer} radix 生成uuid的基數(意味著返回的字符串都是這個基數),2-二進制,8-八進制,10-十進制,16-十六進制
 */
function guid(len = 32, firstU = true, radix = null) {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  let uuid = [];
  radix = radix || chars.length;

  if (len) {
    // 如果指定uuid長度,只是取隨機的字符,0|x為位運算,能去掉x的小數位,返回整數位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    // rfc4122標準要求返回的uuid中,某些位為固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  // 移除第一個字符,並用u替代,因為第一個字符為數值時,該guuid不能用作id或者class
  if (firstU) {
    uuid.shift();
    return "u" + uuid.join("");
  } else {
    return uuid.join("");
  }
}

export default guid;
