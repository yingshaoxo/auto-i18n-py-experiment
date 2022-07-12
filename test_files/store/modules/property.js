import {
  GET_BANKSIGNINGSMS,
  SIGNING_BANKCARD,
  GET_PROPERTYCHARGESERVICE
} from "@/common/interface/property";
import { GET_BANKCARDSMS, PAY_BANKCARD } from "@/common/interface/pay";
import $Prompt from "@/api/prompt";

export default {
  state: {},
  actions: {
    /**
     * 獲取銀行簽約短信
     * @param {String} params  簽約申請返回的信息
     */
    getSigningSms(context, params) {
      return new Promise((resolve, reject) => {
        GET_BANKSIGNINGSMS(params)
          .then(({ message }) => {
            setTimeout(() => {
              $Prompt.toast({
                title: message,
                icon: "success",
                duration: 1000
              });
            }, 100);
            resolve(message);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 簽約銀行卡
     * @param {String} params
     */
    signingBankCard(context, params) {
      return new Promise((resolve, reject) => {
        SIGNING_BANKCARD(params)
          .then(({ message }) => {
            $Prompt.toast({ title: message, icon: "success" });
            resolve(message);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 獲取銀行支付短信
     * @param {String} params  支付申請返回的信息
     */
    getBankPaySms(context, params) {
      return new Promise((resolve, reject) => {
        GET_BANKCARDSMS(params)
          .then(res => {
            setTimeout(() => {
              $Prompt.toast({
                title: res.message,
                icon: "success",
                duration: 1000
              });
            }, 100);
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 銀行卡支付
     * @param {String} params
     */
    payBankCard(context, params) {
      return new Promise((resolve, reject) => {
        PAY_BANKCARD(params)
          .then(({ message }) => {
            $Prompt.toast({ title: message, icon: "success" });
            resolve(message);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 獲取各種資產手續費
     * @param {String} params
     */
    getPropertyChargeService(context, params) {
      return new Promise((resolve, reject) => {
        GET_PROPERTYCHARGESERVICE(params)
          .then(({ data, message }) => {
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      });
    }
  }
};
