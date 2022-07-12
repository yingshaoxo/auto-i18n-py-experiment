<template>
  <view class="cell-group">
    <lk-cell center v-if="info.refundStatus">
      <view slot="title" class="title-clock">
        <view>正在贖回</view>
        <view class="clock text-secondary">
          <lk-icon name="clock-o" />
          <text>{{ timeText }}</text>
        </view>
      </view>
      <view slot="rightIcon" class="text-gray">{{ info.refundTotal }}</view>
    </lk-cell>
    <lk-cell>
      <view slot="title">
        <view>RAM</view>
        <view class="text-light"
          >1 kb = {{ info.netPrice }} {{ typeToUpperCase }}</view
        >
      </view>
      <view>
        <view class="text-gray"
          >{{ info.totalRawToEos }} {{ typeToUpperCase }}</view
        >
        <view class="text-light">{{ info.quotaRam }} kb</view>
      </view>
    </lk-cell>
    <lk-cell is-link center to="/packages/blockchain/resource?type=eos">
      <view slot="title">
        <view>已抵押資源</view>
        <view class="text-light">CPU + NET</view>
      </view>
      <view>
        <view class="text-gray">{{ info.payEos }} {{ typeToUpperCase }}</view>
      </view>
    </lk-cell>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getServerTime } from "@/common/utils";
export default {
  data() {
    return {
      timeText: ""
    };
  },
  props: {
    type: {
      type: String,
      default: "eos"
    },
    info: Object
  },
  computed: {
    ...mapState({
      blockchainInfo: ({ blockchain }) => blockchain
    }),
    typeToUpperCase() {
      return this.type.toUpperCase();
    }
  },
  mounted() {
    if (this.info.refundStatus) {
      this.countDownTime(this.info.refundExpectTime);
    }
  },
  methods: {
    ...mapActions(["getEosInfo"]),
    countDownTime(time) {
      if (!time) return;
      getServerTime().then(serverTime => {
        var setTime = new Date(time);
        var restSec = setTime.getTime() - serverTime;
        var day = parseInt(restSec / (60 * 60 * 24 * 1000));
        var hour = parseInt((restSec / (60 * 60 * 1000)) % 24);
        var minu = parseInt((restSec / (60 * 1000)) % 60);
        var sec = parseInt((restSec / 1000) % 60);
        this.timeText = day + "天" + hour + "時" + minu + "分";
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}

.title-clock {
  display: flex;
  align-items: center;
}
.title-clock .clock {
  display: flex;
  align-items: center;
  margin-left: 16rpx;
}
.title-clock text {
  margin-left: 16rpx;
  font-size: $font-size-sm;
  color: $text-gray;
}
.text-gray {
  color: $text-gray;
}

.text-light {
  color: $text-light;
  font-size: $font-size-sm;
}
</style>
