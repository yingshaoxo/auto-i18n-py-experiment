import { mapState } from "vuex";
import { yuan, isDef } from "@/common/utils";
import { formatClass } from "@/common/utils/stringify";

export default {
  computed: {
    ...mapState({
      pointText: ({ member }) => member.texts.point_style
    })
  },
  methods: {
    /**
     * 格式價格，判斷存在積分顯示
     * @param {*} price
     * @param {*} point
     */
    formatPriceText(price, point) {
      let arr = [];
      if (parseFloat(point) > 0) {
        if (parseFloat(price) > 0) {
          arr.push(yuan(price));
        }
        arr.push(`${point}${this.pointText}`);
      } else {
        if (isDef(price)) {
          arr.push(yuan(price));
        }
      }
      return arr.join("+");
    },
    /**
     * 是否價格符號變小
     * @param {*} price
     * @param {*} point
     */
    firstLetterClass(price, point) {
      return formatClass([
        parseFloat(point) > 0 && parseFloat(price) <= 0 ? "" : "first-letter"
      ]);
    }
  }
};
