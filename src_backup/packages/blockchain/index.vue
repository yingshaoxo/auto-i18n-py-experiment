<template>
  <view class="pages">
    <header-info
      :type="pageType"
      :symbol="info.symbol"
      :balance="info.balance"
      :money_text="info.money_text"
      :updating="updating"
      @update="onUpdating"
    />
    <eos-resource-group v-if="showEosResource" :info="info" />
    <tab-chart-group :type="pageType" :publicLink="info.publicLink" />
    <foot-btn-group :type="pageType" :info="info" />
  </view>
</template>

<script>
import blockchain from "./mixin";
import headerInfo from "./component/index/header-info";
import tabChartGroup from "./component/index/tab-chart-group";
import eosResourceGroup from "./component/eos-resource-group";
import footBtnGroup from "./component/index/foot-btn-group";
export default {
  name: "packages-blockchain-index",
  data() {
    return {
      info: {},
      showEosResource: false,
      updating: false
    };
  },
  mixins: [blockchain],
  onLoad(query) {},
  methods: {
    blockchainBaseDataCall(data) {
      this.info = data;
      if (this.pageType == "eos") {
        this.showEosResource = true;
      }
    },
    onUpdating() {
      this.updating = true;
      this.getBiInfo({ symbol: this.symbol }).then(() => {
        this.updating = false;
      });
    }
  },
  components: {
    headerInfo,
    eosResourceGroup,
    tabChartGroup,
    footBtnGroup
  }
};
</script>

<style lang="scss" scoped>
.charts {
  height: 500rpx;
  background-color: #ffffff;
}
</style>
