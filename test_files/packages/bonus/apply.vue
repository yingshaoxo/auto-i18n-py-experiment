<template>
  <page-meta>
    <navigation-bar front-color="#000000" background-color="#FFFFFF" :title="pageStyle.title" />
  </page-meta>
  <view class="pages">
    <view class="banner" v-if="banner">
      <image :src="banner" mode="widthFix" />
    </view>
    <result-state :state="applyStateInfo.state" :message="applyStateInfo.message" v-if="applyStateInfo" />
    <view class="cell-group" v-if="isAgent != 1 && pageType != 3">
      <apply-form-group v-if="pageType == 1" :form-list="formList" :params="params" :loading="isLoading"
        :agent-type="agentType" @submit="onApply">
        <block v-if="agentType == 2">
          <lk-cell-picker-group v-model="agentLevelActive" label="代理級別" placeholder="请选择代理級別"
            :columns="agentLevelColums" @confirm="onAgentLevel" />
          <lk-cell-picker-group label="代理區域" placeholder="请选择代理區域" :area-type="areaType" mode="region"
            :disabled="areaType == -1" @disabled="areaDisabled" @confirm="onAreaConfirm" />
        </block>
      </apply-form-group>
      <apply-condition-info v-else-if="pageType == 2" :title="satisfyConditionText" :items="conditionInfo" />
    </view>
    <view class="protocol" v-if="pageType == 2">
      <view class="divider">
        <text>{{ protocolText }}</text>
      </view>
      <view class="content">
        <lk-parser show-with-animation lazy-load :html="protocol"></lk-parser>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { GET_APPLYAGENTINFO, APPLY_AGENT } from "@/common/interface/bonus";
import { isEmpty } from "@/common/utils";
import resultState from "./component/apply/result-state";
import applyFormGroup from "./component/apply/form-group";
import applyConditionInfo from "./component/apply/condition-info";
import bonusMixin from "@/mixins/bonus";
export default {
  name: "packages-bonus-apply",
  data () {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      /**
       * 申請類型
       * 1==> 全球代理
       * 2==> 區域代理
       * 3==> 團隊代理
       */
      agentType: null,

      agentLevelActive: -1,

      banner: null,
      protocol: null,

      isAgent: null,
      condition: {},

      agentLevelColums: [
        {
          name: "省級代理",
          type: 1
        },
        {
          name: "市級代理",
          type: 2
        },
        {
          name: "區級代理",
          type: 3
        }
      ],

      params: {
        real_name: null,
        user_tel: null
      },

      formList: [],

      areaInfo: {},
      areaType: -1, //區域代理級別

      isLoading: false,

      isReplenishInfo: false
    };
  },
  mixins: [bonusMixin],
  computed: {
    ...mapState({
      texts: ({ bonus }) => bonus.texts,
      distributeText: ({ distribute }) => distribute.texts
    }),
    /**
     * 申請情況頁面類型
     * 1 ==> 提交表單形式
     * 2 ==> 顯示條件形式
     * 3 ==> 拒絕申請形式
     */
    pageType () {
      const agentType = this.agentType;
      const isAgent = this.isAgent;
      const state = this.condition.agent_condition;
      let type = 0;
      if (agentType == 2) {
        type = this.condition.areaagent_status == 2 ? 3 : 1;
      } else {
        if (state == -1 || isAgent == 3) {
          type = 1;
        } else if (state == 1 || state == 2) {
          type = 2;
        }
        // 完善資料 需要提交表單
        if (this.isReplenishInfo) {
          type = 1;
        }
      }
      // console.log(type);
      return type;
    },
    navbarTitle () {
      const { area, global, team } = this.texts;
      let title = "";
      if (this.agentType == 1) title = global.apply_global;
      if (this.agentType == 2) title = area.apply_area;
      if (this.agentType == 3) title = team.apply_team;
      return title;
    },
    applyStateInfo () {
      let obj = {};
      let state = this.condition.areaagent_status == 2 ? -2 : this.isAgent;
      if (this.agentType != 2 && this.isReplenishInfo) {
        state = 0;
      }
      switch (state) {
        case 1:
          obj.state = "wait";
          obj.message = "申請提交成功，請耐心等待商城審核。";
          break;
        case 2:
          obj.state = "success";
          obj.message = "已通過審核。";
          break;
        case 3:
          obj.state = "info";
          obj.message = "滿足條件，请完善資料。";
          break;
        case -1:
          obj.state = "error";
          obj.message = "商城拒絕你成為代理商，請聯繫客服或重新提交申請。";
          break;
        case -2:
          obj.state = "warn";
          obj.message = "不能在線申請，請聯繫商城相關人員。";
          break;
      }
      return isEmpty(obj) ? false : obj;
    },
    satisfyConditionText () {
      const condition = this.condition.agent_condition;
      return condition == 1
        ? "滿足以下條件自動成為代理商"
        : "滿足其中一個條件即可成為代理商";
    },
    conditionInfo () {
      const $this = this;
      const condition = $this.condition.agent_condition;
      const conditionsArr = $this.condition.agent_conditions
        ? String($this.condition.agent_conditions).split(",")
        : [];
      let infoArr = [];
      if (condition == 1 || condition == 2) {
        conditionsArr.forEach((e, i) => {
          if (e == "1") {
            infoArr.push({
              index: i + 1 + ".",
              text: "自購訂單金額滿",
              money: $this.condition.pay_money,
              unit: "元"
            });
          }
          if (e == "2") {
            infoArr.push({
              index: i + 1 + ".",
              text: "下級" + this.distributeText.distributor_name + "滿",
              money: $this.condition.number,
              unit: "人"
            });
          }
          if (e == "3") {
            infoArr.push({
              index: i + 1 + ".",
              text: "一級" + this.distributeText.distributor_name + "滿",
              money: $this.condition.one_number,
              unit: "人"
            });
          }
          if (e == "4") {
            infoArr.push({
              index: i + 1 + ".",
              text: "二級" + this.distributeText.distributor_name + "滿",
              money: $this.condition.two_number,
              unit: "人"
            });
          }
          if (e == "5") {
            infoArr.push({
              index: i + 1 + ".",
              text: "三級" + this.distributeText.distributor_name + "滿",
              money: $this.condition.three_number,
              unit: "人"
            });
          }
          if (e == "6") {
            infoArr.push({
              index: i + 1 + ".",
              text: "下級訂單滿",
              money: $this.condition.order_money,
              unit: "元"
            });
          }
          if (e == "11") {
            infoArr.push({
              index: i + 1 + ".",
              text: "团队訂單金额滿",
              money: $this.condition.up_team_money,
              unit: "元"
            });
          }
          if (e == "7") {
            infoArr.push({
              index: i + 1 + ".",
              text: "購買指定商品",
              link:
                "/packages/goods/screen?goods_ids=" + $this.condition.goods_id,
              linkText: "去購買"
            });
          }
        });
      }
      return infoArr;
    },
    isForm () {
      return !isEmpty(this.formList);
    },
    protocolText () {
      const { area, global, team } = this.texts;
      let text = "";
      if (this.agentType == 1) text = global.global_agreement;
      if (this.agentType == 2) text = area.area_agreement;
      if (this.agentType == 3) text = team.team_agreement;
      return text + "協議";
    }
  },
  onLoad (query) {
    this.agentType = query.type;
    this.isReplenishInfo = query.hash === "replenish";
    this.getMemberInfo().then(info => {
      if (info.isdistributor == 2) {
        this.agentType && this.getData();
      } else {
        this.$Prompt
          .toast("請先成為" + this.distributeText.distributor_name)
          .then(() => {
            this.$Navigate.replace("/pages/member/index");
          });
      }
    });
  },
  methods: {
    ...mapActions(["getMemberInfo"]),
    getData () {
      const $this = this;
      GET_APPLYAGENTINFO({ type: $this.agentType })
        .then(({ data }) => {
          if ($this.agentType == 1) {
            // 申請全球代理
            $this.banner = data.global_bonus_agreement.logo;
            $this.protocol = data.global_bonus_agreement.content;
            $this.condition = data.global_bonus;
            $this.condition.agent_condition =
              data.global_bonus.globalagent_condition;
            $this.condition.agent_conditions =
              data.global_bonus.globalagent_conditions;
            $this.isAgent = data.is_global_agent;
            // 股東申請自定義表單
            $this.formList = !isEmpty(data.global_bonus_agreement.customform)
              ? data.global_bonus_agreement.customform
              : [];
          } else if ($this.agentType == 2) {
            // 申请區域代理
            $this.banner = data.area_bonus_agreement.logo;
            $this.protocol = data.area_bonus_agreement.content;
            $this.condition = data.area_bonus;
            $this.isAgent = data.is_area_agent;
            // 區域代理申请自定义表单
            $this.formList = !isEmpty(data.area_bonus_agreement.customform)
              ? data.area_bonus_agreement.customform
              : [];
          } else if ($this.agentType == 3) {
            // 申请團隊代理
            $this.banner = data.team_bonus_agreement.logo;
            $this.protocol = data.team_bonus_agreement.content;
            $this.condition = data.team_bonus;
            $this.condition.agent_condition =
              data.team_bonus.teamagent_condition;
            $this.condition.agent_conditions =
              data.team_bonus.teamagent_conditions;
            $this.isAgent = data.is_team_agent;
            // 團隊申請自定義表單
            $this.formList = !isEmpty(data.team_bonus_agreement.customform)
              ? data.team_bonus_agreement.customform
              : [];
          }
          $this.params.real_name = data.real_name;
          $this.params.user_tel = data.user_tel;
          $this.pageStyle.title = $this.navbarTitle;
          if (!$this.isReplenishInfo && $this.isAgent == 2) {
            $this.$Navigate.replace("/pages/bonus/index");
          }
        })
        .catch(() => { });
    },
    areaDisabled () {
      this.$Prompt.toast("请先选择代理級別！");
    },
    onAgentLevel (index) {
      const type = this.agentLevelColums[index].type;
      this.params.area_id = type;
      this.areaType = type;
      this.params.province_id = "";
      this.params.city_id = "";
      this.params.district_id = "";
      this.areaInfo = {};
    },
    onAreaConfirm (data) {
      this.areaInfo = data;
    },
    // 提交申請
    onApply (params) {
      const $this = this;
      if (!$this.isForm && $this.agentType == 2) {
        if (!$this.params.area_id) {
          $this.$Prompt.toast("請選擇代理等級！");
          return false;
        }
        if (isEmpty($this.areaInfo)) {
          $this.$Prompt.toast("请选择代理區域！");
          return false;
        }
        if ($this.params.area_id == 1) {
          $this.params.province_id = $this.areaInfo.item[0].id;
        }
        if ($this.params.area_id == 2) {
          $this.params.province_id = $this.areaInfo.item[0].id;
          $this.params.city_id = $this.areaInfo.item[1].id;
        }
        if ($this.params.area_id == 3) {
          $this.params.province_id = $this.areaInfo.item[0].id;
          $this.params.city_id = $this.areaInfo.item[1].id;
          $this.params.district_id = $this.areaInfo.item[2].id;
        }
        params = $this.params;
      }
      this.isLoading = true;
      // return console.log(params);
      APPLY_AGENT(params, { agentType: $this.agentType })
        .then(({ message }) => {
          $this.$Prompt
            .toast({ title: "提交成功", icon: "success" })
            .then(() => {
              this.$Navigate.replace("/pages/member/index");
            });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    resultState,
    applyFormGroup,
    applyConditionInfo
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 160rpx;
}

.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;

  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.cell-group {
  background: #fff;
  margin: 20rpx 0;
}

.protocol {
  background: #ffffff;
  overflow: hidden;

  .content {
    padding: 30rpx;
  }
}
</style>
