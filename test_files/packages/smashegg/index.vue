<template>
  <!-- 砸金蛋  -->
  <view class="pages">
    <image :src="smashegg" mode="widthFix" class="zajindan" />
    <view class="right-tag">
      <view class="menu" @click="openExplain">活動說明</view>
      <view class="menu" @click="prizelist">我的獎品</view>
    </view>

    <view class="smashegg-main">
      <view class="smashegg-egg">
        <view class="item-egg" v-for="(item, index) in itemsEgg" :key="index">
          <view class="egg-img" @click="haveHand(index)">
            <image :src="basepath + item.eggimg" mode="widthFix" />
          </view>
          <image
            class="hammer"
            :src="basepath + item.hammer"
            :class="item.hammerMove"
            mode="widthFix"
          />
        </view>
      </view>
      <view class="smashegg-chance" v-if="frequency != -9999">
        剩餘抽獎次數：
        <text>{{ frequency }}</text
        >次
      </view>
      <view class="btn-continue">
        <!-- 開始刮獎按鈕 -->
        <view class="btn">
          <view
            @click="onContinue"
            :class="termname ? 'btntext' : 'btncontinue'"
            >再砸一次</view
          >
        </view>
      </view>
    </view>

    <view class="prize-wrap">
      <view class="prize-title">砸金蛋中獎記錄</view>
      <view class="prize-list-wrap">
        <view class="item">
          <tonyscroll :list="win"></tonyscroll>
        </view>
      </view>
    </view>
    <!-- 中獎 -->
    <popupwinprize
      :isShow="winPrize"
      :termname="termname"
      :prizename="prizename"
      @share="share"
      @close="winPrizeclose"
    />
    <!-- 未中獎 -->
    <popupnoprize :isShow="noPrize" @close="NoPrizeclose" @share="share" />

    <popupactivityend v-if="ActivityEndshow" />
    <!-- 說明 -->
    <explain
      v-if="smash_egg_id"
      :isShow="isshow"
      @close="closeExplain"
      :smash_egg_id="smash_egg_id"
    />
    <!-- 分享 -->
    <popupshare :isShow="isshare" @close="closeshare" />
    <cover-view class="cover_view popup" v-if="ShowbindMobile">
      <cover-view class="bindMobileText">
        <cover-view class="titleText">您還未綁定手機號</cover-view>
        <cover-view class="confirmText">請先確認授權獲取手機號碼</cover-view>
        <cover-view class="allButton">
          <button size="mini" @click="closeBind">取消</button
          ><button
            size="mini"
            open-type="getPhoneNumber"
            @getphonenumber="getphonenumber"
          >
            確認授權
          </button>
        </cover-view>
      </cover-view>
    </cover-view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import $Plugins from "@/api/plugins";
import {
  GET_FREQUENCY,
  GET_PRIZERECORDS,
  SET_USERSMASHEGG
} from "@/common/interface/smashegg"; //轉盤詳情api
import { isWeixin } from "@/common/utils";
import popupactivityend from "./component/PopupActivityEnd"; //活動結束
import explain from "./component/explain"; //活動獎品組件
import tonyscroll from "./component/tony-scroll"; //滾動
import popupnoprize from "./component/PopupNoPrize"; //my中獎
import popupshare from "./component/PopupShare"; //分享
import popupwinprize from "./component/PopupWinPrize"; //中獎弹出框
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      ShowbindMobile: false,
      termname: "", //獎項名稱
      prizename: "", //獎品名稱
      winPrize: false, //中獎弹框
      isshare: false,
      noPrize: false, //未中獎弹框
      info: "", //詳情
      smash_egg_id: "", //砸金蛋id
      isshow: false,
      frequency: "", //剩餘次數
      isContinue: true,
      win: [], //中獎名单
      clickFlag: true, //防止砸蛋過程中重複砸蛋
      itemsEgg: [
        { eggimg: "egg-close.png", hammer: "hammer.png", hammerMove: "" },
        { eggimg: "egg-close.png", hammer: "hammer.png", hammerMove: "" }, //蛋圖
        { eggimg: "egg-close.png", hammer: "hammer.png", hammerMove: "" }
      ],
      ActivityEndshow: false //活動結束
    };
  },
  computed: {
    ...mapGetters(["token", "isShowBindMobile"]),
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    smashegg() {
      return this.$store.getters.static.baseImgPath + "smashegg-bg.png"; //砸蛋背景圖
    }
  },
  methods: {
    ...mapMutations(["setLoginBeforePath"]),
    ...mapActions(["mpBindMobile"]),
    callLoad(query) {
      this.smash_egg_id = query.smash_egg_id;
      this.getData();
    },
    getData() {
      GET_FREQUENCY({
        smash_egg_id: this.smash_egg_id
      }).then(res => {
        if (res.data.state === 1) {
          uni.showToast({
            title: "活動還沒有開始",
            duration: 3000
          });
        } else if (res.data.state === 2) {
          //活動開始
          this.frequency = res.data.frequency;
        } else if (res.data.state === 3) {
          //活動結束
          this.ActivityEndshow = true;
        }
      });
      // 中獎名单
      GET_PRIZERECORDS({ smash_egg_id: this.smash_egg_id }).then(res => {
        {
          this.win = res.data.data;
        }
      });
    },
    prizelist() {
      this.$Navigate.push({
        path: "/packages/prize/list"
      });
    },
    NoPrizeclose() {
      this.noPrize = false;
    },
    share() {
      // #ifdef H5
      if (isWeixin()) {
        this.isshare = true;
      } else {
        this.$Prompt.toast("請點擊下方工具欄“分享”按鈕進行分享");
      }
      // #endif
      // #ifdef APP-PLUS
      $Plugins.shareWithSystem({
        summary: "砸金蛋",
        href: this.shareParams.link
      });
      // #endif
    },
    closeshare() {
      this.isshare = false;
    },

    async haveHand(index) {
      //砸蛋
      // 需要綁定手機時，驗證不通過時，進行攔截點擊
      if (!this.token) {
        this.setLoginBeforePath(this.$store.getters.route.fullPath);
        this.$Navigate.push("/packages/login/index").then(() => {
          this.$Prompt.toast("您未登錄，請先登錄！");
        });
        return false;
      }
      if (this.isShowBindMobile) {
        // #ifdef H5
        this.$BindMobile.open();
        // #endif

        // #ifdef APP-PLUS
        uni.navigateTo({
          url: "/pages/member/bind"
        });
        // #endif
        // #ifdef MP-WEIXIN
        this.ShowbindMobile = true;
        // #endif
        return false;
      }

      if (!this.isContinue) return;

      if (this.frequency == 0) {
        uni.showToast({
          title: "抱歉，沒有抽獎機會了",

          icon: "none"
        });
        return false;
      }
      this.isContinue = false;
      if (!this.clickFlag) return;
      this.clickFlag = false; //砸蛋結束前，不允許再次觸發

      SET_USERSMASHEGG({
        smash_egg_id: this.smash_egg_id
      }).then(res => {
        if (res.code == 0) {
          //未中獎
          this.termname = "未中獎";
          this.handld(index);

          setTimeout(() => {
            this.noPrize = true;
          }, 1000);
        } else if (res.data.code == 1) {
          //中獎
          this.handld(index);
          this.termname = res.data.term_name;
          this.prizename = res.data.prize_name;
          setTimeout(() => {
            this.winPrize = true;
          }, 1000);
        } else {
        }
      });
    },

    // 砸蛋動畫

    handld(index) {
      if (this.frequency !== -9999) {
        this.frequency = this.frequency - 1;
      }
      if (this.itemsEgg[index].eggimg == "egg-close.png") {
        this.itemsEgg[index].hammerMove = "shak";
        setTimeout(() => {
          this.itemsEgg[index].eggimg = "egg-open.png";
          this.clickFlag = true;
        }, 500);
      }
    },

    // 點擊再砸一次
    onContinue() {
      if (this.termname) {
        this.termname = "";
      }
      this.isContinue = true;
      this.clickFlag = true;
      for (let i = 0; i < this.itemsEgg.length; i++) {
        this.itemsEgg[i].eggimg = "egg-close.png";
        this.itemsEgg[i].hammerMove = "";
      }
    },
    winPrizeclose() {
      this.winPrize = false;
    },

    closeExplain() {
      this.isshow = false;
    },
    openExplain() {
      this.isshow = true;
    },
    // 關閉授權
    closeBind() {
      this.ShowbindMobile = false;
    },
    //確認授權
    getphonenumber(event) {
      this.ShowbindMobile = false;
      if (event.detail.encryptedData) {
        this.mpBindMobile(event.detail);
      } else {
        console.log("拒絕獲取手機");
      }
    }
  },
  components: {
    popupactivityend: popupactivityend,

    explain: explain,
    tonyscroll: tonyscroll,
    popupnoprize: popupnoprize,
    popupshare: popupshare,
    popupwinprize: popupwinprize
  }
};
</script>

<style lang="scss" scoped>
.cover_view {
  position: relative;
  z-index: 100000;
  top: -30rpx;
}
.popup {
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2001;
  transition: all 0.2s;
  .bindMobileText {
    height: 300rpx;
    text-align: center;
    line-height: 100rpx;
    background-color: #fff;
    margin: calc(50% + 100rpx) auto;
    width: 60%;
    border-radius: 16rpx;
    .titleText {
      height: 100rpx;
      line-height: 100rpx;
    }
    .confirmText {
      height: 100rpx;
      line-height: 100rpx;
    }
    .allButton {
      display: flex;
      justify-content: space-around;
      button {
        width: 35%;
      }
    }
  }
}
.zajindan {
  height: 100%;
  width: 100%;
}
.pages {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #b10f11;
  overflow: hidden;
}
.right-tag {
  position: absolute;
  z-index: 10;
  top: 16%;
  right: 0;
}
.right-tag .menu {
  color: #ff4444;
  background-color: #fff;
  padding: 12rpx 20rpx;
  border-bottom-left-radius: 40rpx;
  border-top-left-radius: 40rpx;
  font-size: 28rpx;
  margin-top: 40rpx;
  display: block;
}

.smashegg-main {
  position: relative;
}

.smashegg-egg {
  position: relative;
  width: 100%;
}
.smashegg-egg:after {
  content: "";
  display: block;
  clear: both;
}
.item-egg {
  position: relative;
  width: 33.333%;
  float: left;
}
.item-egg .egg-img {
  width: 100%;
  display: block;
  position: relative;
}
.item-egg .egg-img image {
  width: 100%;
}
.item-egg .hammer {
  position: absolute;
  width: 35%;
  top: -150rpx;
  right: -80rpx;
  display: none;
}
.item-egg .egg-image span {
  color: #ff0;
  font-size: 24px;
  font-weight: bold;
  display: block;
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.btn {
  text-align: center;
  .btntext {
    background-color: #fff55a;
    border: 1px solid #fff55a;
    color: #a50000;
    margin: 30rpx auto;
    display: block;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 40rpx;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 4px 1px #fec201;
    box-shadow: 0px 4px 1px #fec201;
    width: 50%;
  }
  .btncontinue {
    opacity: 1;
    -webkit-box-shadow: 0px 4px 1px #cccccc;
    box-shadow: 0px 4px 1px #cccccc;
    color: #999;
    background-color: #e8e8e8;
    border: 1px solid #e5e5e5;
    margin: 30rpx auto;
    display: block;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 40rpx;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 50%;
  }
}

.smashegg-chance {
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  margin-top: 10px;
}
.smashegg-chance span {
  color: #ffff00;
}

.shak {
  animation: hammer-move 0.5s linear 1 alternate;
  display: block !important;
}
@keyframes hammer-move {
  0% {
    transform: rotate(0deg);
    transform-origin: right bottom;
  }
  30% {
    transform: rotate(10deg);
    transform-origin: right bottom;
  }
  60% {
    transform: rotate(30deg);
    transform-origin: right bottom;
  }
  90% {
    transform: rotate(10deg);
    transform-origin: right bottom;
  }
  100% {
    transform: rotate(0deg);
    transform-origin: right bottom;
  }
}

.prize-wrap {
  background-color: #fff;
  border-radius: 20rpx;
  position: relative;
  bottom: 0;
  width: 90%;
  height: 400rpx;
  margin: 0 auto;
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  overflow: hidden;
}
.prize-title {
  text-align: center;
  font-size: 28rpx;
  color: #e84d2f;
  width: 100%;
  padding-top: 40rpx;
}
.prize-list-wrap {
  overflow: hidden;
  overflow-y: auto;
  padding: 12rpx 0px;
  color: #666;
  height: 300rpx;
}
</style>
