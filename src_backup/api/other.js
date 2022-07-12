/**
 *
 */

// #ifdef APP-PLUS
import { GET_APPVERSIONIFNO } from "@/common/interface/config";
import { isBrowser } from "@/common/utils";
/**
 * 版本號對比
 * @param {*} a  當前版本號
 * @param {*} b  線上版本號
 * return 是否需要更新
 */
function compare(a, b) {
  if (a === b) {
    return false;
  }
  var a_components = String(a).split(".");
  var b_components = String(b).split(".");
  var len = Math.min(a_components.length, b_components.length);
  for (var i = 0; i < len; i++) {
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return false;
    }
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return true;
    }
  }
  if (a_components.length > b_components.length) {
    return false;
  }
  if (a_components.length < b_components.length) {
    return true;
  }
  return false;
}
// #endif

export default {
  // 更新管理
  updateManager(options = {}) {
    return new Promise((resolve, reject) => {
      if (uni.canIUse("getUpdateManager")) {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          if (res.hasUpdate) {
            //小程序有新版本，則靜默下載新版本，做好更新準備
            updateManager.onUpdateReady(function() {
              uni.showModal({
                title: "更新提示",
                content: "新版本已經準備好，是否重啟應用？",
                success: function(res) {
                  if (res.confirm) {
                    //新的版本已經下載好，調用 applyUpdate 應用新版本並重啟
                    updateManager.applyUpdate();
                  } else if (res.cancel) {
                    // 如果需要強制更新，則給出二次彈窗，如果不需要，則這裡的代碼都可以刪掉了
                    uni.showModal({
                      title: "溫馨提示~",
                      content:
                        "本次版本更新涉及到新的功能添加，舊版本無法正常訪問的哦~",
                      success: function(res) {
                        updateManager.applyUpdate();
                      }
                    });
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function() {
              uni.showModal({
                title: "已經有新版本了喲~",
                content:
                  "新版本已經上線啦~，請您刪除當前小程序，重新搜索打開喲~"
              });
            });
          }
        });
      } else {
        uni.showModal({
          title: "提示",
          content:
            "當前微信版本過低，無法使用該功能，請升級到最新微信版本後重試。"
        });
      }
    });
  },
  // 跳轉其他小程序
  toMiniProgram(options = {}) {
    // #ifdef MP
    uni.navigateToMiniProgram({
      appId: options.appid,
      path: options.path || "",
      extraData: {
        ...(options.extraData || {})
      },
      complete: res => {
        console.log(res);
      }
    });
    // #endif
    // #ifdef APP-PLUS
    plus.share.getServices(res => {
      if (res) {
        res.launchMiniProgram({
          id: options.appid,
          path: options.path || ""
        });
      } else {
        plus.nativeUI.alert("當前環境不支持微信操作!");
      }
    });
    // #endif
  },
  // app 熱更新
  appUpdateManager(options = {}) {
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
      console.log(widgetInfo);
      console.log(options);
      // uni.showToast({
      //   title: compare(widgetInfo.version, options.version)
      //     ? "需要更新"
      //     : "不用更新",
      //   position: "bottom"
      // });

      // uni.showModal({
      //   content: `${JSON.stringify(widgetInfo)}-${JSON.stringify(options)}`
      // });
      if (
        options.version &&
        options.wgturl &&
        compare(widgetInfo.version, options.version)
      ) {
        // 进行熱更新
        uni.downloadFile({
          url: options.wgturl,
          success: downloadResult => {
            console.log(downloadResult);
            if (downloadResult.statusCode === 200) {
              plus.runtime.install(
                downloadResult.tempFilePath,
                {
                  force: false
                },
                function() {
                  console.log("install success...");
                  uni.showToast({
                    title: `更新完成`,
                    position: "bottom"
                  });
                  plus.runtime.restart();
                },
                function(e) {
                  console.error("install fail...");
                }
              );
            }
          }
        });
      }
      return false;
      // 其他方案，暫不使用
      GET_APPVERSIONIFNO({
        type: isBrowser("ios") ? 1 : 2,
        version: widgetInfo.version
      })
        .then(({ data }) => {
          var reg = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/;
          if (!reg.test(data.version_num)) {
            // 版本號格式不正確
            return false;
          }
          if (String(data.version_num) == String(widgetInfo.version)) {
            // 版本一致，無需更新
            return false;
          }
          let widgetVersions = String(widgetInfo.version).split("."); // 當前app版本號
          let resultVersions = String(data.version_num).split("."); // 服务端版本號
          if (widgetVersions[0] < resultVersions[0]) {
            // 大版本更新,需要重新下載整包
            uni.showModal({
              title: "更新提示",
              content: `${data.update_content || "暫無更新日誌"}`,
              success: res => {
                let url = isBrowser("ios") ? data.ios_url : data.apk_url;
                if (url) {
                  plus.runtime.openURL(url);
                }
              },
              fail: () => {}
            });
          } else {
            if (data.wgt_url) {
              uni.downloadFile({
                url: data.wgt_url,
                success: downloadResult => {
                  console.log(downloadResult);
                  if (downloadResult.statusCode === 200) {
                    plus.runtime.install(
                      downloadResult.tempFilePath,
                      {
                        force: false
                      },
                      function() {
                        console.log("install success...");
                        uni.showToast({
                          title: `更新完成`,
                          position: "bottom"
                        });
                        plus.runtime.restart();
                      },
                      function(e) {
                        console.error("install fail...");
                      }
                    );
                  }
                }
              });
            }
          }
        })
        .catch(() => {});
    });
    // #endif
  }
};
