import { mapGetters, mapState } from "vuex";

/* !
 * 驗證及設置支付密碼
 * 搭配公共組件modalPayPassword使用；
 * 判斷是否需要進行綁定手機狀態isBingFlag，false情況則不需要進行支付密碼的輸入
 */

export default {
  data() {
    return {
      isShowModalPayPassword: false
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config,
      memberInfo: ({ member }) => member.info
    }),
    // 支付密碼開啟情況，默認是開啟，
    cpp() {
      return !this.config.cpp;
    },
    // 支付密碼長度 ，9位或6位，或保留原先9-20
    ppl() {
      return this.config.ppl;
    },
    // 密碼長度發生改變
    pplChanged() {
      let c_ppl = this.config.ppl ? Number(this.config.ppl) : 0; //後臺設置的密碼長度，默認0
      let m_ppl = this.memberInfo.ppl ? Number(this.memberInfo.ppl) : 0; //會員吱聲的密碼長度，默認0
      return c_ppl != m_ppl;
    },
    ...mapGetters(["isBingFlag"])
  },
  methods: {
    // 設置支付密碼
    showModalPayPassword() {
      return new Promise((resolve, reject) => {
        const content = this.pplChanged
          ? "商城支付密碼升級，請重新設置！"
          : "為了您賬號安全，建议您立即設置支付密碼";
        this.$refs.modalPayPassword.notify({
          message: content,
          confirm: e => {
            resolve();
          },
          cancel: e => {
            reject();
          }
        });
      });
    },
    /**
     * 驗證支付密碼
     * @param {String} password 支付密碼
     * @param {Boolean} valid 為true时则必须驗證支付密碼，不管isBingFlag
     */
    validPayPassword(password = "", valid) {
      return new Promise((resolve, reject) => {
        // 后台未开启驗證支付密碼，或者 賬號體系不需要綁定手機 情況，则不进行驗證支付密碼
        if ((!this.cpp || !this.isBingFlag) && !valid) {
          resolve(null);
        } else {
          let flag = true;
          if (!this.memberInfo.is_password_set || this.pplChanged) {
            this.showModalPayPassword()
              .then(() => {
                this.$refs.modalPayPassword.isShowSetPayPassword = true;
                reject();
              })
              .catch(() => {
                reject();
              });
            flag = false;
          } else {
            if (!password) {
              this.isShowModalPayPassword = true;
              flag = false;
            }
            if (flag) {
              this.$store
                .dispatch("checkPayPassword", password)
                .then(() => {
                  resolve();
                  this.$refs.modalPayPassword.clearPassword();
                })
                .catch(() => {
                  reject();
                  this.$refs.modalPayPassword.clearPassword();
                });
            }
          }
        }
      });
    }
  }
};
