<template>
  <view class="pages">
    <lk-cell-add-wxcard
      class="wxcard"
      :params="detail.card_id"
      addtype='consumercard'
      @success="loadData"
      v-if="!detail.wx_card_state && detail.card_type == 2"
    />
    <detailinfo :detail="detail" />
    <qrcode :detail="detail" v-if="detail.card_code" />
    <shopinfo :detail="detail" />
    <cancecase :detail="detail" />
    <recordinfo :card_id="card_id" />
    <lk-shortcut-entry />
  </view>
</template>

<script>
import detailinfo from "./component/detailinfo";
import qrcode from "./component/qrcode";
import shopinfo from "./component/shopinfo";
import cancecase from "./component/cancecase";
import recordinfo from "./component/recordinfo";
import {
  GET_CONSUMERCARDDETAIL,
  GET_CONSUMERCARDLOG
} from "@/common/interface/consumercard";
export default {
  name: "packages-consumercard-detail",
  data() {
    return {
      detail: {
        card_code: ""
      },
      record: [],
      card_id: "",
      wx_card_id: ""
    };
  },
  onLoad(options) {
    this.card_id = options.cardid;
    this.wx_card_id = options.card_id;
    this.loadData();
  },
  methods: {
    loadData() {
      let params = {};
      params.card_id = this.card_id || 0;
      if (this.wx_card_id) {
        params.wx_card_id = this.wx_card_id;
      }
      GET_CONSUMERCARDDETAIL(params)
        .then(({ data }) => {
          this.detail = data || {};
        })
        .catch(error => {});
    }
  },

  components: {
    detailinfo,
    qrcode,
    shopinfo,
    cancecase,
    recordinfo
  }
};
</script>

<style lang="scss" scoped>
.wxcard {
  border-top: 1px solid #f4f4f4;
}
</style>
