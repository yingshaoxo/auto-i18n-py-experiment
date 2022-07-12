<template>
  <view class="pages">
    <view class="card-group-box">
      <lk-cell-account-item
        :title="info.title"
        :image="info.logo"
        :label="info.label"
        :label-text="info.showLabel"
        :show-label="info.type != 2"
      />
    </view>
    <view
      class="card-group-box"
      v-for="(item, index) in tipColumns[info.type]"
      :key="index"
    >
      <lk-cell :title="item.title">
        <view class="label" slot="label">
          <view v-if="item.value">{{ item.value }}</view>
          <block v-else>
            <view class="flex-space-between">
              <text>單筆限額</text>
              <text>{{ item.day_money }}</text>
            </view>
            <view class="flex-space-between">
              <text>單日限額</text>
              <text>{{ item.once_money }}</text>
            </view>
          </block>
        </view>
      </lk-cell>
    </view>
    <view class="foot-btn-group fixed" v-if="info.type == 1">
      <lk-button
        type="danger"
        :color="theme.gradient"
        round
        block
        :loading="isLoading"
        @click="onUntyingOrUpdate"
      >
        {{ btnText }}
      </lk-button>
    </view>
    <view
      class="foot-btn-group flex-space-between fixed"
      v-else-if="info.type == 3 || info.type == 4"
    >
      <lk-button
        class="btn"
        type="danger"
        :color="theme.gradient"
        round
        block
        @click="onEdit"
      >
        {{ btnText }}
      </lk-button>
      <lk-button
        class="btn"
        type="danger"
        :color="theme.color"
        round
        plain
        block
        @click="onDelete"
      >
        刪除
      </lk-button>
    </view>
    <lk-popup-bankcard-sms
      v-if="info.update"
      v-model="showBankCardSms"
      type="signing"
      :info="signingInfo"
      @success="signingSuccess"
      @close="signingClose"
    />
  </view>
</template>

<script>
import { Base64 } from "@/common/lib/base64";
import { yuan } from "@/common/utils";
import {
  GET_ACCOUNTINFO,
  UNTYING_BANKCARD,
  DEL_ASSETACCOUNT,
  UPDATE_BANKCARD
} from "@/common/interface/property";
import { mapState } from "vuex";
import property from "@/mixins/property";
export default {
  name: "packages-property-account-post",
  data() {
    return {
      info: {},
      signingInfo: {},
      isLoading: false,
      showBankCardSms: false
    };
  },
  mixins: [property],
  computed: {
    ...mapState({
      payConfig: ({ config }) => config.payConfig,
      memberInfo: ({ member }) => member.info
    }),
    tipColumns() {
      const info = this.info;
      return {
        1: [
          {
            title: "銀行支付限額",
            day_money: info.day_money != "-" ? yuan(info.day_money) : "不限額",
            once_money:
              info.once_money != "-" ? yuan(info.once_money) : "不限額",
            value: ""
          },
          {
            title: "賬戶提示",
            value: "該賬戶可用於銀行卡支付與提現。"
          }
        ],
        2: [
          {
            title: "賬戶提示",
            value:
              "微信授權登錄後自動生成，該賬戶可用于微信提現，上述字符串為所授權的微信號提現的唯一標識，所以該賬戶無法編輯。"
          }
        ],
        3: [
          {
            title: "賬戶提示",
            value: "該賬戶可用於支付寶提現。"
          }
        ],
        4: [
          {
            title: "賬戶提示",
            value: "該賬戶可用於銀行卡提現。"
          }
        ]
      };
    },
    btnText() {
      return this.info.type == 1 || this.info.type == 4
        ? this.info.update
          ? "升級"
          : "解綁"
        : "編輯";
    }
  },
  onLoad(query) {
    this.account_id = query.account_id;
    if (this.account_id == -2) {
      this.info = {
        title: "微信賬號",
        type: 2,
        id: "-2",
        logo: this.static.baseImgPath + "icon-wechat.png",
        label: this.memberInfo.openid,
        showLabel: this.memberInfo.openid
      };
    } else {
      this.getData();
    }
  },
  methods: {
    getData() {
      GET_ACCOUNTINFO({ account_id: this.account_id }).then(({ data }) => {
        const info = data ? this.packageAccountList([data], true) : [];
        const item = info[0];
        const obj = {
          id: null,
          type: null,
          title: null,
          logo: null,
          label: null,
          showLabel: null,
          realname: null
        };
        for (let key in obj) {
          obj[key] = item[key];
        }
        // 銀行卡類型添加 是否为可升級账号
        if (item.type == 1 || item.type == 4) {
          if (item.type == 1) {
            obj.update = !!item.is_update;
          }
          if (item.type == 4) {
            obj.update = !!this.payConfig.tlPay;
          }
          // 升級签约参数
          this.signingInfo = {
            account_id: data.id,
            realname: data.realname,
            account_number: data.account_number,
            bank_code: data.bank_code,
            bank_type: data.bank_type,
            bank_card: data.bank_card,
            valid_date: data.valid_date,
            cvv2: data.cvv2,
            mobile: data.mobile,
            thpinfo: "",
            smscode: ""
          };
        }
        if (item.type == 1) {
          obj.once_money = item.once_money;
          obj.day_money = item.day_money;
        }
        if (item.type == 2) {
          obj.label = this.memberInfo.openid;
          obj.showLabel = this.memberInfo.openid;
        }
        if (item.type == 4) {
          obj.bank_name = item.open_bank;
        }
        this.info = obj;
      });
    },
    onUntyingOrUpdate() {
      if (this.info.update) {
        this.onUpdate();
      } else {
        this.onUntying();
      }
    },
    //關閉簽約
    signingClose() {
      this.isLoading = false;
    },
    //簽約成功
    signingSuccess() {
      setTimeout(() => {
        this.$Navigate.back();
      }, 500);
    },
    // 升級银行卡
    onUpdate() {
      this.isLoading = true;
      UPDATE_BANKCARD({ account_id: this.info.id })
        .then(({ code, data, message }) => {
          if (code == 1) {
            if (data.thpinfo) {
              this.signingInfo.thpinfo = data.thpinfo;
              this.showBankCardSms = true;
            } else {
              this.$Prompt.toast("獲取短信驗證失敗");
              this.isLoading = false;
            }
          } else {
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              this.signingSuccess();
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    onUntying() {
      this.$Prompt
        .modal({
          title: "提示",
          content: "确定解綁该银行卡吗?"
        })
        .then(() => {
          UNTYING_BANKCARD({ id: this.info.id }).then(({ message }) => {
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              setTimeout(() => {
                this.$Navigate.back();
              }, 500);
            });
          });
        });
    },
    onEdit() {
      const info = this.info;
      const obj = {};
      obj.account_id = info.id;
      obj.type = info.type;
      obj.realname = info.realname;
      obj.account_number = info.showLabel;
      if (info.type == 4) {
        obj.bank_name = info.bank_name;
      }
      this.$Navigate.push({
        path: "/packages/property/account/post",
        query: {
          info: JSON.stringify(obj),
          hash: "edit"
        }
      });
    },
    onDelete() {
      this.$Prompt
        .modal({
          title: "提示",
          content: "确定刪除该账户吗?"
        })
        .then(() => {
          DEL_ASSETACCOUNT({ account_id: this.info.id }).then(({ message }) => {
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              setTimeout(() => {
                this.$Navigate.back();
              }, 500);
            });
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.label {
  color: $text-light;
  font-size: $font-size-sm;
}
.flex-space-between {
  display: flex;
  justify-content: space-between;
}
.btn {
  margin: 0 20rpx;
  flex: 1;
}
</style>
