<template>
<!-- 禮品券詳情 -->
  <view class="pages">
    <detailhead :list="detail"  />
    <view class="img">
      <image :src="detail.gift_voucher_codeImg" mode="scaleToFill" />
      <view>{{detail.gift_voucher_code}}</view>
    </view>
    <lk-cell>
      <view class="time">使用時間</view>
      <view>{{detail.start_time|formatDate}}~{{detail.end_time|formatDate}}</view>
      <view class="time">使用說明</view>
      <view>{{detail.desc}}</view>
    </lk-cell>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
import { GET_GIFTVOUCHERDETAIL } from "@/common/interface/giftvoucher";
import detailhead from "./component/detailhead";
export default {
  name: "packages-giftvoucher-detail",
  data() {
    return {
      detail: {}
    };
  },
  onLoad(options) {
    GET_GIFTVOUCHERDETAIL({ record_id: options.record_id })
      .then(res => {
        // console.log(res);
        this.detail = res.data;
      })
      .catch(error => {});
  },
  methods: {},
  components: {
    detailhead
  },
  filters: {
    formatDate(v) {
      return formatDate(v, "YYYY-MM-DD hh:mm");
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 250rpx;
  height: 250rpx;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 60rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.time {
  color: #ff667f;
}
</style>
