<template>
  <view>
    <view class="cell-group">
      <!-- <lk-cell title="兌換類型" field>
        <lk-radio-group
          v-model="params.exchange_type"
          :active-color="theme.color"
          @change="exchange"
        >
          <lk-radio :name="1">{{ pointText }}換{{ typeToUpperCase }}</lk-radio>
          <lk-radio :name="2">{{ typeToUpperCase }}換{{ pointText }}</lk-radio>
        </lk-radio-group>
      </lk-cell> -->
      <lk-cell-picker-group
        v-model="active"
        label="兌換類型"
        placeholder="請選擇"
        :columns="typeColumns"
        @confirm="onTypeConfirm"
      />
      <block v-if="params.exchange_type == 1">
        <lk-cell :title="'可用' + pointText" field>
          <text class="text-red">{{ memberInfo.point }}</text>
          <text class="text-secondary"
            >(最低兑換{{ info.lowPoint }}{{ pointText }})</text
          >
        </lk-cell>
        <lk-field
          :label="pointText"
          type="number"
          :placeholder="'请输入兑換的' + pointText"
          v-model="pointNum"
          @input="pointKeydown"
          @blur="countExport"
        />
        <lk-field :label="typeToUpperCase" disabled :value="countExportText" />
      </block>
      <block v-if="params.exchange_type == 2">
        <lk-cell :title="'可用' + typeToUpperCase" field>
          <text class="text-red">{{ info.balance }}</text>
        </lk-cell>
        <lk-field
          :label="typeToUpperCase"
          type="number"
          :placeholder="'请输入兑換的' + typeToUpperCase"
          @input="biKeydown"
          v-model="biNum"
          @blur="countExport"
        />
        <lk-field :label="pointText" disabled :value="countExportText" />
      </block>
      <block v-if="params.exchange_type == 3">
        <lk-cell :title="'可用' + typeToUpperCase" field>
          <text class="text-red">{{ info.balance }}</text>
        </lk-cell>
        <lk-field
          :label="typeToUpperCase"
          type="number"
          :placeholder="'请输入兑換的' + typeToUpperCase"
          @input="biKeydown"
          v-model="biNum"
          @blur="countExport"
        />
        <lk-field :label="'ETH'" disabled :value="countExportText" />
      </block>
    </view>
    <slot />
  </view>
</template>

<script>
import { handleInput, handleInt } from "@/common/utils";
import { COUNT_BLOCKCHAINEXMONEY } from "@/common/interface/blockchain";
import { mapState } from "vuex";
export default {
  data() {
    return {
      active: 0,
      pointNum: "",
      biNum: "",
      countExportNum: "",
      countExportType: 0 // 計算金額狀態
    };
  },
  props: {
    type: String,
    info: Object,
    params: Object,
    poundage: Object
  },
  watch: {
    countExportType(e) {
      this.$emit("count-change", e);
    },
    "params.gas"(e) {
      if (e && this.exportNum) {
        this.changeExport();
      }
    }
  },
  computed: {
    ...mapState({
      memberText: ({ member }) => member.texts,
      memberInfo: ({ member }) => member.info
    }),
    typeColumns() {
      let arr = [
        { name: `${this.pointText}換${this.typeToUpperCase}`, type: 1 },
        { name: `${this.typeToUpperCase}換${this.pointText}`, type: 2 }
      ];
      if (this.info.publicLink == "ETH" && this.info.symbol != "ETH") {
        arr.push({
          name: `${this.typeToUpperCase}換${this.info.publicLink}`,
          type: 3
        });
      }
      return arr;
    },
    typeToUpperCase() {
      return this.type.toUpperCase();
    },
    pointText() {
      return this.memberText.point_style;
    },
    countExportText() {
      let obj = {
        "-1": "計算失敗",
        "0": "--",
        "1": "計算中",
        "2": "" //計算成功
      };
      return this.countExportType == 2
        ? this.countExportNum
        : obj[this.countExportType];
    }
  },
  methods: {
    onTypeConfirm(i) {
      const item = this.typeColumns[i];
      this.countExportType = 0;
      this.$emit("ex-change", item.type);
    },
    exchange(e) {
      this.countExportType = 0;
      this.$emit("ex-change", e);
    },
    slider(e) {
      this.$emit("sd-change", e);
    },
    biKeydown(e) {
      let par = {
        num: handleInput(e, this.type == "eos" ? 4 : 6) || ""
      };
      this.$emit("params-change", { ...par });
    },
    pointKeydown(e) {
      let num = parseInt(e);
      // const point = this.memberInfo.point;
      // if (num < this.info.lowPoint) {
      //   num = this.info.lowPoint;
      // } else if (num > point) {
      //   num = point;
      // }
      let par = {
        num: handleInt(num) || ""
      };
      // this.pointNum = num;
      this.$emit("params-change", { ...par });
    },
    countExport(value) {
      this.exportNum = value;
      this.changeExport();
    },
    changeExport() {
      let params = {};
      params.num = this.exportNum;
      params.symbol = String(this.type).toLocaleUpperCase();
      params.exchange_type = this.params.exchange_type;
      params.gas = this.params.gas;
      if (this.exportNum) {
        this.getExportNum(params);
      } else {
        this.countExportType = 0;
      }
    },
    getExportNum(params) {
      this.countExportType = 1;
      COUNT_BLOCKCHAINEXMONEY(params)
        .then(({ data }) => {
          this.countExportType = 2;
          this.countExportNum = data.number;
          this.$emit("charge-change", {
            // title: this.typeColumns[this.active].name,
            cpu: this.type == "eos" ? `${data.cpucharge || 0}ms` : "",
            net: this.type == "eos" ? `${data.netcharge || 0}kb` : ""
          });
        })
        .catch(() => {
          this.countExportType = -1;
          this.$emit("charge-change", {
            title: this.typeColumns[this.active].name,
            cpu: "",
            net: ""
          });
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin-bottom: 20rpx;
}
.text-secondary {
  font-size: $font-size-sm;
  color: $text-light;
  padding: 0 20rpx;
}
</style>
