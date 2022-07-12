<template>
  <view class="sku-btn-actions">
    <!-- #ifdef H5 -->
    <component
      :is="promoteComponentName"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <!--  #endif -->
    <!-- #ifndef H5 -->
    <action-btn-normal
      v-if="promoteComponentName === 'action-btn-normal'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-presell
      v-if="promoteComponentName === 'action-btn-presell'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-seckill
      v-if="promoteComponentName === 'action-btn-seckill'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-group
      v-if="promoteComponentName === 'action-btn-group'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-bargain
      v-if="promoteComponentName === 'action-btn-bargain'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-limit
      v-if="promoteComponentName === 'action-btn-limit'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-disabled
      v-if="promoteComponentName === 'action-btn-disabled'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-study
      v-if="promoteComponentName === 'action-btn-study'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <action-btn-luckyspell
      v-if="promoteComponentName === 'action-btn-luckyspell'"
      :info="info"
      :params="promoteParams"
      :action="action"
      :direct-click="directClick"
      @click="click"
    />
    <!--  #endif -->
  </view>
</template>

<script>
import actionBtnNormal from "./action-btn-normal";
import actionBtnPresell from "./action-btn-presell";
import actionBtnSeckill from "./action-btn-seckill";
import actionBtnGroup from "./action-btn-group";
import actionBtnBargain from "./action-btn-bargain";
import actionBtnLimit from "./action-btn-limit";
import actionBtnDisabled from "./action-btn-disabled";
import actionBtnStudy from "./action-btn-study";
import actionBtnLuckyspell from "./action-btn-luckyspell";
export default {
  data() {
    return {};
  },
  props: {
    /**
     * 活動類型
     * normal    =>    普通商品類型(默認)
     * seckill   =>    秒殺商品類型
     * group     =>    拼團商品類型
     * presell   =>    預售商品類型
     * bargain   =>    砍價商品類型
     * limit     =>    限時商品類型
     * luckyspell     =>    幸運拼團
     */
    promoteType: {
      type: String,
      default: "normal"
    },
    // 活動相關參數
    promoteParams: Object,
    // 商品基本信息
    info: Object,
    /**
     * 單個行動按鈕(為空則默認)
     * 傳入指定類型，如  addCart/buy/group...
     * 只顯示單個確定按鈕
     */
    action: String,
    /**
     * 直接點擊按鈕,不驗證規格
     */
    directClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    promoteComponentName() {
      let name = this.promoteType;
      if (
        name != "bargain" &&
        this.info.goodsState != 1 &&
        this.info.goodsStateText
      ) {
        name = "disabled";
      }
      if (this.info.isPaid) {
        name = "study";
      }
      return "action-btn-" + name;
    }
  },
  methods: {
    click(action, params = {}) {
      let info = Object.assign({ ...params }, this.info);
      if (!this.directClick && !info.selectedSkuComb) {
        return this.$Prompt.toast("請先選擇規格");
      }
      this.$emit("action", action, info);
    }
  },
  components: {
    actionBtnNormal,
    actionBtnPresell,
    actionBtnSeckill,
    actionBtnGroup,
    actionBtnBargain,
    actionBtnLimit,
    actionBtnDisabled,
    actionBtnStudy,
    actionBtnLuckyspell
  }
};
</script>

<style scoped lang="scss">
.sku-btn-actions {
  width: 100%;
  flex: 1;
}
</style>
