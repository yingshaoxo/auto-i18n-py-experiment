/**
 * 調起設置媒體相關
 */

export default {
  //從本地相冊選擇圖片或使用相機拍照。
  chooseImage(options = {}) {
    const { count, sizeType, sourceType } = Object.assign({}, options);
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: count || 1, //默認1
        sizeType: sizeType || ["original", "compressed"], //可以指定是原圖還是壓縮圖，默認二者都有
        sourceType: sourceType || ["album", "camera"],
        success(res) {
          console.log(JSON.stringify(res));
          resolve(res);
        },
        fail() {
          reject();
        }
      });
    });
  }
};
