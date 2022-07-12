<template>
  <view>
    <lk-cell
      title="銀行卡"
      field
      required
      :value="bankName"
      is-link
      @click="click"
    />
    <lk-popup
      v-model="isShow"
      position="bottom"
      title="選擇銀行"
      round
      closeable
    >
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        nav-per-view="2"
        slot-title
        @change="onTabChange"
      >
        <lk-tab v-for="(tab, index) in tabs" :key="index">
          <text>{{ tab.name }}</text>
        </lk-tab>
      </lk-tabs>
      <view class="cell-group">
        <lk-cell
          v-for="(item, index) in bankList"
          :key="index"
          clickable
          :icon="item.bank_iocn"
          icon-size="40"
          :title="item.bank_short_name"
          :label="item.labelText"
          @click="select(item)"
        />
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { GET_BANKLIST } from "@/common/interface/property";
export default {
  data() {
    return {
      isShow: false,
      bankType: "deposit",
      bankName: "请選擇銀行",
      tabs: [
        {
          name: "儲蓄卡",
          type: "deposit"
        },
        {
          name: "信用卡",
          type: "credit"
        }
      ],
      bankList: []
    };
  },
  methods: {
    click() {
      if (!this.bankList.length) {
        GET_BANKLIST({}, { loadingText: "加載中" }).then(({ data }) => {
          this.bankList = data || [];
          this.bankList.forEach(e => {
            e.labelText = this.labelText(e);
          });
          this.isShow = true;
        });
      } else {
        this.isShow = true;
      }
    },
    onTabChange(e) {
      this.bankType = this.tabs[e].type;
    },
    labelText(item) {
      const onceText =
        item[this.bankType + "_once"] == "-"
          ? "不限"
          : "¥ " + item[this.bankType + "_once"];
      const dayText =
        item[this.bankType + "_day"] == "-"
          ? "不限"
          : "¥ " + item[this.bankType + "_day"];
      return `單筆限額：${onceText}，當日限額：${dayText}`;
    },
    select(item) {
      this.isShow = false;
      this.bankName = `${item.bank_short_name} (${
        this.bankType == "deposit" ? "儲蓄卡" : "信用卡"
      })`;
      item.bank_type = this.bankType == "deposit" ? "00" : "02";
      this.$emit("select", item);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  width: 100%;
  height: 65vh;
  overflow-y: auto;
}
</style>
