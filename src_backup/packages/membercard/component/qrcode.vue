<template>
  <view>
    <view class="qrcode">
      <canvas canvas-id="qrcode" style="width: 250px;height: 250px;" />
    </view>
    <view class="text">
      <view class="text1">{{membercard_no | telvague}}</view>
      <view class="text2">{{text?text:"門店結賬時出示此碼，自動享受會員優惠"}}</view>
    </view>
  </view>
</template>

<script>
import uQRCode from "./uqrcode.js";
export default {
  props: {
    membercard_no: {},
    text:{}
  },
  watch: {
    membercard_no(e) {
      if (e) {
        this.make();
      }
    }
  },
  methods: {
    make() {
      uQRCode.make({
        canvasId: "qrcode",
        componentInstance: this,
        text: this.membercard_no,
        size: 250,
        margin: 10,
        backgroundColor: "#ffffff",
        foregroundColor: "#000000",
        fileType: "jpg",
        correctLevel: uQRCode.defaults.correctLevel,
        success: res => {
        }
      });
    }
  },
    filters: {
    telvague(val) {
   if(val){
      const valnum=val.toString()
      return valnum.substr(0, 4) + " "+ valnum.substr(4, 4)+' '+valnum.substr(8, 4)
   }
    },
  }
};
</script>

<style>
.qrcode {
  display: flex;
  justify-content: center;
  margin-top: 80rpx;
 
}
.text {
  text-align: center;
}
.text1 {
  font-size: 50rpx;
  font-weight: 600;
}
.text2 {
  padding-top: 30rpx;
  color: #999999;
}
</style>