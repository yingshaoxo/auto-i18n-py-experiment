<template>
  <view>
    <view>
      <cell-select-bank @select="onSelectBank" />
      <lk-field
        required
        label="銀行卡號"
        type="number"
        placeholder="请輸入銀行卡號"
        v-model="info.account_number"
      />
      <lk-field
        required
        label="持卡人"
        placeholder="請輸入持卡人姓名"
        v-model="info.realname"
      />
      <lk-field
        required
        label="身份證號"
        type="idcard"
        placeholder="请輸入身份證號"
        v-model="info.bank_card"
      />
      <lk-field
        required
        label="手機號"
        type="number"
        placeholder="银行预留的手機號"
        v-model="info.mobile"
      >
        <view slot="rightIcon">
          <lk-icon
            name="warning-o"
            size="20"
            :color="theme.color"
            @click="onShowExample('mobile')"
            v-if="isCredit"
          />
        </view>
      </lk-field>
      <block v-if="isCredit">
        <lk-field
          required
          label="有效期"
          type="number"
          maxlength="4"
          placeholder="示例：01/20，輸入0120"
          v-model="info.valid_date"
        >
          <lk-icon
            name="warning-o"
            slot="rightIcon"
            size="20"
            :color="theme.color"
            @click="onShowExample('valid_date')"
          />
        </lk-field>
        <lk-field
          required
          label="安全碼"
          type="number"
          maxlength="3"
          placeholder="卡背後三位數"
          v-model="info.cvv2"
        >
          <lk-icon
            name="warning-o"
            slot="rightIcon"
            size="20"
            :color="theme.color"
            @click="onShowExample('cvv2')"
          />
        </lk-field>
      </block>

      <!-- 輸入驗證码 -->
      <lk-field
        v-if="joinpaycode"
        required
        label="短信驗證碼"
        type="number"
        placeholder="请輸入驗證码"
        v-model="joinsmscode"
      />
    </view>
    <lk-popup
      v-model="showExamplePopup"
      wrpper-style="background:transparent;"
      v-if="isCredit"
    >
      <view class="example-box" v-if="showExample">
        <view class="example-title">{{ exampleData[showExample].title }}</view>
        <image
          class="example-img"
          mode="widthFix"
          :src="exampleData[showExample].img"
          v-if="exampleData[showExample].img"
        />
        <view class="example-text">{{ exampleData[showExample].text }}</view>
      </view>
    </lk-popup>
    <view class="foot-btn-group">
      <lk-button
       v-if="!joinpaycode"
        type="danger"
        :color="theme.gradient"
        round
        block
        @click="save"
        :loading="loading"
      >
        驗證並保存
      </lk-button>
       <!-- 匯聚簽約 -->
      <lk-button
        v-if="joinpaycode"
        type="danger"
        :color="theme.gradient"
        round
        block
        @click="sign"
      >輸入驗證码,進行簽約</lk-button>
    </view>
  </view>
</template>

<script>
import cellSelectBank from "./cell-select-bank";
import { validCard, validMobile } from "@/common/utils/validator";
import { mapGetters } from "vuex";
import { SIGNING_BANKCARD } from "@/common/interface/property";
export default {
  data() {
    return {
        joinsmscode: "", //短信驗證碼
      isCredit: false, //是否為信用卡
      showExamplePopup: false,
      showExample: "",
    };
  },
  props: {
    info: Object,
    loading: {
      type: Boolean,
      default: false,
    },
     joinpaycode: {}, //驗證成功显示驗證码輸入框
    q1_OrderNo: {}, //匯聚簽約数据
  },
  computed: {
    ...mapGetters(["static"]),
    exampleData() {
      return {
        valid_date: {
          title: "有效期說明",
          img: this.static.baseImgPath + "bank-demo-01.png",
          text:
            "有效期是打印在信用卡正面卡號下方。標準格式為月份在前，年份在後的一串數字。",
        },
        cvv2: {
          title: "安全碼说明",
          img: this.static.baseImgPath + "bank-demo-02.png",
          text: "安全碼是卡背面签名区的一组数字，一般為末位三位數字。",
        },
        mobile: {
          title: "預留手機說明",
          img: "",
          text:
            "银行预留的手機號码是办理该银行卡时所填写的手机行号。沒有預留、手機號码忘记或者手機號码停用，請聯繫銀行客服更新處理。",
        },
      };
    },
  },
  methods: {
     sign() {
      //匯聚簽約
      console.log(this.info);
      this.info["smscode"] = this.joinsmscode;
      this.info["q1_OrderNo"] = this.q1_OrderNo;

      if (!this.joinsmscode) {
        this.$Prompt.toast("请輸入驗證码");
        return false;
      }
      SIGNING_BANKCARD(this.info)
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            this.$Prompt.toast({ title: res.message, icon: "success" });
            setTimeout(() => {
              this.$Navigate.back();
            }, 1200);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    onSelectBank({ bank_type, bank_code }) {
      this.info.bank_type = bank_type;
      this.info.bank_code = bank_code;
      if (bank_type == "02") {
        this.isCredit = true;
      } else {
        this.isCredit = false;
        delete this.info.cvv2;
        delete this.info.valid_date;
      }
    },
    // 顯示示例
    onShowExample(action) {
      this.showExamplePopup = true;
      this.showExample = action;
    },
    // 驗證
    validator() {
      const info = this.info;
      if (!info.bank_type) {
        this.$Prompt.toast("請選擇銀行！");
        return false;
      }
      if (!info.account_number) {
        this.$Prompt.toast("请輸入銀行卡號！");
        return false;
      }
      if (!info.realname) {
        this.$Prompt.toast("請輸入持卡人姓名！");
        return false;
      }
      if (!validCard(info.bank_card)) {
        return false;
      }
      if (!validMobile(info.mobile)) {
        return false;
      }
      if (this.isCredit) {
        if (!info.valid_date) {
          this.$Prompt.toast("请輸入银行卡有效期！");
          return false;
        }
        if (!info.cvv2) {
          this.$Prompt.toast("请輸入银行卡安全碼！");
          return false;
        }
      }
      return info;
    },
    save() {
      const info = this.validator();
      if (info) {
        this.$emit("save", info);
      }
    },
  },
  components: {
    cellSelectBank,
  },
};
</script>

<style lang="scss" scoped>
.example-box {
  width: 80%;
  max-height: 60%;
  margin: 0 auto;
}

.example-img {
  max-width: 100%;
  display: block;
  height: auto;
}

.example-title {
  padding: 30rpx 20rpx;
  border-bottom: 2rpx solid #fff;
  text-align: center;
  font-size: $font-size-lg;
  color: #fff;
  margin-bottom: 30rpx;
}

.example-text {
  color: #fff;
  line-height: 1.4;
  margin-top: 30rpx;
}
</style>
