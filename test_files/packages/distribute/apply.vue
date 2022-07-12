<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="banner" v-if="banner">
      <image :src="banner" mode="widthFix" />
    </view>
    <result-state
      :state="applyStateInfo.state"
      :message="applyStateInfo.message"
      v-if="applyStateInfo"
    />
    <view class="cell-group" v-if="isdistributor != 1">
      <apply-form-group
        v-if="pageType == 1"
        :form-list="formList"
        :params="params"
        :condition-state="conditionState"
        :loading="isLoading"
        @submit="onApply"
      />
      <apply-condition-info
        v-else-if="pageType == 2"
        :title="satisfyConditionText"
        :items="conditionInfo"
      />
      <apply-submit-group
        v-else-if="pageType == 3"
        :loading="isLoading"
        :btn-text="'成為' + texts.distributor_name"
        @submit="onApply"
      />
    </view>
    <view class="protocol" v-if="pageType == 2">
      <view class="divider">
        <text>{{ texts.distributor_name }}協議</text>
      </view>
      <view class="content">
        <lk-parser
          show-with-animation
          lazy-load
          :html="texts.content"
        ></lk-parser>
      </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import {
  GET_APPLYCOMMISSION,
  APPLY_COMMISSION
} from "@/common/interface/distribute";
import { isEmpty } from "@/common/utils";
import resultState from "./component/apply/result-state";
import applyFormGroup from "./component/apply/form-group";
import applyConditionInfo from "./component/apply/condition-info";
import applySubmitGroup from "./component/apply/submit-group";
export default {
  name: "packages-distribute-apply",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      isdistributor: null,
      condition: {},
      params: {
        user_tel: null,
        real_name: null
      },

      formList: [],

      isLoading: false,

      banner: "",

      isReplenishInfo: false //是否完善資料
    };
  },
  computed: {
    ...mapState({
      texts: ({ distribute }) => distribute.texts
    }),
    ...mapGetters(["static"]),
    /**
     * 申請情況頁面類型
     * 1 ==> 提交表單形式
     * 2 ==> 顯示條件形式
     * 3 ==> 直接提交形式
     */
    pageType() {
      const isdistributor = this.isdistributor;
      const state = this.condition.distributor_condition;
      let type = 0;
      if (state == -1 || isdistributor == 3) {
        type = 1;
      } else if (state == 1 || state == 2) {
        type = 2;
      } else if (state == 3) {
        type = 3;
      }
      // 完善資料 需要提交表單
      if (this.isReplenishInfo) {
        type = 1;
      }
      // console.log(type);
      return type;
    },
    // 申請條件狀態
    conditionState() {
      return this.isReplenishInfo ? -1 : this.condition.distributor_condition;
    },
    navbarTitle() {
      let title = this.isReplenishInfo
        ? "完善資料"
        : "申请成為" + this.texts.distributor_name;
      return title;
    },
    applyStateInfo() {
      const state = this.isReplenishInfo ? 0 : this.isdistributor;
      let obj = {};
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
          obj.message =
            "商城拒绝你成為" +
            this.texts.distributor_name +
            "，請聯繫客服或重新提交申請。";
          break;
      }
      return isEmpty(obj) ? false : obj;
    },
    satisfyConditionText() {
      const condition = this.condition.distributor_condition;
      return condition == 1
        ? "满足以下条件自动成為" + this.texts.distributor_name + ""
        : "满足其中一个条件即可成為" + this.texts.distributor_name;
    },
    conditionInfo() {
      const $this = this;
      const condition = $this.condition.distributor_condition;
      const conditionsArr = $this.condition.distributor_conditions
        ? String($this.condition.distributor_conditions).split(",")
        : [];
      let infoArr = [];
      if (condition == 1 || condition == 2) {
        conditionsArr.forEach((e, i) => {
          if (e == "2") {
            infoArr.push({
              index: i + 1 + ".",
              text: "訂單消費達到",
              money: $this.condition.pay_money,
              unit: "元"
            });
          }
          if (e == "3") {
            infoArr.push({
              index: i + 1 + ".",
              text: "訂單數達到",
              money: $this.condition.order_number,
              unit: "件"
            });
          }
          if (e == "4") {
            infoArr.push({
              index: i + 1 + ".",
              text: "購買商品，並完成訂單"
            });
          }
          if (e == "5") {
            infoArr.push({
              index: i + 1 + ".",
              text:
                $this.condition.order_status == 1
                  ? "購買指定商品"
                  : "購買商品，並完成付款",
              link:
                "/packages/goods/screen?goods_ids=" + $this.condition.goods_id,
              linkText: "去購買"
            });
          }
        });
      }
      return infoArr;
    }
  },
  onLoad(query) {
    this.isReplenishInfo = query.hash === "replenish";
    this.getData();
  },
  methods: {
    ...mapActions(["getMemberInfo"]),
    getData() {
      GET_APPLYCOMMISSION({}, { isShowLoading: true })
        .then(({ data }) => {
          this.params.real_name = data.real_name;
          this.params.user_tel = data.user_tel;
          this.isdistributor = data.isdistributor;
          this.condition = data.condition;
          this.formList = !isEmpty(data.customform) ? data.customform : [];
          this.pageStyle.title = this.navbarTitle;
          this.banner =
            data.xieyi.logo || this.static.baseImgPath + "apply-banner.png";
          if (!this.isReplenishInfo && this.isdistributor == 2) {
            this.getMemberInfo({ update: true }); // 更新會員數據
            // 已經是分銷商，前往分銷中心
            uni.redirectTo({
              url: "/pages/distribute/index"
            });
          }
        })
        .catch(() => {});
    },
    // 提交申請
    onApply(params) {
      this.isLoading = true;
      // return console.log(this.isReplenishInfo, params);
      APPLY_COMMISSION(params, { isReplenishInfo: this.isReplenishInfo })
        .then(({ message }) => {
          const route =
            this.pageType == 3
              ? "/pages/distribute/index"
              : "/pages/member/index";
          this.getMemberInfo({ update: true }).then(() => {
            this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
              this.$Navigate.replace(route);
            });
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
    applyConditionInfo,
    applySubmitGroup
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
