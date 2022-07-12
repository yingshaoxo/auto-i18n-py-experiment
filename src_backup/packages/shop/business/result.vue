<template>
  <view class="pages">
    <result-state :state="stateInfo.state" :message="stateInfo.message" />
    <view class="foot-btn-group" v-if="stateInfo.state == 'error'">
      <lk-button
        round
        block
        type="danger"
        :color="theme.gradient"
        :to='`/packages/shop/business/apply?referee_uid=${referee_uid}`'
      >
        重新申請
      </lk-button>
    </view>
    <view class="flex-auto-center" v-if="stateInfo.state == 'success'">
      <lk-field input-align="center" :value="stateInfo.url" disabled />
    </view>
  </view>
</template>

<script>
import {
  GET_SHOPAPPLYSTATE,
  GET_SHOPAPPLYPROTOCOL
} from "@/common/interface/shop";
import resultState from "../component/result-state";
export default {
  name: "packages-shop-business-result",
  data() {
    return {
      referee_uid:'',
      stateInfo: {
        state: "",
        message: "",
        url: ""
      }
    };
  },
  onLoad(query) {
    this.referee_uid=query.referee_uid?query.referee_uid:''
    GET_SHOPAPPLYSTATE()
      .then(({ data }) => {
        const { status, url } = data;
        let info = {};
        if (status == "apply") {
          return this.$Navigate.replace("/packages/shop/business/index");
        }
        if (status == "is_system") {
          info.state = "success";
          info.message =
            "您已是店鋪賣家，請用電腦瀏攬器訪問賣家後臺管理你的店鋪";
          info.url = url;
        }
        if (status == "refuse_apply") {
          info.state = "error";
          info.message = "商家拒絕了您的入駐申請";
        }
        if (status == "is_apply") {
          info.state = "wait";
          info.message = "店鋪入駐審核中";
        }
        this.stateInfo = info;
      })
      .catch(() => {});
  },
  methods: {},
  components: {
    resultState
  }
};
</script>

<style lang="scss" scoped></style>
