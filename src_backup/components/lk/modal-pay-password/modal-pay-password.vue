<template>
  <view class="modal-pay-password">
    <lk-popup
      v-model="show"
      round
      :title="title"
      prevent-touchmove
      :mask-close="false"
    >
      <view class="password-box">
        <view class="cell-title" v-if="moneyTitleName">{{
          moneyTitleName
        }}</view>
        <view class="cell-money" v-if="moneyTextName">{{ moneyTextName }}</view>
        <view class="cell-fee-group">
          <view class="fee-item" v-if="chargeServiceName">
            <text>手續費</text>
            <text>{{ chargeServiceName }}</text>
          </view>
          <view class="fee-item" v-if="chargeCpu">
            <text>損耗cpu</text>
            <text>{{ chargeCpu }}</text>
          </view>
          <view class="fee-item" v-if="chargeNet">
            <text>損耗net</text>
            <text>{{ chargeNet }}</text>
          </view>
        </view>
        <lk-field
          v-model="password"
          label="支付密碼"
          size="large"
          type="password"
          placeholder="请输入支付密碼"
          autofocus
          clearable
        />
        <view class="tip">{{ pplText }}</view>
        <view class="forget-text">
          <text @click="isShowSetPayPassword = true">忘記密碼？</text>
        </view>
      </view>
      <view class="password-btn-group">
        <lk-button class="btn" block square plain @click="cancel">
          取消
        </lk-button>
        <lk-button class="btn" block square theme-color @click="confirm">
          確定
        </lk-button>
      </view>
    </lk-popup>
    <lk-popup
      v-model="notifyInfo.show"
      round
      prevent-touchmove
      :mask-close="false"
    >
      <view class="notify-box" v-if="notifyInfo.show">
        <view class="message-text">{{ notifyInfo.message }}</view>
        <view class="tip-text">{{ notifyInfo.tip }}</view>
        <view class="foot">
          <lk-button
            class="btn"
            theme-color
            block
            round
            @click="notifyInfo.confirm()"
          >
            {{ notifyInfo.confirmText }}
          </lk-button>
          <lk-button class="btn" block round @click="notifyInfo.cancel()">
            {{ notifyInfo.cancelText }}
          </lk-button>
        </view>
      </view>
    </lk-popup>
    <lk-popup-set-pay-password v-model="isShowSetPayPassword" />
  </view>
</template>

<script>
import { yuan } from "@/common/utils";
import { validPayPassword } from "@/common/utils/validator";
import { mapState, mapActions } from "vuex";
import focusout from "@/mixins/focusout";

/**
 * 添加餘額符號或虛擬幣符號
 * type ==> 類型 yuan/bi
 * num  ==> 金額
 */
function addSymbol(type, num) {
  return type == "yuan" ? yuan(num) : num + type;
}
export default {
  data() {
    return {
      password: "",
      isShowSetPayPassword: false,
      chargeService: null, // 手續費
      // chargeCpu: null, // 損耗cpu
      // chargeNet: null, // 損耗net

      notifyInfo: {
        show: false
      }
    };
  },
  mixins: [focusout],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "请输入支付密碼"
    },
    type: [Number, String],
    money: [Number, String],
    chargeServiceMoney: [Number, String], //虚拟币支付时需要用余額金額计算手續費
    address: String, //虛擬幣轉賬時需要轉賬地址

    moneyTitle: String,
    moneyText: String,
    charge: [String, Number],
    chargeCpu: String, // 損耗cpu
    chargeNet: String // 損耗net
  },
  watch: {
    show(e) {
      if (e && this.type && this.money) {
        this.getChargeService();
      }
    }
  },
  computed: {
    ...mapState(["member", "distribute", "config"]),
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    moneyTitleName() {
      if (this.moneyTitle) {
        return this.moneyTitle;
      }
      return this.typeTextObj(this.type).text;
    },
    moneyTextName() {
      if (this.moneyText) {
        return this.moneyText;
      }
      const symbol = this.typeTextObj(this.type).symbol;
      const type = this.typeTextObj(this.type).type;
      let text = null;
      symbol && this.money && (text = addSymbol(symbol, this.money));
      if (symbol && this.money) {
        text = type == "point" ? this.money : addSymbol(symbol, this.money);
      }
      return text;
    },
    chargeServiceName() {
      if (this.charge) {
        return this.charge;
      }
      return this.chargeService;
    },
    pplText() {
      let text = "由9-20個字母、數字、普通字符組成";
      if (this.config.ppl == 6) {
        text = "長度為6位，由字母、數字、普通字符組成";
      }
      if (this.config.ppl == 9) {
        text = "長度為9位，由字母、數字、普通字符組成";
      }
      return text;
    }
  },
  mounted() {
    if (process.env.NODE_ENV != "development") {
      this.getConfig({ update: true });
    }
  },
  methods: {
    typeTextObj(type) {
      const { balance_style, point_style } = this.member.texts;
      const { commission } = this.distribute.texts;
      let item = {
        text: null
      };
      const obj = {
        1: {
          text: balance_style + "支付",
          symbol: "yuan"
        },
        2: {
          text: balance_style + "提現",
          symbol: "yuan"
        },
        3: {
          text: balance_style + "轉賬",
          symbol: "yuan"
        },
        4: {
          text: balance_style + "兌換" + point_style,
          symbol: "yuan"
        },
        5: {
          text: point_style + "兌換" + balance_style,
          symbol: "yuan",
          type: "point"
        },
        6: {
          text: commission + "提現",
          symbol: "yuan"
        },
        7: {
          text: "收益提現",
          symbol: "yuan"
        },
        8: {
          text: "ETH支付",
          symbol: "ETH"
        },
        9: {
          text: "ETH轉賬",
          symbol: "ETH"
        },
        10: {
          text: "ETH兌換" + point_style,
          symbol: "ETH"
        },
        11: {
          text: point_style + "兌換ETH",
          symbol: "ETH",
          type: "point"
        },
        12: {
          text: "EOS支付",
          symbol: "EOS"
        },
        13: {
          text: "EOS轉賬",
          symbol: "EOS"
        },
        14: {
          text: "EOS兌換" + point_style,
          symbol: "EOS"
        },
        15: {
          text: point_style + "兌換EOS",
          symbol: "EOS",
          type: "point"
        },
        16: {
          text: commission + "提現",
          symbol: "yuan"
        }
      };
      type && (item = obj[type]);
      return item;
    },
    clearPassword() {
      this.password = "";
    },
    getChargeService() {
      let params = {
        types: this.type,
        money: this.money || 0
      };
      if (this.chargeServiceMoney) {
        params.money = this.chargeServiceMoney || 0;
      }
      if (this.address) {
        params.address = this.address;
      }
      const symbol = this.typeTextObj(this.type).symbol;
      this.chargeService = "獲取中";
      // if (symbol == "EOS") {
      //   this.chargeCpu = "獲取中";
      //   this.chargeNet = "獲取中";
      // }
      this.$store
        .dispatch("getPropertyChargeService", params)
        .then(data => {
          this.chargeService = addSymbol(symbol, data.charge || 0);
          // if (symbol == "EOS") {
          //   this.chargeCpu = addSymbol("ms", data.cpucharge || 0);
          // }
          // if (symbol == "EOS") {
          //   this.chargeNet = addSymbol("kb", data.netcharge || 0);
          // }
        })
        .catch(() => {
          this.chargeService = "獲取失敗";
          // if (symbol == "EOS") {
          //   this.chargeCpu = "獲取失敗";
          //   this.chargeNet = "獲取失敗";
          // }
        });
    },
    close() {
      this.show = false;
    },
    cancel() {
      this.close();
      this.$emit("cancel");
    },
    confirm() {
      if (!validPayPassword(this.password, this.config.ppl)) {
        return false;
      }
      this.close();
      this.$emit("confirm", this.password);
    },
    notify(option = {}) {
      this.notifyInfo = {
        show: true,
        message: option.message || "為了您賬號安全，建议您立即設置支付密碼",
        tip:
          option.tip || '您也可以到"會員中心"-"設置"-"設置支付密碼"中自行設置',
        confirmText: option.confirmText || "立即設置",
        cancelText: option.cancelText || "暂不設置",
        confirm: e => {
          this.notifyInfo.show = false;
          typeof option.confirm == "function" && option.confirm("confirm");
        },
        cancel: e => {
          this.notifyInfo.show = false;
          typeof option.cancel == "function" && option.cancel("cancel");
        }
      };
    }
  },
  beforeDestroy() {
    this.show = false;
    this.isShowSetPayPassword = false;
  },
  deactivated() {
    this.show = false;
    this.isShowSetPayPassword = false;
  }
};
</script>

<style lang="scss" scoped>
.modal-pay-password {
  .password-box {
    padding: 30rpx 0px 30rpx;
    width: 80vw;
  }

  .cell-title {
    text-align: center;
    font-size: $font-size-sm;
    color: $text-gray;
  }

  .cell-money {
    text-align: center;
    color: $red;
    font-weight: 800;
    font-size: $font-size-lg;
    padding: 10rpx 0;
    line-height: 48rpx;
  }

  .cell-fee-group {
    margin: 10rpx 0;
  }

  .fee-item {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
    color: $text-light;
    padding: 4rpx 30rpx;
    line-height: 1;
  }

  .tip {
    color: $text-light;
    text-align: center;
    font-size: $font-size-sm;
    margin-top: 20rpx;
  }

  .forget-text {
    margin-top: 20rpx;
    font-size: $font-size-sm;
    text-align: center;
    color: $blue;
  }
  .password-btn-group {
    display: flex;
    .btn {
      flex: 1;
    }
    .confirm-color {
      color: $red;
    }
  }

  .notify-box {
    display: flex;
    flex-direction: column;
    padding: $cell-padding;
    width: 80vw;
    .message-text {
      font-weight: 700;
      color: $text-gray;
      font-size: $font-size-lg;
      margin: 10rpx 0;
      text-align: center;
      line-height: 48rpx;
    }
    .tip-text {
      font-size: $font-size-xs;
      color: $text-light;
      line-height: 1.2;
      text-align: center;
      margin: 10rpx 0;
    }
    .foot {
      display: flex;
      flex-direction: column;
      padding: 20rpx 80rpx;
      .btn {
        margin: 10rpx 0;
      }
    }
  }
}
</style>
