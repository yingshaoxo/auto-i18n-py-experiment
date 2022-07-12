<template>
  <div id="webPlayer" class="web-player" ref="webPlayer">
    <div class="controls" v-show="showControls" @click="clickPlay">
      <lk-icon name="play-circle-o" size="60" color="#ffffff" />
    </div>
  </div>
</template>

<script>
import TcPlayer from "../lib/TcPlayer-2.3.2";
export default {
  data() {
    return {
      playerOption: {
        domID: "webPlayer",
        flv: "",
        m3u8: "",
        autoplay: false,
        x5_type: "h5",
        width: "100%",
        height: "100%",
        poster: { style: "cover", src: "" },
        pausePosterEnabled: true,
        controls: "none",
        x5_player: true,
        live: true,
        objectFit: "fill",
        wording: {
          1: "網絡錯誤，請檢查網絡配置或者播放鍊接是否正確~ ",
          2: "網絡錯誤，請檢查網絡配置或者播放鍊接是否正確~ ",
          3: "視頻解碼錯誤~ ",
          4: "當前系統環境不支持播放該視頻格式~ ",
          5: "當前系統環境不支持播放該視頻格式~ ",
          13: "您觀看的直播已結束",
          1002: "獲取視頻失敗，請檢查播放鍊接是否有效",
          2032: "請求視頻失敗，請檢查網絡",
          2048: "請求m3u8文件失敗，可能是網絡錯誤或者跨域问题"
        }
      },
      tweblive: null,
      showControls: true
    };
  },
  props: {
    url: String,
    groupInfo: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.destroyPlayer();
  },
  methods: {
    // 初始化
    init() {
      const tweblive = new TcPlayer({
        ...this.playerOption,
        poster: {
          style: "cover",
          src: this.groupInfo.live_img
        },
        ...this.options,
        listener: e => {
          // console.log("listener", e);
        }
      });
      console.log(tweblive, this.groupInfo);
      tweblive.setLogLevel(4);
      this.tweblive = tweblive;
      // this.enterRoom();

      // 登錄成功後會觸發 SDK_READY 事件，該事件觸發後，可正常使用 SDK 接口
      // this.tweblive.on(TcPlayer.EVENT.IM_READY, this.onReadyStateUpdate);
      // 被踢出
      // this.tweblive.on(TcPlayer.EVENT.KICKED_OUT, this.onKickedOut);
      // SDK內部出錯
      this.tweblive.on(TcPlayer.EVENT.ERROR, this.onTcPlayerError);
      // 收到自定義新消息
      // this.tweblive.on(
      //   TcPlayer.EVENT.CUSTOM_MESSAGE_RECEIVED,
      //   this.onCustomMessageReceived
      // );
      // 收到文本新消息
      // this.tweblive.on(
      //   TcPlayer.EVENT.TEXT_MESSAGE_RECEIVED,
      //   this.onTextMessageReceived
      // );
      // 加入直播間
      // this.tweblive.on(TcPlayer.EVENT.REMOTE_USER_JOIN, this.onRemoteUserJoin);
      // 離開直播間
      // this.tweblive.on(
      //   TcPlayer.EVENT.REMOTE_USER_LEAVE,
      //   this.onRemoteUserLeave
      // );
      // 推流結束
      this.tweblive.on(TcPlayer.EVENT.ENDED, this.onLiveEnd);
    },
    // 加入直播間
    enterRoom() {
      this.tweblive
        .enterRoom(this.groupInfo.group_id)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          if (error.code === 10007 || error.code === 10015) {
            console.log("你加入的直播間不存在");
          }
        });
    },
    // 退出直播間
    exitRoom() {
      return new Promise((resolve, reject) => {
        this.tweblive.exitRoom(this.groupInfo.group_id).then(res => {
          console.log(res);
          resolve();
        });
      });
    },
    clickPlay() {
      if (this.tweblive) {
        this.showControls = false;
        this.tweblive.play();
      }
    },
    destroyPlayer() {
      if (this.tweblive) {
        this.offListener();
        this.tweblive.destroyPlayer(); //銷毀播放器
      }
    },
    // 取消監聽
    offListener() {
      // this.tweblive.off(TcPlayer.EVENT.IM_READY, this.onReadyStateUpdate);
      this.tweblive.off(TcPlayer.EVENT.ERROR, this.onTcPlayerError);
      this.tweblive.off(TcPlayer.EVENT.ENDED, this.onLiveEnd);
    },
    onReadyStateUpdate(res) {
      console.log(res);
    },
    onKickedOut(res) {
      console.log(res);
    },
    onTcPlayerError(res) {
      console.log(res);
    },
    onCustomMessageReceived(res) {
      console.log(res);
    },
    onTextMessageReceived(res) {
      console.log(res);
    },
    onRemoteUserJoin(res) {
      console.log(res);
    },
    onRemoteUserLeave(res) {
      console.log(res);
    },
    onLiveEnd(res) {
      console.log(res);
    }
  }
};
</script>

<style lang="scss" scoped>
.web-player {
  width: 100%;
  height: 100%;
  // position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.controls {
  width: 100vw;
  height: 100vw;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1020;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
