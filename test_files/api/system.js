/**
 * system 調用系統api
 */

// #ifdef H5
import wxSdk from "@/common/utils/wx-sdk";
function h5Copy(content) {
  if (!document.queryCommandSupported("copy")) {
    // 不支持
    return false;
  }

  let textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.readOnly = "readOnly";
  document.body.appendChild(textarea);
  textarea.select(); // 選擇對象
  textarea.setSelectionRange(0, content.length); //核心
  let result = document.execCommand("copy"); // 執行瀏攬器復制命令
  textarea.remove();
  return result;
}
// #endif
import $Prompt from "./prompt";

export default {
  /**
   * 喚起掃碼
   * @param {object} options
   */
  scanCode(options = {}) {
    if (!options) return;
    const { onlyFromCamera, scanType } = Object.assign({}, options);
    return new Promise((resolve, reject) => {
      let types = scanType || ["barCode", "qrCode"];
      // #ifdef H5
      wxSdk
        .scanQRCode(types)
        .then(result => {
          resolve({
            scanType: "",
            result: result
          });
        })
        .catch(error => {
          reject(error);
          error && $Prompt.toast(error);
        });
      // #endif

      // #ifndef H5
      uni.scanCode({
        onlyFromCamera:
          typeof onlyFromCamera == "boolean" ? onlyFromCamera : true, //默認為true
        scanType: types, // 掃碼類型
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
        complete() {}
      });
      // #endif
    });
  },
  /**
   * 設置系統剪跕板的內容
   */
  setClipboardData(data = "") {
    return new Promise((resolve, reject) => {
      // #ifdef H5
      const flag = h5Copy(data);
      if (flag) {
        $Prompt.toast({ title: "內容已復制", icon: "success" });
        resolve();
      } else {
        reject();
      }
      // #endif

      // #ifndef H5
      uni.setClipboardData({
        data: data,
        success: () => {
          resolve();
        },
        fail: () => {
          reject();
        }
      });
      // #endif
    });
  },
  /**
   * 獲取系統剪跕板的內容
   */
  getClipboardData() {
    return new Promise((resolve, reject) => {
      // #ifdef H5

      // #endif

      // #ifndef H5
      uni.getClipboardData({
        success: () => {
          resolve();
        },
        fail: () => {
          reject();
        }
      });
      // #endif
    });
  }
};
