<template>
  <view class="btn-group">
    <lk-button
      class="btn"
      round
      block
      theme-color
      :to="'/packages/blockchain/exchange?type=' + type"
      >{{ typeToUpperCase }}兌換</lk-button
    >
    <lk-button
      class="btn"
      round
      block
      theme-color
      :to="'/packages/blockchain/transfer?type=' + type"
      >{{ typeToUpperCase }}轉賬</lk-button
    >
    <lk-button
      class="btn"
      round
      block
      theme-color
      plain
      @click="keyTypeApi('keystore')"
      >導出KeyStore</lk-button
    >
    <lk-button
      class="btn"
      round
      block
      theme-color
      plain
      @click="keyTypeApi('privatekey')"
      >導出私钥</lk-button
    >
    <lk-modal-pay-password
      ref="modalPayPassword"
      v-model="isShowModalPayPassword"
      @confirm="onPayPassword"
    />
  </view>
</template>

<script>
import { mapState } from "vuex";
import { EXPORT_BLOCKCHAINKEY } from "@/common/interface/blockchain";
import mixinPayPassword from "@/mixins/valid-pay-password";
export default {
  data() {
    return {
      exportType: "",
      password: ""
    };
  },
  props: {
    type: String,
    info: Object
  },
  mixins: [mixinPayPassword],
  mounted() {},
  computed: {
    ...mapState({
      blockchainInfo: ({ blockchain }) => blockchain
    }),
    typeToUpperCase() {
      return this.type.toUpperCase();
    }
  },
  methods: {
    keyTypeApi(keyType) {
      this.exportType = keyType;
      this.onExport();
    },
    onPayPassword(e) {
      this.password = e;
      this.onExport();
    },
    onExport() {
      this.validPayPassword(this.password, true)
        .then(() => {
          const type = this.type.toLowerCase();
          const key = this.exportType;
          let params = {
            password: this.password,
            address: this.info.address,
            symbol: this.info.symbol
          };
          EXPORT_BLOCKCHAINKEY(params, { type, key })
            .then(({ data }) => {
              this.$store.commit("setBlockchainExportKey", {
                type,
                key,
                value: key == "keystore" ? data.keyStore : data.privateKey
              });
              this.$Navigate.push({
                path: "/packages/blockchain/export",
                query: { type, key }
              });
            })
            .catch(() => {});
        })
        .catch(() => {
          this.password = "";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  flex-flow: wrap;
  margin: 2%;
}

.btn-group .btn {
  width: 46%;
  margin: 2%;
}
</style>
