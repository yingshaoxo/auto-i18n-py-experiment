<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <share-poster ref="share-poster" />
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import sharePoster from "@/pages/distribute/component/share-poster";
export default {
  name: "packages-distribute-qrcode",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      }
    };
  },
  computed: {
    ...mapState({
      texts: ({ distribute }) => distribute.texts
    })
  },
  onLoad() {},
  onReady() {
    this.$refs["share-poster"] && this.$refs["share-poster"].init();
  },
  onShow() {
    this.pageStyle.title = this.texts.extension_code;
  },
  methods: {},
  components: {
    sharePoster
  }
};
</script>

<style lang="scss" scoped></style>
