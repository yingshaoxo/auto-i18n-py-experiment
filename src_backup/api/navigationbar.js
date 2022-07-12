/**
 * 設置導航條
 */

export default {
  // 設置當前頁面的標題
  setTitle(options) {
    if (!options) return;
    const { title } = Object.assign(
      {},
      options.title ? options : { title: options }
    );
    return new Promise((resolve, reject) => {
      uni.setNavigationBarTitle({
        title,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 設置頁面導航條顏色
  setColor(options = {}) {
    const { frontColor, backgroundColor, animation } = Object.assign(
      {},
      options
    );
    return new Promise((resolve, reject) => {
      uni.setNavigationBarColor({
        frontColor,
        backgroundColor,
        animation,
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 設置頁面導航條顏色
  showLoading(options = {}) {
    return new Promise((resolve, reject) => {
      uni.showNavigationBarLoading({
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 設置頁面導航條顏色
  hideLoading(options = {}) {
    return new Promise((resolve, reject) => {
      uni.hideNavigationBarLoading({
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  },
  // 隱藏返回首頁按鈕
  hideHomeButton(options = {}) {
    return new Promise((resolve, reject) => {
      uni.hideHomeButton({
        success() {
          resolve();
        },
        fail() {
          reject();
        }
      });
    });
  }
};
