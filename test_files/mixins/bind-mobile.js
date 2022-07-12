import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["token", "isBingFlag", "isBindMobile"])
  },
  methods: {
    ...mapActions(["setLoginBeforePath", "wxBindMobile"]),
    /**
     * 驗證是否綁定手機
     */
    validBindMobile() {
      // 需要綁定手機時，驗證不通過時，進行攔截點擊
      if (!this.token) {
        this.setLoginBeforePath(this.$store.getters.route.fullPath);
        this.$Navigate.push("/packages/login/index").then(() => {
          this.$Prompt.toast("您未登錄，請先登錄！");
        });
        return false;
      }
      if (this.token && this.isBingFlag && !this.isBindMobile) {
        // #ifdef H5
        this.$BindMobile.open();
        // #endif

        // #ifdef APP-PLUS
        uni.navigateTo({
          url: "/pages/member/bind"
        });
        // #endif
        return false;
      }
    }
  }
};
