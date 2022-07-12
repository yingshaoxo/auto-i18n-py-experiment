<template>
  <view class="info" :style="{ backgroundImage: lucklyspellbgc }">
    <view class="lucklydetail">
      <view class="groupnum">
        <image :src="lucklyhot" />
        {{ info.group_num }}人團</view
      >
    </view>

    <view class="snap">
      <view class="goodsname">{{ info.goods_name }}</view>
      <view>正在瘋搶中</view>
    </view>

    <view class="card-group-box">
      <lk-cell>
        <lk-goods-card
          cell-padding
          :image="info.goods_picture"
          :title="info.goods_name"
          :to="'/packages/goods/detail?goods_id=' + info.goods_id"
        >
          <view slot="tags">
            <view class="tags">
              <image :src="lucklyhot" class="hot" />
              <view class="line">
                <text class="linenum">
                  {{ info.now_num }}/{{ info.group_num }}</text
                >
                <text class="lineprogress" :style="{ width: linepro }"></text>
              </view>
            </view>

            <text class="num fw"
              >未拼中獲得獎勵￥{{ info.failure_reward }}</text
            >
          </view>
        </lk-goods-card>

        <view class="numdetail">
          <view class="success">{{ showjoin }}</view>
          <view
            ><text>還差</text><text class="num">{{ info.need_num }}</text>
            <text>份成團,請留意成團開獎通知！</text></view
          >
        </view>
        <view class="infoheadimg">
          <view v-for="(item, index) in grouprecordlist" :key="index">
            <image
              :src="item.user_headimg ? item.user_headimg : noAvatar"
              class="headimg"
            />
          </view>
          <view class="showmore" v-if="showmore"> </view>
        </view>

        <view class="btn-group">
          <lk-button
            block
            round
            type="danger"
            color="#dc2af1"
            class="btn"
            :to="toGoodsDetail"
          >
            參與拼團
          </lk-button>

          <lk-button
            block
            round
            type="warning"
            color="#f09b38"
            class="btn1"
            open-type="share"
            @click="onInvite"
          >
            邀請朋友
          </lk-button>
        </view>
      </lk-cell>
    </view>

    <luckly-process :info="info" />

    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GETLUCKYSPELLRECORD } from "@/common/interface/lucklyspell";
import { mapGetters } from "vuex";
import LucklyProcess from "./component/luckly-process";
export default {
  data() {
    return {
      info: {},
      grouprecordlist: [],
      linepro: "",
      showmore: false,
      showjoin: ""
    };
  },

  onLoad(query) {
    const { out_trade_no, order_id } = query;
    GETLUCKYSPELLRECORD({
      out_trade_no: out_trade_no,
      order_id: order_id
    }).then(({ data }) => {
      this.info = data;
      this.linepro = (data.now_num / data.group_num) * 100 + "%";
      if (data.users.some(e => e.uid == data.uid)) {
        this.showjoin = "參團成功";
      }
      if (data.users.length <= 6) {
        this.grouprecordlist = this.info.users;
      } else {
        this.showmore = true;
        this.grouprecordlist = this.info.users.slice(0, 7);
      }
    });
  },
  computed: {
    ...mapGetters(["static"]),
    joinnum() {
      return "還差" + this.info.need_num + "份成團,請留意成團開獎通知！";
    },
    toGoodsDetail() {
      return {
        path: "/packages/goods/detail",
        query: {
          goods_id: this.info.goods_id
        }
      };
    },
    noAvatar() {
      return this.static.noAvatar;
    },
    lucklyhot() {
      return this.static.baseImgPath + "luckly-hot.png";
    },
    lucklyspellbgc() {
      return "url(" + this.static.baseImgPath + "lucklyspellbgc.png" + ")";
    }
  },
  methods: {
    onInvite() {
      // #ifdef H5
      this.$Prompt.toast(
        this.$store.state.isWeixin
          ? "微信環境下點擊右上角分享"
          : "手機瀏攬器點擊底部工具欄分享"
      );
      // #endif
    }
  },
  components: {
    LucklyProcess
  }
};
</script>

<style lang="scss" scoped>
.info {
  background: no-repeat;
  background-size: cover;
  position: relative;
  height: 100%;
  padding-bottom: 50rpx;
  .lucklydetail {
    padding-top: 40rpx;
    .groupnum {
      width: 140rpx;
      height: 46rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffcc99;
      color: $red;
      border-top-right-radius: 20rpx;
      border-bottom-right-radius: 20rpx;
      image {
        width: 20rpx;
        height: 24rpx;
        margin-right: 6rpx;
      }
    }
  }
  .snap {
    color: $white;
    font-size: 32rpx;
    width: 100%;
    margin: 30rpx 0;
    display: flex;
    justify-content: center;
    .goodsname {
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .tags {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    image {
      width: 26rpx;
      height: 28rpx;
      margin-right: 8rpx;
    }

    .line {
      width: 220rpx;
      height: 36rpx;
      background-color: #ffb3b3;
      border-radius: 18rpx;
      display: flex;
      align-items: center;
      color: $white;

      position: relative;

      .linenum {
        position: absolute;
        left: 40%;
      }
      .lineprogress {
        height: 100%;
        line-height: 36rpx;
        background-color: $red;
        border-radius: 18rpx;
        text-align: center;
      }
    }
  }
  .numdetail {
    text-align: center;
  }
  .fw {
    font-weight: 600;
  }
  .success {
    color: $green;
  }
  .num {
    color: $red;
  }
  .infoheadimg {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;

    .headimg {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      margin: 0 4rpx;
    }
  }
  .showmore {
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    background-color: #cbcbcb;
    position: relative;
    margin-top: -18rpx;
  }
  .showmore::after {
    content: "•••";
    color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .btn {
    margin-top: 40rpx;
  }
  .btn1 {
    margin-top: 10rpx;
  }
}
</style>
