import $Prompt from "@/api/prompt";

/**
 * 驗證是否為空
 */
export function validEmpty(value, msg) {
  if (!value || value == "") {
    $Prompt.toast(msg ? msg : "不能為空");
    return false;
  } else {
    return true;
  }
}

/**
 * 驗證手機號
 */
export function validMobile(value, areaCode = 86) {
  if (areaCode && areaCode != 86) {
    // 非86 非國內手機號區號 不驗證
    return true;
  }
  value = String(value || "");
  value = value.replace(/[^-|\d]/g, "");
  let valid =
    /^((\+86)|(\+852)|(852)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
  if (!valid) {
    $Prompt.toast("請填入正確的手機號碼");
  }
  return valid;
}

/**
 * 驗證用戶名
 */
export function validUsername(value, msg) {
  if (!value || value == "") {
    $Prompt.toast(msg ? msg : "用户名或者手机不能為空");
    return false;
  } else {
    return true;
  }
}

/**
 * 驗證短信驗證
 */
export function validMsgcode(value) {
  if (!value || value == "") {
    $Prompt.toast("验证码不能為空");
    return false;
  } else if (value.length !== 6) {
    $Prompt.toast("驗證碼為6位數");
    return false;
  } else {
    return true;
  }
}

/**
 * 驗證圖片驗證
 */
export function validImgcode(value) {
  if (!value || value == "") {
    $Prompt.toast("图片验证码不能為空");
    return false;
  } else if (value.length !== 4) {
    $Prompt.toast("图片驗證碼為4位數");
    return false;
  } else {
    return true;
  }
}

/**
 * 驗證密碼
 */
export function validPassword(value) {
  var patrn = /^(\w){6,20}$/;
  if (!value || value == "") {
    $Prompt.toast("密码不能為空");
    return false;
  } else if (!patrn.exec(value)) {
    $Prompt.toast("只能輸入6-20個字母、數字、下劃線");
    return false;
  } else {
    return true;
  }
}

/**
 * 驗證兩次密碼是否符合
 */
export function validCheckPassword(value1, value2) {
  if (!value2 || value2 == "") {
    $Prompt.toast("确认密码不能為空");
    return false;
  } else if (value1 !== value2) {
    $Prompt.toast("兩次密碼不符合");
    return false;
  } else {
    return true;
  }
}

/**
 * 驗證郵箱
 */
export function validEmail(value) {
  var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (value === "") {
    $Prompt.toast("邮箱不能為空！");
    return false;
  } else if (!reg.test(value)) {
    $Prompt.toast("請輸入正確的郵箱");
    return false;
  } else {
    return true;
  }
}

// 驗證身份證
export function validCard(value) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    $Prompt.toast("請輸入正確的身份證號！");
    return false;
  } else {
    return true;
  }
}

// 驗證支付密碼
export function validPayPassword(value, len) {
  var reg = /^[0-9a-zA-Z_%&.,=\-_]{9,20}$/;
  var text = "由9-20個字母、數字、普通字符組成";
  if (len == 6) {
    reg = /^[0-9a-zA-Z_%&.,=\-_]{6}$/;
    text = "長度為6位，由字母、數字、普通字符組成";
  }
  if (len == 9) {
    reg = /^[0-9a-zA-Z_%&.,=\-_]{9}$/;
    text = "長度為9位，由字母、數字、普通字符組成";
  }
  if (!reg.test(value)) {
    $Prompt.toast(text);
    return false;
  } else {
    return true;
  }
}

// 验证纯數字
export function validNumber(value, msg) {
  var reg = /^[1-9]+[0-9]*]*$/;
  if (reg.test(value)) {
    $Prompt.toast(msg ? msg : "不能为纯數字");
    return false;
  } else {
    return true;
  }
}
