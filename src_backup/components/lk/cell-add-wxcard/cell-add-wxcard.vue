<template>
  <view :class="cardClass">
    <!-- #ifdef H5 -->
    <lk-cell
      :title="text"
      :label="addText"
      center
      :is-link="isCanAdd"
      @click="onAdd"
    >
      <lk-icon
        class="card-icon"
        slot="icon"
        class-prefix="v-icon"
        name="v-icon-card"
        square
        size="30"
        color="#ff976a"
      />
    </lk-cell>
    <!--  #endif -->
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { isWeixin } from "@/common/utils";
// #ifdef H5
import {
  MEMBERCARD_ADDMEMBERCARDTOWX,
  MEMBERCARD_MEMBERCARDSUCCESSTOWX
} from "@/common/interface/membercard";

import {
  GET_WXCARDPARAMS,
  GET_WXCARDSTATE
} from "@/common/interface/consumercard";

import wxSdk from "@/common/utils/wx-sdk";
// #endif
export default {
  props: {
    // 多個id逗號隔開
    params: [String, Number],
    card: Boolean,
    addtype: [String]
  },
  computed: {
    ...mapState(["config"]),
    cardClass() {
      return this.card ? "card-group-box" : "";
    },
    isCanAdd() {
      // #ifdef H5
      return isWeixin() && this.config.is_wchat;
      // #endif

      // #ifndef H5
      return false;
      // #endif
    },
    addText() {
      return this.isCanAdd ? "前往領取>>" : "";
    },
    text() {
      return this.isCanAdd
        ? "領取到微信卡包，通過卡包快速核銷。"
        : "使用微信訪問商城可將該消費卡領取到“微信卡包”以便下次使用。";
    }
  },
  methods: {
    onAdd() {
      const params = {
        membercard_id: this.params //會員卡參數
      };
      const consumercardparams = {
        cards_id: this.params //計時計次參數
      };
      if (this.isCanAdd) {
        if (this.addtype == "membercard") {
          // this.$store.dispatch("wxAddCard", params).then(() => {
          //    this.$emit('success')
          // });
          MEMBERCARD_ADDMEMBERCARDTOWX(params)
            .then(({ data }) => {
              wxSdk.wxAddCard({ cardList: data.cardList }).then(() => {
                MEMBERCARD_MEMBERCARDSUCCESSTOWX(params)
                  .then(() => {
                    this.$emit("success");
                  })
                  .catch(() => {});
              });
            })
            .catch(() => {});
        }
        if (this.addtype == "consumercard") {
          // this.$store.dispatch("consumercard", consumercardparams).then(() => {
          //   this.$emit("success");
          // });
          GET_WXCARDPARAMS(consumercardparams)
            .then(({ data }) => {
              wxSdk.wxAddCard({ cardList: data.cardList }).then(() => {
                GET_WXCARDSTATE(consumercardparams)
                  .then(() => {
                    this.$emit("success");
                  })
                  .catch(() => {});
              });
            })
            .catch(() => {});
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card-icon {
  width: 100rpx !important;
}
</style>
