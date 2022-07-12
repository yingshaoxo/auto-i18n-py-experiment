const io = require("../lib/socket.io");
var socket = "";
// 服務的客服標識
var kefuCode = 0;
// 服務的客服名稱
var kefuName = "";
// 是否已經連接過
var isConnect = 0;
// 訪客基礎信息
var customer = {
  uid: 0,
  name: "",
  avatar: "",
  seller: "",
  regTime: "",
  goods: "",
  kefuCode: "",
  tk: "",
  t: ""
};
// 常見問題
var comQuestion = "";
// 加載記錄一次
var chatLogType = 0;
// 是否打開
var isOpen = 0;
// 重連客服計時句柄
var reConnectInterval = 0;
// 重新接入計時句柄
var reInInterval = 0;
// 訪問地址最大重新連接次數
var nowRetryUrlNum = 1;
var maxRetryUrlNum = 5;
// 分配客服最大重新連接次數
var nowRetryNum = 1;
var maxRetryNum = 5;
// 會員接入最大重新進入次數
var nowRetryInNum = 1;
var maxRetryInNum = 5;
//斷網標識
var isBreak = 1;
import { formatDate } from "@/common/utils";
import { GET_QLKEFUUPDATEUSER } from "@/common/interface/message";
export default {
  methods: {
    // 初始化Socket
    initSocket(info, qlkefuIO) {
      const ioSrc = qlkefuIO || "https://qlkefu.com:2020";
      customer = info;
      socket = io(ioSrc, {
        query: {},
        transports: ["websocket", "polling"],
        timeout: 10000
      });
      socket.on("connect", () => {
        // 兼容斷網
        this.tryReIn();
        if (customer.kefuCode) {
          this.tryToKfuConnect();
        } else {
          this.tryToConnect();
        }
      });

      //地址鍊接錯誤
      socket.on("connect_error", () => {
        if (nowRetryUrlNum < maxRetryUrlNum) {
          nowRetryUrlNum++;
        } else {
          //斷開鍊接
          socket.close();
        }
      });

      socket.on("disconnect", () => {
        console.log("斷開連接");
        isConnect = 0;
        kefuCode = 0;
        kefuName = 0;
        isBreak = 0;
        console.log("重連中");
      });

      // 聊天消息
      socket.on("chatMessage", res => {
        // console.log("聊天消息", res);
        typeof this.onChatMessage === "function" &&
          this.onChatMessage(res.data);
      });

      // 常見問題
      socket.on("comQuestion", res => {
        console.log("comQuestion", res);
        res.data.content = res.data.question_title;
        typeof this.onComQuestion === "function" && this.onComQuestion(res);
      });

      // 問候語
      socket.on("hello", res => {
        console.log("hello", res);
        typeof this.onHello === "function" && this.onHello(res);
        // $(".chat-box").append(qlkefu.showSystem(data.data.msg));
        // wordBottom();
      });

      // 被關閉
      socket.on("isClose", res => {
        console.log("isClose", res);
        kefuCode = 0;
        kefuName = "";
        isConnect = 0;
        typeof this.onIsClose === "function" && this.onIsClose(res);
      });

      // 處理轉接
      socket.on("relink", ({ data }) => {
        console.log("relink", data);
        kefuCode = data.kefu_code;
        kefuName = data.kefu_name;
        typeof this.onRelink === "function" && this.onRelink(res);
        // $(".chat-header-title").text(kefuName);
        // $(".chat-box").append(qlkefu.showSystem(data.data.msg));
        // wordBottom();
      });

      // 被主動接待
      socket.on("linkByKF", res => {
        console.log("linkByKF", res);
        isConnect = 1;
        kefuCode = data.kefu_code;
        kefuName = data.kefu_name;
        if (0 == isOpen) {
          isConnect = 1;
        }
        typeof this.onLinkByKF === "function" && this.onLinkByKF(res);
      });

      //標記已讀
      socket.on("readMessage", res => {
        console.log("readMessage", res);
        typeof this.onReadMessage === "function" && this.onReadMessage("mine");
      });
    },
    // 嘗試接入
    tryReIn() {
      const params = {
        data: {
          customer_id: this.customer.uid,
          customer_name: this.customer.name,
          customer_avatar: this.customer.avatar,
          seller_code: this.customer.seller,
          tk: this.customer.tk,
          t: this.customer.t
        }
      };
      // #ifdef MP
      console.log("嘗試接入", params);
      // #endif
      socket.emit("customerIn", JSON.stringify(params), res => {
        const { code, data } = JSON.parse(res);
        if (400 == code) {
          clearInterval(reInInterval);
          if (nowRetryInNum < maxRetryInNum) {
            reInInterval = setInterval(() => {
              this.tryReIn();
              nowRetryInNum++;
            }, 1000);
          }
        } else if (0 == code) {
          clearInterval(reInInterval);
        } else if (201 == code) {
          isConnect = 0;
        }
        typeof this.onConnect === "function" && this.onConnect({ code, data });
      });
    },
    // 嘗試連接客服
    tryToConnect() {
      socket.emit("userInit", JSON.stringify(customer), res => {
        const { code, data, msg } = JSON.parse(res);
        // console.log({ code, data, msg });
        if (chatLogType == 0) {
          chatLogType = 1;
        }
        this.pushSystemMsg({ code, data, msg });
        if (400 == code) {
          clearInterval(reConnectInterval);
          if (nowRetryNum < maxRetryNum) {
            reConnectInterval = setInterval(() => {
              this.tryToConnect();
              nowRetryNum++;
            }, 2000);
          } else {
            setTimeout(() => {
              console.log("連接客服失敗");
            }, 1000);
          }
        } else if (0 == code) {
          clearInterval(reConnectInterval);
          isConnect = 1;
          isOpen = 1;

          kefuCode = data.kefu_code;
          kefuName = data.kefu_name;

          this.pushCustomerReferrer(customer.uid);
        } else if (201 == code) {
          clearInterval(reConnectInterval);
          isConnect = 0;

          this.pushCustomerReferrer(customer.uid);
          setTimeout(() => {
            // $(".chat-box").append(qlkefu.showSystem(data.msg, 1));
            // wordBottom();
          }, 1000);
        } else if (202 == code || 500 == code) {
          clearInterval(reConnectInterval);
          isConnect = 0;
          // $(".chat-box").append(qlkefu.showSystem(msg, 1));
          // wordBottom();
        } else if (203 == code) {
          clearInterval(reConnectInterval);
          isConnect = 0;
          isOpen = 1;
          kefuCode = data.kefu_code;
          kefuName = data.kefu_name;

          this.pushCustomerReferrer(customer.uid);

          setTimeout(() => {
            // $(".chat-box").append(qlkefu.showSystem(msg, 1));
            // wordBottom();
          }, 1000);
        }
      });
    },
    //連接指定客服
    tryToKfuConnect() {
      socket.emit("userConnect", JSON.stringify(customer), res => {
        const { code, data, msg } = JSON.parse(res);
        if (chatLogType == 0) {
          chatLogType = 1;
          comQuestion = "";
        }
        this.pushSystemMsg({ code, data, msg });
        if (0 == code) {
          clearInterval(reConnectInterval);
          isConnect = 1;
          isOpen = 1;
          kefuCode = data.kefu_code;
          kefuName = data.kefu_name;
          this.pushCustomerReferrer(customer.uid);
        } else if (500 == code) {
          clearInterval(reConnectInterval);
        }
      });
    },
    // 發送來路信息
    pushCustomerReferrer(customer_id) {
      let params = {
        customer_id: customer_id,
        seller_code: customer.seller,
        referrer: "",
        nick_name: customer.name,
        reg_time: customer.regTime
      };
      if (customer.goods) {
        params.goods = JSON.stringify(customer.goods);
      }
      // GET_QLKEFUUPDATEUSER(params, {
      //   baseUrl: this.qlApiBaseUrl
      // });
    },
    // 發送未讀信息
    emitNoRead(msg_id) {
      return new Promise((resolve, reject) => {
        let noReadIds = [];
        if (typeof msg_id == "string") {
          noReadIds = [msg_id];
        } else {
          noReadIds = [...msg_id];
        }
        if (noReadIds.length) {
          const params = {
            uid: kefuCode,
            mid: noReadIds.join(",")
          };
          socket.emit("readMessage", JSON.stringify(params), res => {
            var { code, data } = JSON.parse(res); // 發送成功或者失敗回調
            if (0 == code) {
              resolve();
            }
          });
        }
      });
    },
    // 發送信息
    emitChatMessage(content = "") {
      return new Promise((resolve, reject) => {
        const params = {
          from_name: customer.name,
          from_avatar: customer.avatar,
          from_id: customer.uid,
          to_id: kefuCode,
          to_name: kefuName,
          content,
          seller_code: customer.seller
        };
        // console.log(params)
        socket.emit("chatMessage", JSON.stringify(params), res => {
          const { code, data, msg } = JSON.parse(res);
          // console.log({ code, data, msg });
          if (400 == code) {
          } else if (0 == code) {
          }
          resolve({
            create_time: formatDate(data.chat_time, "YYYY-MM-DD hh:mm:ss"),
            read_status: 0,
            content: content,
            ...data
          });
        });
      });
    },
    // 自動回復
    emitAutoAnswer({ question_id, question }) {
      return new Promise((resolve, reject) => {
        const params = {
          question_id: question_id,
          seller_code: customer.seller
        };
        socket.emit("comQuestion", JSON.stringify({ data: params }), res => {
          const { code, data, msg } = JSON.parse(res);
          if (400 == code) {
          } else if (0 == code) {
            // 發送成功，未讀
          }
          resolve({
            ...data
          });
        });
      });
    }
  }
};
