<template>
  <view>
    <view class="opayBox">
      <lk-cell-picker-group
        v-model="active"
        :label="'主網絡'"
        :required="false"
        placeholder="請選擇"
        :columns="columns"
        @confirm="onConfirm"
      />
      <view class="Center qrCode">
        <image
          style="width: 100px; height: 100px; background-color: #eeeeee"
          :mode="'aspectFit'"
          :src="qr_image_data_url"
          @click="onImageClick"
        ></image>
      </view>
      <!-- #ifndef APP-PLUS -->
      <view class="Center">
        <view
          class="Center Columns qrDownloadRow tip"
          v-if="coin_qr_address != ''"
        >
          <view>提供二維碼下載到本地</view>
          <view class="download_text" @click="downloadQRImage">下載</view>
        </view>
      </view>
      <!--  #endif -->
      <view class="address_label">
        <div class="Columns">
          <div>地址：</div>
          <input
            type="text"
            class="textInputBox"
            placeholder=""
            v-model="coin_qr_address"
            :disabled="true"
          />
        </div>
      </view>
      <view class="opayVoucher">
        <lk-upload
          uploadText="請上傳轉賬憑證"
          height="250"
          width="600"
          :maxCount="1"
          @on-success="voucherSuccess"
        ></lk-upload>
      </view>
    </view>
  </view>
</template>

<script>
import $System from "@/api/system";
const QRCode = require("qrcode");
const options = {
  errorCorrectionLevel: "H",
  type: "terminal",
  quality: 0.95,
  margin: 1,
  color: {
    dark: "#000",
    light: "#FFF",
  },
};
import { GET_CRYPTOCURRENCY_QR_CODE_LIST } from "@/common/interface/microshop";
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    usdt_pay: {
      type: Object,
    },
  },
  data() {
    return {
      active: 0,
      coin_qr_address: "",
      qr_image_data_url: "",
      columns: [],
      name_columns: [],
    };
  },
  computed: {
    ...mapGetters({
      static: "static",
    }),
  },
  async mounted() {
    GET_CRYPTOCURRENCY_QR_CODE_LIST({
      page_index: "1",
    })
      .then(({ data }) => {
        const { data: coinList = [] } = data;
        this.columns = coinList;

        this.coin_qr_address = this.columns[0].adr;
        this.qr_image_data_url = this.getImageURL(this.columns[0].real_path);
        // console.log(this.qr_image_data_url);
        // debugger;

        console.log(coinList);
      })
      .catch(() => {});
  },
  methods: {
    getImageURL(path) {
      // return this.static.baseImgPath + path;
      return path;
    },
    voucherSuccess(e) {
      this.$emit("pay_voucher_src", e.src);
    },
    onCopy(data) {
      $System.setClipboardData(data);
    },
    onConfirm(index) {
      const $this = this;
      this.coin_qr_address = this.columns[index].adr;
      this.qr_image_data_url = this.getImageURL(this.columns[index].real_path);

      // var canvas = document.createElement('canvas');
      const address = this.coin_qr_address;

      // QRCode.toCanvas(canvas, address, function (error) {
      //   if (error) console.error(error)

      //   var the_qr_image = document.getElementById('the_qr_image')
      //   the_qr_image.src = canvas.toDataURL("jpeg");
      // })
      // this.items.value = this.columns[index].name;
    },
    downloadQRImage() {
      // var src = document.getElementById('the_qr_image').getAttribute("src");
      const downloadURI = (uri, name) => {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      downloadURI(this.getImageURL(this.qr_image_data_url), "qr.jpg");
    },
    onImageClick() {
      uni.showToast({
        title: "长按保存图片.",
        duration: 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.opayBox {
  background-color: #fff;
  //padding: 10rpx 0 120rpx 0;
  padding: 50px;

  image {
    width: 100%;
  }

  .address_label {
    margin-left: 25px;
    margin-bottom: 40px;
  }

  // .opayCode {
  //   width: 400rpx;
  //   margin: 20rpx auto;

  //   image {
  //     width: 100%;
  //   }
  // }

  .opayVoucher {
    width: 600rpx;
    margin: 20rpx auto;
  }

  .opaytext {
    width: 500rpx;
    margin: 40rpx auto;
    color: #666;
  }
}

.textInputBox {
  border-style: solid;
  border-width: 1px;
  border-color: #666;
  width: 72%;
}

.Columns {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.download_text {
  margin-left: 10px;
  color: #1fb1f2;
}

.qrDownloadRow {
  margin-left: 25px;
  margin-bottom: 50px;
}

.Center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrCode {
  margin-top: 20px;
  margin-bottom: 20px;
}

.tip {
  font-size: smaller;
}
</style>
