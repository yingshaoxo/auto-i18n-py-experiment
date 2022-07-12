<template>
  <view class="pages">
    <canvas
      class="qrcode"
      canvas-id="qrcode"
      :style="{ width: `${qrcodeSize}px`, height: `${qrcodeSize}px` }"
    />
    <lk-tabs nav-per-view="2" theme-color>
      <lk-tab :title="item.text" v-for="(item, index) in tabs" :key="index">
        <view class="box" v-show="item.type == 'Key'">
          <view class="key-box card-group-box">{{ item.content }}</view>
          <view class="foot-btn-group">
            <lk-button round theme-color block @click="onCopy(item.content)">
              復制 {{ item.text }}
            </lk-button>
          </view>
        </view>
        <view class="box" v-show="item.type == 'Qr'">
          <view class="qr-box card-group-box">
            <view class="img" v-show="qrshow" @click="qrshow = !qrshow">
              <image :src="qrcodeSrc" class="qr" />
            </view>
            <view class="mask" v-show="!qrshow">
              <lk-icon
                class-prefix="v-icon"
                size="120"
                color="#666"
                square
                name="v-icon-invisible"
              />
              <lk-button
                round
                size="small"
                theme-color
                :loading="qrcodeLoading"
                @click="showQrImg(item.content)"
                >顯示二維碼</lk-button
              >
            </view>
          </view>
        </view>
        <view class="card-group-box">
          <lk-cell
            :label="child.value"
            v-for="(child, n) in item.notes"
            :key="n"
          >
            <text class="text-red" slot="title">{{ child.title }}</text>
          </lk-cell>
        </view>
      </lk-tab>
    </lk-tabs>
  </view>
</template>

<script>
import blockchain from "./mixin";
import { mapState } from "vuex";
import $Storage from "@/api/storage";
import $System from "@/api/system";
import uQRCode from "@/common/utils/poster/uqrcode";
export default {
  name: "packages-blockchain-export",
  data() {
    return {
      active: 0,
      keyType: "",
      qrshow: false,
      qrcodeText: "",
      qrcodeLoading: false,
      qrcodeSize: uni.upx2px(590),
      qrcodeSrc: ""
    };
  },
  mixins: [blockchain],
  computed: {
    ...mapState({
      blockchain: ({ blockchain }) => blockchain
    }),
    tabs() {
      const arr = [
        {
          type: "Key",
          text: "",
          content: "",
          notes: [
            {
              title: "離線保存",
              value: "切勿保存至郵箱、記事本、網盤、聊天工具等，非常危險。"
            },
            {
              title: "請勿使用網絡傳輸",
              value:
                "請勿通過網絡工具傳輸，一旦被黑客獲取將造成不可挽回的資產損失。建議離線設備通過掃二維碼方式傳輸。"
            },
            {
              title: "密碼管理工具保存",
              value: "建议使用密碼管理工具保存管理。"
            }
          ]
        },
        {
          type: "Qr",
          text: "二維碼",
          content: "",
          notes: [
            {
              title: "僅供直接掃描",
              value:
                "二維碼禁止保存、截圖、拍照。僅供用戶在安全環境下直接掃描來方便導入錢包。"
            },
            {
              title: "在安全環境下使用",
              value:
                "請確保在四周無人及無攝像頭的情況下使用。二維碼一旦被他人获取将造成不可挽回的资产损失。"
            }
          ]
        }
      ];
      if (this.keyType == "keystore") {
        arr[0].text = "KeyStore";
      }
      if (this.keyType == "privatekey") {
        arr[0].text = "私鑰";
      }
      arr[0].content = $Storage.get(this.pageType + this.keyType);
      arr[1].content = $Storage.get(this.pageType + this.keyType);
      return arr;
    }
  },
  onLoad(query) {
    this.keyType = query.key || "";
    if (!$Storage.get(query.type + this.keyType)) {
      this.$Prompt
        .modal({
          title: "提示",
          content: this.keyType + "已失效，請重新導出！",
          showCancel: false
        })
        .then(() => {
          this.$Navigate.replace({
            path: "/packages/blockchain/index",
            query: { type: query.type }
          });
        });
    }
  },
  onUnload() {
    this.$store.commit("removeBlockchainExportKey", {
      type: this.pageType,
      key: this.keyType
    });
  },
  methods: {
    showQrImg(text) {
      if (this.qrcodeSrc) {
        return (this.qrshow = !this.qrshow);
      }
      this.qrcodeLoading = true;
      uQRCode.make({
        canvasId: "qrcode",
        componentInstance: this,
        text: text,
        size: this.qrcodeSize,
        margin: 20,
        success: e => {
          this.qrcodeSrc = e;
          this.qrshow = !this.qrshow;
          this.qrcodeLoading = false;
        },
        fail: () => {
          this.qrcodeLoading = false;
        }
      });
    },
    onCopy(data) {
      $System.setClipboardData(data);
    }
  }
};
</script>

<style lang="scss" scoped>
.key-box {
  padding: $cell-padding;
  background: #ffffff;
  word-break: break-all;
}
.qr-box {
  height: 0;
  width: 80%;
  padding: 40% 0;
  overflow: hidden;
  background: #ffffff;
  margin: 40rpx auto;
  border-radius: 20rpx;
  position: relative;
  .img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 40rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .qr {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
.qrcode {
  position: absolute;
  left: -2000rpx;
}
</style>
