<template>
  <view class="card-group-box">
    <lk-cell>
      <view class="process1">
        <view>參與拼團流程</view>
        <view class="processitem1">
          <view v-for="(item, index) in joinprocess" :key="index" class="processitemdetail">
            <image :src="item.image" class="processimage" />
            <view>{{ item.text }}</view>
          </view>
        </view>
      </view>
      <view class="process2">
        <view>成團流程</view>
        <view class="processitem2">
          <view class="processitem2rigth">
            <text class="info info1">{{ info.win_num }}份拼中</text>
            <text class="info info2">{{ info.loser_num }}份拼不中</text>
            <text class="info info4">發貨</text>
            <text class="info info3">退款並送紅包</text>
            <text class="info info5">滿{{info.group_num}}份成團 </text>
            <text class="line"></text>
          </view>
        </view>
      </view>

      <view class="process3">
        <view>獎勵說明</view>
        <view class="process3item">
          {{ rewardtypeinfo }}
        </view>
      </view>
    </lk-cell>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
    info: [Object],
  },
  computed: {
    ...mapGetters(["static"]),
    joinprocess() {
      return [
        {
          image: this.static.baseImgPath + "luckly-process1.png",
          text: "1.挑選商品",
        },
        {
          image: this.static.baseImgPath + "luckly-process2.png",
          text: "2.參團並支付",
        },
        {
          image: this.static.baseImgPath + "luckly-process3.png",
          text: "3.成功參與拼團",
        },
      ];
    },
    rewardtypeinfo() {
      if (this.info.rewardtype == 1)
        return "通過參與拼團獲得的微信紅包將直接發放至微信零錢餘額";
      else return "通過參與拼團獲得的餘額將直接發放至賬戶餘額";
    },
  },
};
</script>

<style lang="scss" scoped>
.process1 {
  text-align: center;

  .processitem1 {
    background-color: #f2f2f2;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 10rpx;
    padding: 60rpx 0;
    border-radius: 20rpx;
    .processitemdetail{
      width: 33.33%;
    }
  }
}
.processimage {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}
.process2 {
  text-align: center;
  margin-top: 24rpx;
  padding: 30rpx 0;
  .processitem2 {
    background-color: #f2f2f2;
    padding: 70rpx 0;
    border-radius: 20rpx;
    display: flex;
    .info {
      width: 170rpx;
      background-color: $red;
      border-radius: 24rpx;
      color: $white;
    }
  }
  .processitem2rigth {
    width: 400rpx;
    height: 120rpx;
    border: 1rpx solid $red;
    border-radius: 20rpx;
    position: relative;
    border-right: none;
    left: 230rpx;
  }
  .info1 {
    position: absolute;
    top: -24rpx;
    left: 18rpx;
  }
  .info2 {
    position: absolute;
    bottom: -24rpx;
    left: 18rpx;
  }
  .info4 {
    position: absolute;
    top: -24rpx;
    right: 0;
  }
  .info3 {
    position: absolute;
    bottom: -24rpx;
    right: 0;
  }
  .info5 {
    position: absolute;
    left: -130rpx;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .line {
    position: absolute;
    left: -22rpx;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 40rpx;
    height: 1rpx;
    background-color: $red;
  }
}
.process3 {
  text-align: center;
}
.process3item {
  background-color: #f2f2f2;

  margin-top: 10rpx;
  padding: 20rpx 20rpx;
  border-radius: 20rpx;
}
</style>
