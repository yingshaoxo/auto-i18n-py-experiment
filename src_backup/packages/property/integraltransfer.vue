<template>
  <view class="pages">
    <view>
      <lk-cell :title="paramText.usable" field>
        <view class="price-color">{{ paramText.number }}</view>
      </lk-cell>
      <lk-cell :title="paramText.typeText" field>
        <lk-radio-group
          v-model="type"
          :active-color="theme.color"
          @change="change"
        >
          <lk-radio :name="1">{{ paramText["1"].user }}</lk-radio>
          <lk-radio :name="2">{{ paramText["2"].user }}</lk-radio>
        </lk-radio-group>
      </lk-cell>
      <lk-field
        :label="paramText[type].user"
        type="number"
        v-model="params[paramText[type].name]"
        :placeholder="paramText[type].userPlaceholder"
        clearable
      />
      <lk-field
        :label="paramText.input"
        type="digit"
        v-model="params.money"
        :placeholder="paramText.inputPlaceholder"
        @input="onInput"
        clearable
      />
      <lk-field
        :label="paramText.remark"
        :placeholder="paramText.remarkPlaceholder"
        v-model="params.remark"
      />
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      type="3"
      :money="params.money"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        theme-color
        :loading="isLoading"
        :disabled="isDisabled"
        @click="onTransfer"
      >
        {{ pageTypeText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { TRANS_INTEGRAL } from "@/common/interface/property";
import { validMobile } from "@/common/utils/validator";
import { mapState, mapActions } from "vuex";
import { yuan } from "@/common/utils";
import mixinPayPassword from "@/mixins/valid-pay-password";
export default {
  name: "packages-property-integraltransfer",
  data() {
    return {
      type: 1,
      params: {
        user_id: null,
        mobile: null,
        money: null,
        remark: null
      },
      isLoading: false,
      pageTypeText: "轉贈"
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info,
      memberTexts: ({ member }) => member.texts
    }),
    isDisabled() {
      return !parseFloat(this.memberInfo.point);
    },
    paramText() {
      return {
        typeText: this.pageTypeText + "方式",
        usable: "可用" + this.memberTexts.point_style,
        number: this.memberInfo.point,
        1: {
          name: "user_id",
          user: "會員ID",
          userPlaceholder: "請輸入收款人ID"
        },
        2: {
          name: "mobile",
          user: "手機號碼",
          userPlaceholder: "請輸入会员手機號碼"
        },
        input: this.pageTypeText + this.memberTexts.point_style,
        inputPlaceholder:
          "請輸入" + this.pageTypeText + this.memberTexts.point_style,
        remark: "備注",
        remarkPlaceholder: "選填"
      };
    }
  },

  methods: {
    ...mapActions(["setSubscribe"]),
    change(e) {
      if (e == 1) {
        this.params.mobile && delete this.params.mobile;
      } else {
        this.params.user_id && delete this.params.user_id;
      }
    },
    onInput(e) {
      let money = parseFloat(this.memberInfo.point);
      let value = parseFloat(e);
      value && value > money && (this.params.money = money);
    },
    onPayPassword(e) {
      this.password = e;
      this.onTransfer();
    },
    onTransfer() {
      if (this.type == 1 && !this.params.user_id) {
        this.$Prompt.toast(this.paramText[this.type].userPlaceholder);
        return false;
      }
      if (this.type == 2 && !validMobile(this.params.mobile)) {
        return false;
      }
      if (!this.params.money) {
        this.$Prompt.toast(this.paramText.inputPlaceholder);
        return false;
      }
      this.isLoading = true;
      this.validPayPassword(this.password).then(() => {
        TRANS_INTEGRAL(this.params)
          .then(({ data }) => {
            this.setSubscribe({ type: 3 })
              .then(() => {
                this.$Prompt
                  .toast({
                    title: this.pageTypeText + "成功",
                    icon: "success"
                  })
                  .then(() => {
                    this.$Navigate.back();
                  });
              })
              .catch(() => {
                this.isLoading = false;
              });
          })
          .catch(() => {
            this.password = "";
            this.isLoading = false;
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
