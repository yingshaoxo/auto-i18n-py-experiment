<template>
  <view class="u-upload" v-if="!disabled">
    <view
      v-if="showUploadList"
      class="u-list-item u-preview-wrap"
      v-for="(item, index) in lists"
      :key="index"
      :style="{
        width: width + 'rpx',
        height: height ? height : width + 'rpx'
      }"
    >
      <view
        v-if="deletable"
        class="u-delete-icon"
        @tap.stop="deleteItem(index)"
      >
        <lk-icon class="u-icon" name="cross" size="14" color="#ffffff" />
      </view>
      <lk-line-progress
        v-if="showProgress && item.progress > 0 && !item.error"
        :show-percent="false"
        height="16"
        class="u-progress"
        :percent="item.progress"
      />
      <view @tap.stop="retry(index)" v-if="item.error" class="u-error-btn"
        >點擊重試</view
      >
      <image
        @tap.stop="doPreviewImage(item.url || item.path, index)"
        class="u-preview-image"
        v-if="!item.isImage"
        :src="item.url || item.path"
        :mode="imageMode"
      ></image>
    </view>
    <slot name="file" :file="lists"></slot>
    <view
      style="display: inline-block;flex:auto;"
      @tap="selectFile"
      v-if="maxCount > lists.length"
    >
      <slot name="addBtn"></slot>
      <view
        v-if="!customBtn"
        class="u-list-item u-add-wrap"
        hover-class="u-add-wrap__hover"
        hover-stay-time="150"
        :style="{
          width: width + 'rpx',
          height: height ? height : width + 'rpx'
        }"
      >
        <lk-icon name="plus" class="u-add-btn" size="24" />
        <view class="u-add-tips">{{ uploadText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * upload 圖片上傳
 * @description 該組件用於上傳圖片場景
 * @property {String} action 服務器上傳地址
 * @property {String Number} max-count 最大選擇圖片的數量（默認99）
 * @property {Boolean} custom-btn 如果需要自定義選擇圖片的按鈕，設置為true（默認false）
 * @property {Boolean} show-progress 是否顯示進度條（默認true）
 * @property {Boolean} disabled 是否啟用(顯示/移倉)組件（默認false）
 * @property {String} image-mode 預攬圖片等顯示模式，可選值為uni的image的mode屬性值（默認aspectFill）
 * @property {Object} header 上傳攜帶的頭信息，對象形式
 * @property {Object} form-data 上傳額外攜帶的參數
 * @property {String} name 上傳文件的字段名，供後端獲取使用（默認file）
 * @property {Array<String>} size-type original 原圖，compressed 壓縮圖，默認二者都有（默認['original', 'compressed']）
 * @property {Array<String>} source-type 選擇圖片的來源，album-從相冊選圖，camera-使用相機，默認二者都有（默認['album', 'camera']）
 * @property {Boolean} preview-full-image	是否可以通過uni.previewImage預攬已選擇的圖片（默認true）
 * @property {Boolean} multiple	是否開啟圖片多選，部分安卓機型不支持（默認true）
 * @property {Boolean} deletable 是否顯示删除图片的按钮（默認true）
 * @property {String Number} max-size 選擇單個文件的最大大小，單位B(byte)，默認不限制（默認Number.MAX_VALUE）
 * @property {Array<Object>} file-list 默認顯示的图片列表，數組元素為對象，必須提供url屬性
 * @property {Boolean} upload-text 選擇圖片按鈕的提示文字（默認“選擇圖片”）
 * @property {Boolean} auto-upload 選擇完圖片是否自動上傳，見上方說明（默認true）
 * @property {Boolean} show-tips 特殊情況下是否自動提示toast，見上方說明（默認true）
 * @property {Boolean} show-upload-list 是否顯示組件内部的图片预览（默認true）
 * @event {Function} on-oversize 圖片大小超出最大允許大小
 * @event {Function} on-preview 全屏預攬圖片時觸發
 * @event {Function} on-remove 移除圖片時觸發
 * @event {Function} on-success 圖片上傳成功时触发
 * @event {Function} on-change 圖片上傳后，無論成功或者失敗都會觸發
 * @event {Function} on-error 圖片上傳失败时触发
 * @event {Function} on-progress 圖片上傳过程中的进度变化过程触发
 * @event {Function} on-uploaded 所有圖片上傳完毕触发
 * @event {Function} on-choose-complete 每次選擇圖片后触发，只是讓外部可以得知每次選擇後，內部的文件列表
 * @example <u-upload :action="action" :file-list="fileList" ></u-upload>
 */
import { UPLOAD_IMAGES } from "@/common/interface/config";
export default {
  name: "u-upload",
  props: {
    //是否顯示組件自带的图片预览功能
    showUploadList: {
      type: Boolean,
      default: true
    },
    // 最大上傳數量
    maxCount: {
      type: [String, Number],
      default: 52
    },
    //  是否顯示進度條
    showProgress: {
      type: Boolean,
      default: true
    },
    // 是否啟用
    disabled: {
      type: Boolean,
      default: false
    },
    // 預攬上傳的圖片時的裁剪模式，龢image組件mode屬性一致
    imageMode: {
      type: String,
      default: "aspectFill"
    },
    // 頭部信息
    header: {
      type: Object,
      default() {
        return {};
      }
    },
    // 額外攜帶的參數
    formData: {
      type: Object,
      default() {
        return {};
      }
    },
    // 上傳的文件字段名
    name: {
      type: String,
      default: "file"
    },
    // 所選的圖片的尺寸, 可選值為original compressed
    sizeType: {
      type: Array,
      default() {
        return ["original", "compressed"];
      }
    },
    sourceType: {
      type: Array,
      default() {
        return ["album", "camera"];
      }
    },
    // 是否在點擊預攬圖後展示全屏圖片預攬
    previewFullImage: {
      type: Boolean,
      default: true
    },
    // 是否開啟圖片多選，部分安卓機型不支持
    multiple: {
      type: Boolean,
      default: true
    },
    // 是否展示刪除按鈕
    deletable: {
      type: Boolean,
      default: true
    },
    // 文件大小限制，單位为byte
    maxSize: {
      type: [String, Number],
      default: Number.MAX_VALUE
    },
    // 顯示已上传的文件列表
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    // 上傳區域的提示文字
    uploadText: {
      type: String,
      default: "選擇圖片"
    },
    // 是否自動上傳
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 是否顯示toast消息提示
    showTips: {
      type: Boolean,
      default: true
    },
    // 是否通過slot自定義傳入選擇圖標的按鈕
    customBtn: {
      type: Boolean,
      default: false
    },
    // 内部預攬圖片区域龢選擇圖片按钮的区域宽度，高等於寬
    width: {
      type: [String, Number],
      default: 160
    },
    height: {
      type: [String, Number],
      default: ""
    },
    // 自定義name，用於區別for循環N個
    customName: [String, Number]
  },
  mounted() {},
  data() {
    return {
      lists: [],
      isInCount: true,
      uploading: false
    };
  },
  watch: {
    fileList: {
      immediate: true,
      handler(val) {
        val.map(value => {
          this.lists.push({
            url: value.url,
            src: value.url,
            error: false,
            progress: 100
          });
        });
      }
    }
  },
  methods: {
    // 清除列表
    clear() {
      this.lists = [];
      // 如果是清空形式的話，發出"on-list-change"事件
      this.$emit("on-list-change", this.lists);
    },
    // 重新上傳隊列中上傳失敗的所有文件
    reUpload() {
      this.uploadFile();
    },
    // 選擇圖片
    selectFile() {
      if (this.disabled) return;
      const {
        name = "",
        maxCount,
        multiple,
        maxSize,
        sizeType,
        lists,
        camera,
        compressed,
        maxDuration,
        sourceType
      } = this;
      let chooseFile = null;
      const newMaxCount = maxCount - lists.length;
      // 設置為只選擇圖片的时候使用 chooseImage 來實現
      chooseFile = new Promise((resolve, reject) => {
        uni.chooseImage({
          count: multiple ? (newMaxCount > 9 ? 9 : newMaxCount) : 1,
          sourceType: sourceType,
          sizeType,
          success: resolve,
          fail: reject
        });
      });
      chooseFile
        .then(res => {
          let file = null;
          let listOldLength = this.lists.length;
          res.tempFiles.map((val, index) => {
            // 如果是非多選，index大於等於1或者超出最大限制數量時，不處理
            if (!multiple && index >= 1) return;
            if (val.size > maxSize) {
              this.$emit("on-oversize", val, this.lists);
              this.showToast("超出允許的文件大小");
            } else {
              if (maxCount <= lists.length) {
                this.$emit("on-exceed", val, this.lists);
                this.showToast("超出最大允许的文件個数");
                return;
              }
              lists.push({
                url: val.path,
                progress: 0,
                error: false
              });
              // 列表發生改變，發出事件，第二個参数为当前发生变化的项的索引
              this.$emit("on-list-change", this.lists);
            }
          });
          // 每次圖片選擇完，抛出一個事件，並將當前內部選擇的圖片數組拋出去
          this.$emit("on-choose-complete", this.lists);
          if (this.autoUpload) this.uploadFile(listOldLength);
        })
        .catch(error => {
          // this.$emit('on-error', error);
        });
    },
    // 提示用戶消息
    showToast(message, force = false) {
      if (this.showTips || force) {
        uni.showToast({
          title: message,
          icon: "none"
        });
      }
    },
    // 該方法供用戶通過ref調用，手動上傳
    upload() {
      this.uploadFile();
    },
    // 對失敗的圖片重新上傳
    retry(index) {
      this.lists[index].progress = 0;
      this.lists[index].error = false;
      this.lists[index].response = null;
      uni.showLoading({
        title: "重新上傳"
      });
      this.uploadFile(index);
    },
    // 上傳圖片
    uploadFile(index = 0) {
      if (this.disabled) return;
      if (this.uploading) return;
      // 全部上傳完成
      if (index >= this.lists.length) {
        this.$emit("on-uploaded", this.lists, this.customName);
        return;
      }
      // 檢查上傳地址
      // if (!this.action) {
      //   this.showToast("請配置上傳地址", true);
      //   return;
      // }
      // 檢查是否是已上傳或者正在上傳中
      if (this.lists[index].progress == 100) {
        if (this.autoUpload == false) this.uploadFile(index + 1);
        return;
      }
      this.lists[index].error = false;
      this.uploading = true;

      // 創建上傳對象
      UPLOAD_IMAGES({
        filePath: this.lists[index].url,
        name: this.name,
        formData: this.formData,
        isShowLoading: true,
        loadingText: "上傳中",
        onProgressUpdate: res => {
          // 上傳進度
          if (res.progress > 0) {
            this.lists[index].progress = res.progress;
            this.$emit("on-progress", res, index, this.lists, this.customName);
          }
        }
      })
        .then(res => {
          // 上傳成功
          this.lists[index].response = res.data;
          this.lists[index].progress = 100;
          this.lists[index].error = false;
          this.uploading = false;
          this.$emit(
            "on-success",
            res.data,
            index,
            this.lists,
            this.customName
          );
          this.uploadFile(index + 1);
        })
        .catch(e => {
          this.uploading = false;
          this.uploadError(index, e);
          this.uploadFile(index + 1);
        });
    },
    // 上傳失敗
    uploadError(index, err) {
      this.lists[index].progress = 0;
      this.lists[index].error = true;
      this.lists[index].response = null;
      this.$emit("on-error", err, index, this.lists, this.customName);
      this.showToast("上傳失敗，請重試");
    },
    // 删除一個图片
    deleteItem(index) {
      uni.showModal({
        title: "提示",
        content: "您確定要刪除此項嗎？",
        success: res => {
          if (res.confirm) {
            if (
              this.lists[index].process < 100 &&
              this.lists[index].process > 0
            ) {
              typeof this.lists[index].uploadTask != "undefined" &&
                this.lists[index].uploadTask.abort();
            }
            this.lists.splice(index, 1);
            this.$forceUpdate();
            this.$emit("on-remove", index, this.lists, this.customName);
            this.showToast("移除成功");
            // 列表發生改變，發出事件
            this.$emit("on-list-change", this.lists, this.customName);
          }
        }
      });
    },
    // 用戶通過ref手動的形式，移除一張圖片
    remove(index) {
      // 判斷索引的合法範圍
      if (index >= 0 && index < this.lists.length) {
        this.lists.splice(index, 1);
        this.$emit("on-list-change", this.lists, this.customName);
      }
    },
    // 預攬圖片
    doPreviewImage(url, index) {
      if (!this.previewFullImage) return;
      const images = this.lists.map(item => item.url || item.path);
      uni.previewImage({
        urls: images,
        current: url,
        success: () => {
          this.$emit("on-preview", url, this.lists, this.customName);
        },
        fail: () => {
          uni.showToast({
            title: "預攬圖片失败",
            icon: "none"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.u-upload {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -8rpx;
}

.u-list-item {
  width: 160rpx;
  height: 160rpx;
  overflow: hidden;
  margin: 8rpx;
  background: rgb(244, 245, 246);
  position: relative;
  border-radius: 10rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.u-preview-wrap {
  border: 1px solid rgb(235, 236, 238);
}

.u-add-wrap {
  flex-direction: column;
  color: $text-gray;
  font-size: $font-size-sm;
  line-height: 1.2;
}

.u-add-tips {
  margin-top: 20rpx;
}

.u-add-wrap__hover {
  background-color: rgb(235, 236, 238);
}

.u-preview-image {
  display: block;
  width: 100%;
  height: 100%;
}

.u-delete-icon {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100rpx;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-progress {
  position: absolute;
  bottom: 10rpx;
  left: 8rpx;
  right: 8rpx;
  z-index: 9;
  width: auto;
}

.u-error-btn {
  color: #ffffff;
  background-color: red;
  font-size: 20rpx;
  padding: 4px 0;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  line-height: 1;
}
</style>
