//
import { encryptMobile, encryptBankCard } from "@/common/utils";
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapGetters(["static"]),
    ...mapState({
      memberInfo: ({ member }) => member.info
    })
  },
  methods: {
    /**
     * 組裝賬戶列表
     * @param {Array} list 列表
     * @param {Boolean} noAddWx 是否添加微信賬號，默認為自動添加（前提有openid）
     */
    packageAccountList(list, noAddWx) {
      let arr = list.map(e => {
        e.title = e.realname;
        e.showLabel = e.account_number;
        e.label = encryptMobile(e.account_number);
        if (e.type == 3) {
          e.logo = this.static.baseImgPath + "icon-alipay.png";
        }
        if (e.type == 4) {
          e.title = e.open_bank;
          e.logo = this.static.baseImgPath + "icon-yl.png";
        }
        if (e.type == 1) {
          let cardType = e.bank_type == "00" ? "儲蓄卡" : "信用卡";
          e.title = e.open_bank + " (" + cardType + ")";
          e.label = encryptBankCard(e.account_number);
          e.showLabel = e.account_number;
          e.logo = e.bank_iocn;
        }
        return e;
      });
      if (!noAddWx && this.memberInfo.openid) {
        arr.unshift({
          title: "微信賬號",
          type: 2,
          id: "-2",
          logo: this.static.baseImgPath + "icon-wechat.png",
          label: "微信授權登錄後自動增加"
        });
      }
      return arr;
    }
  }
};
