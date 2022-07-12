<template>
  <view class="pages">
    <anchor-top-bar
      :avatar="info.user_headimg"
      :name="info.uname"
      :label="topBarLabel"
    >
      <lk-button
        slot="infoRight"
        round
        theme-color
        size="mini"
        @click="clickClose"
      >
        結束
      </lk-button>
    </anchor-top-bar>
    <luxury-gift-group ref="luxuryGiftList" :list="luxuryGiftList" />
    <view class="footer-warp">
      <view>
        <gift-barrage ref="giftBarrage" :list="giftBarrageList" />
      </view>
      <view v-show="toggleBarActive == 'goods'">
        <goods-group
          :list="goodsList"
          :anchor_id="anchor_id"
          @refresh="refreshGoodsList"
        />
      </view>
      <view v-show="toggleBarActive == 'msg'">
        <notice-group :list="noticeList" />
        <msg-group :list="msgList" />
      </view>
      <view v-show="toggleBarActive == 'tool'">
        <tool-group v-model="toolParams" />
      </view>
    </view>
    <!-- #ifdef MP -->
    <live-pusher
      v-if="livePusherUrl"
      id="livePusher"
      ref="live-pusher"
      class="live-pusher"
      :url="livePusherUrl"
      :mode="toolParams.mode"
      :device-position="toolParams.devicePosition"
      :enable-mic="toolParams.enableMic"
      :beauty="toolParams.beauty"
      :whiteness="toolParams.whiteness"
      aspect="9:16"
      object-fit="fillCrop"
      @statechange="onStatechange"
      @netstatus="onNetstatus"
      @error="onPushererror"
      @bgmstart="onBgmstart"
      @bgmprogress="onBgmprogress"
      @bgmcomplete="onBgmcomplete"
    ></live-pusher>
    <!--  #endif -->
    <send-write-group v-model="showSendWrite" @send="onSend" />
    <bottom-bar :value="bottomBarActive" @action="onAction" />
  </view>
</template>

<script>
import {
  GET_LIVEPLAYERURL,
  GET_LIVEANCHORINFO,
  GET_LIVEANCHOREND,
  SET_LIVEANCHORENDSTATISTIC,
  GET_LIVEGOODSLIST,
  SET_LIVEDISCONNECTTIME,
  DEL_LIVEDISCONNECTTIME,
  GET_LIVEROOMSTATUS
} from "../interface";
import anchorTopBar from "../component/anchor-top-bar";
import bottomBar from "./component/bottom-bar";
import toolGroup from "./component/tool-group";
import goodsGroup from "./component/goods-group";
import noticeGroup from "../component/notice-group";
import msgGroup from "../component/msg-group";
import giftBarrage from "../component/gift-barrage";
import luxuryGiftGroup from "../component/luxury-gift-group";
import sendWriteGroup from "../component/send-write-group";
import { encodeUriParams, wan } from "@/common/utils";
import tls from "../mixin/tls";

let isSconnect = false; //推流是否斷開

export default {
  name: "packages-live-anchor-player",
  data() {
    return {
      anchor_id: 0,
      info: {},

      livePusherUrl: "",

      msgList: [], //消息列表
      noticeList: [], //通告列表
      goodsList: [], //推薦商品列表
      giftBarrageList: [], //禮物彈幕列表
      luxuryGiftList: [], //豪華禮物列表

      bottomBarActive: "msg",
      toggleBarActive: "msg",

      showSendWrite: false,

      // 工具參數
      toolParams: {
        mode: "SD", //視頻模式 SD（標清）, HD（高清）, FHD（超清）
        beauty: 5, //美顏
        whiteness: 5, //美白
        devicePosition: "front", //前置front或後置back
        enableMic: true //麥克風
      }
    };
  },
  watch: {
    toggleBarActive(e) {
      if (e == "goods") {
        this.getRecGoodsList();
      }
    },
    "toolParams.devicePosition"(e) {
      // #ifdef MP
      this.ctx.switchCamera();
      // #endif
    }
  },
  mixins: [tls],
  computed: {
    topBarLabel() {
      return wan(this.memberNum) + "觀看";
    }
  },
  onLoad(query) {
    this.anchor_id = query.anchor_id || 0;
    this.live_id = query.live_id || 0;
    this.getData();
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  onShow() {
    if (this.toggleBarActive == "goods") {
      this.getRecGoodsList();
    }

    // 定時獲取直播間狀態
    this.timer = setInterval(() => {
      this.getLiveStatus();
    }, 5000);

    this.leavedEnterLiveRoom();

    if (isSconnect) {
      // 上次存在斷開連接狀態，重新進入時，去除 斷開連接時的時間
      this.delSconnectTime();
    }

    // ios環境 分享页面重新進入時，會黑屏，重新執行start
    if (this.ctx && this.isHangUp) {
      // #ifdef MP
      this.ctx.start({
        success: res => {
          console.log("start success");
          this.isHangUp = false;
        },
        fail: res => {
          console.log("start fail");
        }
      });
      // #endif
    }
  },
  onReady() {
    // 注意：需要在onReady中 或 onLoad 延時
    // #ifdef MP
    this.ctx = uni.createLivePusherContext("livePusher", this);
    if (!this.ctx) {
      return;
    }
    this.ctx.start({
      success: res => {
        console.log("start success");
      },
      fail: res => {
        console.log("start fail");
      }
    });
    // #endif
  },
  onHide() {
    clearInterval(this.timer);
    // this.leaveLiveRoom();
  },
  onUnload() {
    clearInterval(this.timer);
    this.leaveLiveRoom();
    this.setSconnectTime();
    setTimeout(() => {
      this.destroyTLS();
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getData() {
      GET_LIVEANCHORINFO({ anchor_id: this.anchor_id }).then(({ data }) => {
        this.info = data || {};
        this.live_id = this.info.live_id;
        if (data.tool_options) {
          this.toolParams = data.tool_options || {};
        }
        this.pushMsgList({
          type: "system",
          name: "公告",
          content: data.room_notice
        });
        this.getUrl();
        this.initTLS(this.info);
        this.setWxShare({
          title: data.live_title,
          imgUrl: data.live_img,
          path: "packages/live/player",
          query: {
            live_id: this.live_id,
            anchor_id: this.anchor_id
          },
          desc: "赶紧过来觀看我的直播~"
        });
      });
    },
    getLiveStatus() {
      if (!this.isInitTLSed) {
        return false;
      }
      GET_LIVEROOMSTATUS({ anchor_id: this.anchor_id })
        .then(({ data }) => {
          console.log("直播狀態：", data.live_status);
          if (data.live_status == 0) {
            // 已禁播
            this.sendCustomMessage({
              name: "banned"
            });
            this.$Prompt
              .modal({
                title: "提示",
                showCancel: false,
                content: "抱歉，您已被禁播"
              })
              .then(() => {
                this.endLive().then(() => {
                  this.$Navigate.replace("/pages/live/index");
                });
              });
            if (this.timer) {
              clearInterval(this.timer);
            }
          }
          if (data.live_status == -1) {
            // 異常
            this.sendCustomMessage({
              name: "abnormal"
            });
            this.$Prompt
              .modal({
                title: "提示",
                showCancel: false,
                content: "抱歉，您的直播间異常"
              })
              .then(() => {
                this.endLive().then(() => {
                  this.$Navigate.replace("/pages/live/index");
                });
              });
            if (this.timer) {
              clearInterval(this.timer);
            }
          }
          if (data.live_status == 4) {
            // 已下播
            this.sendCustomMessage({
              name: "end"
            });
            if (this.timer) {
              clearInterval(this.timer);
            }
            return this.$Navigate.replace({
              path: "/packages/live/anchor/end",
              query: {
                anchor_id: this.anchor_id,
                live_id: this.live_id
              }
            });
          }
        })
        .catch(() => {});
    },
    // 獲取推流地址
    getUrl() {
      GET_LIVEPLAYERURL({ live_id: this.live_id })
        .then(({ data }) => {
          this.livePusherUrl = data.push_url;
        })
        .catch(() => {});
    },
    // 監聽tls初始化完成
    onTLSReady() {
      this.isInitTLSed = true;
      if (this.info.group_id) {
        this.joinGroup(this.info.group_id);
      } else {
        this.createGroup(); // 主播創建群聊
      }
    },
    // 加入消息列表
    pushMsgList(obj) {
      this.msgList.push(obj);
    },
    // 加入通告列表
    pushNoticeList(obj) {
      this.noticeList.push(obj);
    },
    // 加入禮物彈幕隊列列表
    pushGiftList(obj) {
      this.$refs.giftBarrage.push(obj);
      // this.giftBarrageList.push(obj);
      // 豪華禮物類型
      if (obj.type == 2) {
        this.$refs.luxuryGiftList.push(obj);
        // this.luxuryGiftList.push(obj);
      }
    },
    onAction(e) {
      this.bottomBarActive = e;
      if (e == "goods" || e == "msg" || e == "tool") {
        this.toggleBarActive = e;
      }
      if (e == "msg") {
      }
      if (e == "mute") {
        // 全體禁言
        this.sendCustomMessage({
          name: "mute",
          query: {
            is_muting: !this.isMute ? 1 : 0
          }
        }).then(() => {
          this.isMute = !this.isMute;
          this.pushMsgList({
            type: "system",
            name: "公告",
            content: this.muteText
          });
        });
      }
      if (e == "write") {
        this.showSendWrite = true;
      }
    },
    // 關閉直播間
    clickClose() {
      this.$Prompt
        .modal({
          title: "提示",
          content: "是否結束当前直播?"
        })
        .then(() => {
          this.endLive().then(message => {
            this.$Navigate
              .replace({
                path: "/packages/live/anchor/end",
                query: {
                  anchor_id: this.anchor_id,
                  live_id: this.live_id
                }
              })
              .then(() => {
                this.$Prompt.toast({ title: message, icon: "success" });
              });
          });
        })
        .catch(() => {});
    },
    // 下播
    endLive() {
      return new Promise((resolve, reject) => {
        let params = {
          live_id: this.live_id,
          end_time: Math.round(new Date() / 1000)
        };
        GET_LIVEANCHOREND(params)
          .then(({ message }) => {
            // 解散群聊
            this.dismissGroup().then(() => {
              resolve(message);
            });
          })
          .catch(() => {});
      });
    },
    //获取推薦商品列表
    getRecGoodsList() {
      GET_LIVEGOODSLIST({ anchor_id: this.anchor_id })
        .then(({ data }) => {
          const list = data.live_goods_list || [];
          console.log(list);
          list.forEach(e => {
            e.btnLoading = false;
          });
          this.goodsList = list;
        })
        .catch(() => {});
    },
    // 刷新商品
    refreshGoodsList(item) {
      this.getRecGoodsList();
      // 主播重新設置主推商品
      this.sendCustomMessage({
        name: "recommendgoods",
        query: {
          goods_id: item.goods_id,
          is_recommend: item.is_recommend
        }
      });
    },
    // 發送內容
    onSend(e) {
      this.sendMessage({
        text: e.text
      });
    },
    onStatechange(e) {
      const { code } = e.detail;
      console.log("onStatechange", e.detail.code, e.detail.message);
      if (code === 5000) {
        // 推流被掛起
        this.isHangUp = true;
      }
      if (code == -1307) {
        isSconnect = true;
        this.setSconnectTime();
      }
    },
    // 設置 斷開連接時間
    setSconnectTime() {
      SET_LIVEDISCONNECTTIME({
        live_id: this.live_id,
        disconnect_time: Math.round(new Date() / 1000)
      })
        .then(res => {
          console.log(res, "保存斷開連接時間");
        })
        .catch(() => {});
    },
    // 刪除 斷開連接時間
    delSconnectTime() {
      DEL_LIVEDISCONNECTTIME({
        live_id: this.live_id
      })
        .then(res => {
          isSconnect = false;
          console.log(res, "刪除斷開連接時間");
        })
        .catch(() => {
          isSconnect = false;
        });
    },
    onNetstatus(e) {
      // console.log("onNetstatus", e);
    },
    onPushererror(e) {
      console.log("onPushererror", e);
    },
    onBgmstart(e) {
      console.log("onBgmstart", e);
    },
    onBgmprogress(e) {
      console.log("onBgmprogress", e);
    },
    onBgmcomplete(e) {
      console.log("onBgmcomplete", e);
    }
  },
  components: {
    anchorTopBar,
    bottomBar,
    toolGroup,
    msgGroup,
    noticeGroup,
    goodsGroup,
    giftBarrage,
    luxuryGiftGroup,
    sendWriteGroup
  }
};
</script>

<style lang="scss" scoped>
.pages {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}
.live-pusher {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.footer-warp {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: calc(120rpx + var(--window-bottom));
  bottom: calc(120rpx + constant(safe-area-inset-bottom));
  bottom: calc(120rpx + env(safe-area-inset-bottom));
  z-index: 20;
}
</style>
