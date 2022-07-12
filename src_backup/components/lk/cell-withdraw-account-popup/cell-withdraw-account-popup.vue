<template>
  <view>
    <lk-cell
      title="提現賬戶"
      field
      :value="accountInfo || '请选择提現賬戶'"
      is-link
      @click="onActionSheet"
    />
    <lk-popup
      v-model="isShowSheet"
      title="提現賬戶"
      position="bottom"
      round
      closeable
    >
      <lk-radio-group v-model="accountId" :active-color="theme.color">
        <view class="list">
          <lk-cell-account-item
            v-for="(item, index) in accountList"
            :key="index"
            :title="item.title"
            :image="item.logo ? null : null"
            :label="item.label"
            :clickable="!item.disabled"
            @click="onSelect(item)"
          >
            <lk-radio
              slot="rightIcon"
              :name="item.id"
              :disabled="item.disabled"
            />
          </lk-cell-account-item>
        </view>
      </lk-radio-group>
      <view class="foot-btn-group fixed">
        <lk-button
          block
          round
          type="danger"
          :color="theme.gradient"
          :to="
            '/packages/property/account/post?hash=add&onbackevent=' +
            onbackevent
          "
        >
          新增賬戶
        </lk-button>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { GET_ASSETACCOUNTLIST } from "@/common/interface/property";
import property from "@/mixins/property";
export default {
  data() {
    return {
      onbackevent: "on-back-addbank",
      isShowSheet: false,
      accountInfo: "",
      accountList: [],
    };
  },
  props: {
    accountId: [Number, String],
    withdrawType: {
      type: [Array],
      default: () => [],
    },
  },
  mixins: [property],
  watch: {
    accountId(n, o) {
      if (o == "-1") {
        this.accountInfo = "";
      }
    },
  },
  mounted() {
    uni.$on(this.onbackevent, (data) => {
      if (data) {
        this.getAccountList();
      }
    });
  },
  beforeDestroy() {
    uni.$off(this.onbackevent);
  },
  methods: {
    onActionSheet() {
      if (!this.accountList.length) {
        this.getAccountList();
      } else {
        this.isShowSheet = true;
      }
    },
    getAccountList() {
      GET_ASSETACCOUNTLIST().then(({ code, data }) => {
        const withdrawTypeArr = this.withdrawType; // 根據每個應用設置的提現類型
        let list = this.packageAccountList(data);
        let arr = list;
        // let arr = list.map((e) => {
        //   if (withdrawTypeArr.filter((i) => i == e.type)[0] != e.type) {
        //     e.disabled = true;
        //     e.sort = 1;
        //   } else {
        //     e.disabled = false;
        //     e.sort = 0;
        //   }
        //   /**
        //    * 提現類型為手動提現，所有類型銀行卡都可以提現
        //    * 提現類型為自動提現，只有已簽約的銀行卡才能提現
        //    */
        //   if (withdrawTypeArr.filter((i) => i == 4)[0] && e.type == 1) {
        //     e.disabled = false;
        //     e.sort = 0;
        //   }
        //   return e;
        // });
        this.accountList = arr.sort((a, b) => a.sort - b.sort);
        this.isShowSheet = true;
      });
    },
    onSelect(item) {
      // if (item.disabled) return;
      let text = "";
      // if (item.type == 2) {
      //   text = "微信錢包";
      // } else if (item.type == 3) {
      //   text = `支付寶(${item.account_number})`;
      // } else if (item.type == 4) {
      //   text = `${item.title}(${item.label})`;
      // } else if (item.type == 1) {
      //   let cardType = item.bank_type == "00" ? "儲蓄卡" : "信用卡";
      //   text = `${item.open_bank}-${cardType}(${item.label})`;
      // }
      text = `${item.title}(${item.label})`;
      this.accountInfo = text;
      this.$emit("select", item);
      this.isShowSheet = false;
    },
    onClose() {
      this.isShowSheet = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 65vh;
  overflow-y: auto;
  padding-bottom: 160rpx;
}
</style>
