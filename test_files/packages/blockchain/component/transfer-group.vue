<template>
  <view>
    <view class="cell-group">
      <lk-cell :title="'可用' + typeToUpperCase" field>
        <text class="text-red">{{ info.balance }}</text>
      </lk-cell>
      <lk-field
        label="收款地址"
        placeholder="請輸入收款人錢包地址"
        clearable
        v-model="params.toAddress"
        type="textarea"
        rows="1"
        right-icon="qr"
        @blur="blur"
        @click-right-icon="scanQR"
      />
      <lk-field
        :label="'轉賬' + typeToUpperCase"
        type="number"
        :placeholder="'请输入轉賬的' + typeToUpperCase"
        @input="keydown"
        v-model="params.num"
      />
      <lk-field
        label="備注"
        type="textarea"
        rows="1"
        clearable
        v-model="params.memo"
        placeholder="選填"
        @blur="memoBlur"
      />
    </view>
    <slot />
  </view>
</template>

<script>
import { handleInput } from "@/common/utils";
import { mapState } from "vuex";
import $System from "@/api/system";
export default {
  data() {
    return {
      params: {
        memo: "",
        num: "",
        toAddress: ""
      }
    };
  },
  props: {
    type: String,
    info: Object
  },
  computed: {
    ...mapState({
      memberText: ({ member }) => member.texts,
      memberInfo: ({ member }) => member.info
    }),
    typeToUpperCase() {
      return this.type.toUpperCase();
    },
    pointText() {
      return this.memberText.point_style;
    }
  },
  methods: {
    keydown(e) {
      let par = {
        num: handleInput(e, this.type == "eos" ? 4 : 6) || ""
      };
      this.$emit("params-change", { ...this.params, num: par.num });
    },
    blur(e) {
      this.$emit("address-change", e);
    },
    scanQR() {
      $System.scanCode().then(({ result }) => {
        this.params.toAddress = result;
        this.$emit("address-change", result);
      });
    },
    memoBlur(e) {
      this.$emit("params-change", { ...this.params, memo: e });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin-bottom: 20rpx;
}
</style>
