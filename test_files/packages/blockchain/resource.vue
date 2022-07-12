<template>
  <view class="pages">
    <resource-progress-group :info="info" />
    <lk-tabs theme-color slot-title nav-per-view="2" @change="onTab">
      <lk-tab v-for="(tab, index) in tabs" :key="index">
        {{ tab.name }}
      </lk-tab>
    </lk-tabs>
    <resource-submit-group :type="subimtType" :info="info" />
  </view>
</template>

<script>
import resourceProgressGroup from "./component/resource-progress-group";
import resourceSubmitGroup from "./component/resource-submit-group";
import blockchain from "./mixin";
export default {
  name: "packages-blockchain-resource",
  data() {
    return {
      active: 0,
      tabs: [
        { name: "抵押資源", type: "mortgage" },
        { name: "贖回資源", type: "redeem" }
      ],
      info: {},
      subimtType: "mortgage"
    };
  },
  mixins: [blockchain],
  onLoad(query) {
    this.pageType = "eos";
  },
  methods: {
    blockchainBaseDataCall(data) {
      this.info = data;
    },
    onTab(e) {
      this.subimtType = this.tabs[e].type;
    }
  },
  components: {
    resourceProgressGroup,
    resourceSubmitGroup
  }
};
</script>

<style lang="scss" scoped></style>
