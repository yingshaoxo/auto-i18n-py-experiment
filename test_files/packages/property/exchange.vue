<template>
  <view class="pages">
    <view>
      <lk-cell :title="pageTypeText + '類型'" field>
        <lk-radio-group
          v-model="params.types"
          :active-color="theme.color"
          @change="change"
        >
          <lk-radio :name="1">{{ paramText["1"].type }}</lk-radio>
          <lk-radio :name="2">{{ paramText["2"].type }}</lk-radio>
        </lk-radio-group>
      </lk-cell>
      <lk-cell :title="paramText[params.types].usable" field>
        <view
          class="price-color"
          :class="params.types == 1 ? 'first-letter' : ''"
        >
          {{ paramText[params.types].number }}
        </view>
      </lk-cell>
      <lk-field
        :label="paramText[params.types].input"
        :type="params.types == 1 ? 'digit' : 'number'"
        :placeholder="paramText[params.types].inputPlaceholder"
        v-model="params.money"
        @input="onInput"
        clearable
      />
      <lk-field
        :label="paramText[params.types].output"
        disabled
        :value="countExchange"
      />
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      :type="feeType"
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
        @click="onExchange"
      >
        {{ pageTypeText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import { EXCHANGE_BALANCEPOINT } from "@/common/interface/property";
import { validMobile } from "@/common/utils/validator";
import { mapState, mapActions } from "vuex";
import { yuan } from "@/common/utils";
import mixinPayPassword from "@/mixins/valid-pay-password";
export default {
  name: "packages-property-exchange",
  data() {
    return {
      params: {
        types: 1,
        money: null
      },
      isLoading: false,
      pageTypeText: "兌換"
    };
  },
  mixins: [mixinPayPassword],
  computed: {
    ...mapState({
      config: ({ config }) => config,
      memberInfo: ({ member }) => member.info,
      memberTexts: ({ member }) => member.texts
    }),
    feeType() {
      let type = null;
      if (this.params.types == 1) {
        type = 4;
      } else if (this.params.types == 2) {
        type = 5;
      }
      return type;
    },
    isDisabled() {
      return !this.paramText[this.params.types].money;
    },
    paramText() {
      return {
        1: {
          type:
            this.memberTexts.balance_style +
            "換" +
            this.memberTexts.point_style,
          usable: "可用" + this.memberTexts.balance_style,
          money: parseFloat(this.memberInfo.balance),
          number: yuan(this.memberInfo.balance),
          input: this.memberTexts.balance_style,
          inputPlaceholder:
            "請輸入" +
            this.pageTypeText +
            "的" +
            this.memberTexts.balance_style,
          output: this.memberTexts.point_style
        },
        2: {
          type:
            this.memberTexts.point_style +
            "換" +
            this.memberTexts.balance_style,
          usable: "可用" + this.memberTexts.point_style,
          money: parseInt(this.memberInfo.point),
          number: parseInt(this.memberInfo.point),
          input: this.memberTexts.point_style,
          inputPlaceholder:
            "請輸入" + this.pageTypeText + "的" + this.memberTexts.point_style,
          output: this.memberTexts.balance_style
        }
      };
    },
    countExchange() {
      const rate = parseFloat(this.config.convert_rate) || 1; //兌換比例
      let num = null;
      let { types, money } = this.params;
      if (money > 0) {
        if (types == 1) {
          num = Math.floor(money * rate);
        } else {
          num = (money / rate).toFixed(2);
        }
      }
      return num;
    }
  },
  onLoad(query) {},
  methods: {
    ...mapActions(["setSubscribe"]),
    change(e) {
      this.params.money = null;
    },
    onInput(e) {
      let money = this.paramText[this.params.types].money;
      let value = parseFloat(e);
      value && value > money && (this.params.money = money);
    },
    onPayPassword(e) {
      this.password = e;
      this.onExchange();
    },
    onExchange() {
      if (!this.params.money || this.params.money < 0) {
        return this.$Prompt.toast(
          this.paramText[this.params.types].inputPlaceholder
        );
      }
      this.isLoading = true;
      this.validPayPassword(this.password).then(() => {
        EXCHANGE_BALANCEPOINT(this.params)
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
