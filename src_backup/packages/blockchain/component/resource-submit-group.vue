<template>
  <view class="box">
    <view class="cell-group">
      <lk-field
        label="CPU"
        type="number"
        :placeholder="'最多可' + typeText + maxNum[type].cpu + 'EOS'"
        @input="keydownCpu"
        v-model="params.cpu"
      />
      <lk-field
        label="NET"
        type="number"
        :placeholder="'最多可' + typeText + maxNum[type].net + 'EOS'"
        @input="keydownNet"
        v-model="params.net"
      />
    </view>
    <view class="foot-btn-group">
      <lk-button round theme-color block :loading="isLoading" @click="onSubmit">
        {{ typeText }}
      </lk-button>
    </view>
    <view class="note">
      <view class="title">注意：</view>
      <view class="text" v-for="(item, index) in note[type]" :key="index">
        {{ item }}
      </view>
    </view>
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      @confirm="onPayPassword"
      @cancel="isLoading = false"
    />
  </view>
</template>

<script>
import { SUB_BLOCKCHAINRESOURCE } from "@/common/interface/blockchain";
import mixinPayPassword from "@/mixins/valid-pay-password";
import { yuan, bi, handleInput } from "@/common/utils";
export default {
  data() {
    return {
      params: {
        password: ""
      },
      note: {
        mortgage: [
          "- 使用EOS錢包產生的任何交易都會占用CPU龢NET。",
          "- 所占用的資源一般都在24小時後釋放返還。",
          "- 你可以在任何時候贖回自己的抵押的資源。"
        ],
        redeem: [
          "- 僅能贖回自己抵押的資源。",
          "- 僅能贖回當前未占用的資源。",
          "- 當前未占用的資源需要等到24小時後才能贖回。"
        ]
      },

      isLoading: false
    };
  },
  props: {
    type: String,
    info: Object
  },
  mixins: [mixinPayPassword],
  computed: {
    typeText() {
      this.params = {};
      if (this.type == "mortgage") return "抵押";
      if (this.type == "redeem") return "贖回";
    },
    maxNum() {
      let obj = {
        mortgage: {
          cpu: 0,
          net: 0
        },
        redeem: {
          cpu: 0,
          net: 0
        }
      };
      if (this.type == "mortgage") {
        obj.mortgage.cpu = bi(this.info.balance || 0);
        obj.mortgage.net = bi(this.info.balance || 0);
      }
      if (this.type == "redeem") {
        obj.redeem.cpu = bi(this.info.cpuPrices || 0);
        obj.redeem.net = bi(this.info.netPrices || 0);
      }
      return obj;
    }
  },
  methods: {
    keydownCpu(e) {
      this.params.cpu = handleInput(e);
    },
    keydownNet(e) {
      this.params.net = handleInput(e);
    },
    // 驗證密碼
    onPayPassword(password) {
      this.params.password = password;
      this.onSubmit();
    },
    validator(type) {
      const params = this.params;
      const maxCpuNum = parseFloat(this.maxNum[type].cpu);
      const maxNetNum = parseFloat(this.maxNum[type].net);
      if (!parseFloat(params.cpu) && !parseFloat(params.net)) {
        this.$Prompt.toast("請輸入CPU或NET" + this.typeText + "的EOS！");
        return false;
      }
      if (params.cpu && parseFloat(params.cpu) > maxCpuNum) {
        this.$Prompt.toast("CPU最多可" + this.typeText + maxCpuNum + "EOS！");
        return false;
      }
      if (params.net && parseFloat(params.net) > maxNetNum) {
        this.$Prompt.toast("NET最多可" + this.typeText + maxNetNum + "EOS！");
        return false;
      }
      params.cpu = params.cpu ? bi(params.cpu) : "";
      params.net = params.net ? bi(params.net) : "";
      return params;
    },
    onSubmit() {
      const params = this.validator(this.type);
      // return console.log(params);
      if (params) {
        this.isLoading = true;
        this.validPayPassword(params.password, true)
          .then(() => {
            SUB_BLOCKCHAINRESOURCE(params, {
              type: this.type,
              typeText: this.typeText
            })
              .then(({ message }) => {
                this.$Prompt
                  .toast({ title: message, icon: "success" })
                  .then(() => {
                    this.$Navigate
                      .replace("/packages/blockchain/index?type=eos")
                      .then(() => {
                        this.isLoading = false;
                      });
                  });
              })
              .catch(() => {
                this.isLoading = false;
              });
          })
          .catch(() => {
            this.isLoading = false;
            this.params.password = "";
          });
      }
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.box {
  background-color: #fff;
  padding-top: 20rpx;
}

.note {
  background-color: #fff;
  padding: $cell-padding;
  color: $text-light;
  font-size: $font-size-sm;
  line-height: 1.6;
}
</style>
