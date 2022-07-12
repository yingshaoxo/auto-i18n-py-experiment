import { mapActions, mapState } from "vuex";
import { GET_BLOCKCHAINBIINFO } from "@/common/interface/blockchain";
import { yuan } from "@/common/utils";
export default {
  data() {
    return {
      pageType: "",
      symbol: ""
    };
  },
  onLoad(query) {
    this.pageType = String(query.type).toLocaleLowerCase();
    this.symbol = String(query.type).toLocaleUpperCase();
    // 獲取基礎配置
    // this.getBlockchainBaseData()
    //   .then(data => {
    //     typeof this.blockchainBaseDataCall === "function" &&
    //       this.blockchainBaseDataCall(data);
    //   })
    //   .catch(() => {});
    this.getBiInfo({ symbol: this.symbol })
      .then(data => {
        typeof this.blockchainBaseDataCall === "function" &&
          this.blockchainBaseDataCall(data);
      })
      .catch(() => {});
  },
  computed: {
    ...mapState({
      blockchainSet: ({ blockchain }) => blockchain.config
    })
  },
  methods: {
    ...mapActions(["getBlockchainSet", "getEthInfo", "getEosInfo"]),
    getBiInfo(option) {
      return new Promise((resolve, reject) => {
        GET_BLOCKCHAINBIINFO(option, { isShowLoading: true })
          .then(({ data }) => {
            let obj = data || {};
            obj.symbol_type = String(data.symbol).toLocaleLowerCase();
            obj.symbol = String(data.symbol).toLocaleUpperCase();
            obj.money_text = yuan(data.money);
            resolve(obj || {});
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 獲取基礎信息
    getBlockchainBaseData() {
      return new Promise((resolve, reject) => {
        this.getBlockchainSet()
          .then(set => {
            const arr = set.wallet_type.split(",");
            if (this.pageType == "eth") {
              if (arr[0] == 1) {
                this.getEthInfo()
                  .then(({ code, data }) => {
                    if (code == 1) {
                      resolve(data);
                    } else {
                      this.$Prompt
                        .modal({
                          title: "提示",
                          content: "暫無ETH錢包",
                          showCancel: false
                        })
                        .then(() => {
                          this.$Navigate.replace("/pages/blockchain/list");
                        });
                    }
                  })
                  .catch(() => {
                    reject();
                  });
              } else {
                this.$Prompt.toast("未開啟ETH錢包！").then(() => {
                  this.$Navigate.replace("/pages/blockchain/list");
                });
              }
            } else if (this.pageType == "eos") {
              if (arr[0] == 2 || arr[1] == 2) {
                this.getEosInfo()
                  .then(({ code, data }) => {
                    if (code == 1) {
                      resolve(data);
                    } else {
                      this.$Prompt
                        .modal({
                          title: "提示",
                          content: "暫無EOS錢包",
                          showCancel: false
                        })
                        .then(() => {
                          this.$Navigate.replace("/pages/blockchain/list");
                        });
                    }
                  })
                  .catch(() => {
                    reject();
                  });
              } else {
                this.$Prompt.toast("未開啟EOS錢包！").then(() => {
                  this.$Navigate.replace("/pages/blockchain/list");
                });
              }
            } else {
              this.$Prompt
                .modal({
                  title: "提示",
                  content: "很抱歉，找不到你要訪問的頁面",
                  showCancel: false
                })
                .then(() => {
                  this.$Navigate.replace("/pages/blockchain/list");
                });
            }
          })
          .catch(() => {
            reject();
          });
      });
    }
  }
};
