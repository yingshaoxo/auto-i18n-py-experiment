<template>
  <view>
    <result-state
      v-if="applyStateInfo && pageType == 1"
      :state="applyStateInfo.state"
      :message="applyStateInfo.message"
    >
      <view
        slot="footer"
        v-if="applyStateData.code == 4 || applyStateData.code == 5"
      >
        <view class="copyLink" v-if="applyStateData.code == 4" @click="onCopy">
          {{ applyStateData.data ? applyStateData.data.url : "" }}
        </view>
        <view v-if="applyStateData.code == 5">
          <lk-button block round type="danger" theme-color @click="anewApply">
            重新申請
          </lk-button>
        </view>
      </view>
    </result-state>
    <infoGroup
      v-if="pageType == 2"
      :bannerUrl="data.apply_pic"
      @onApply="onApply"
    />
    <formGroup
      v-if="pageType == 3"
      :protocolData="data"
      :loading="loading"
      @onSubmit="onSubmit"
    />
  </view>
</template>
<script>
import {
  GET_SUPPLIERRESULT,
  GET_SUPPLIERPROTOCOL,
  SET_SUPPLIERAPPLY
} from "@/common/interface/supplier";
import resultState from "./component/result-state";
import infoGroup from "./component/info-group";
import formGroup from "./component/form-group";
import { isEmpty } from "@/common/utils";
import $System from "@/api/system";
export default {
  name: "packages-supplier-apply",
  data() {
    return {
      data: {},
      pageType: 1, // 1返回審核狀態 2初次申請 3申請表單
      code: 4,
      loading: false,
      applyStateData: {}
    };
  },

  components: {
    resultState,
    infoGroup,
    formGroup
  },
  props: {},
  computed: {
    applyStateInfo() {
      const state = this.applyStateData.code;
      let obj = {};
      switch (state) {
        case 2:
          obj.state = "wait";
          obj.message = this.applyStateData.message
            ? this.applyStateData.message
            : "申請提交成功，請耐心等待商城審核。";
          break;
        case 3:
          obj.state = "info";
          obj.message = this.applyStateData.message
            ? this.applyStateData.message
            : "平臺已關閉";
          break;
        case 4:
          obj.state = "success";
          obj.message = this.applyStateData.message
            ? this.applyStateData.message
            : "已通過審核。";
          break;
        case 5:
          obj.state = "error";
          obj.message = this.applyStateData.message
            ? this.applyStateData.message
            : "商城拒絕你成為供應商，請聯繫客服或重新提交申請。";
          break;
      }
      return isEmpty(obj) ? false : obj;
    }
  },
  onLoad() {
    this.getDate();
  },
  methods: {
    getDate() {
      const $this = this;

      GET_SUPPLIERRESULT().then(res => {
        // code:1 還沒申請供應商
        if (res.code == 1) {
          GET_SUPPLIERPROTOCOL().then(({ data }) => {
            if (data) {
              this.data = data;
              this.pageType = 2;
            }
          });
        } else {
          this.applyStateData = res ? res : {};
        }
      });
    },
    onApply() {
      this.pageType = 3;
    },
    onSubmit(e) {
      const $this = this;
      $this.loading = true;
      SET_SUPPLIERAPPLY(e)
        .then(res => {
          $this.$Prompt.toast(res.message);
          setTimeout(() => {
            $this.loading = false;
            $this.$Navigate.replace("/pages/member/index");
          }, 500);
        })
        .catch(err => {
          $this.loading = false;
          $this.$Prompt.toast("提交失敗");
        });
    },
    anewApply() {
      GET_SUPPLIERPROTOCOL().then(({ data }) => {
        if (data) {
          this.data = data;
          this.pageType = 3;
        }
      });
    },
    onCopy() {
      $System.setClipboardData(this.applyStateData.data.url);
    }
  }
};
</script>
<style scoped lang="scss">
.copyLink {
  margin: 20rpx auto;
  width: 600rpx;
  background: #e4e4e4;
  padding: 20rpx;
  border-radius: 6rpx;
  text-align: center;
}
</style>
