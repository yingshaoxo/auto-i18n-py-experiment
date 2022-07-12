/**
 * 自定義頁面導航樣式
 * 搭配navbar組件使用
 * 滾動時漸變navbar的背景顏色跟字體顏色
 */
import { throttle } from "@/common/utils";
export default {
  data() {
    return {
      scrollTop: 0
    };
  },
  computed: {
    nbStyle() {
      const num = this.scrollTop;
      const color = `rgba(0,0,0,${num / 100})`;
      const background = `rgba(255,255,255,${num / 100})`;
      // transparent
      return {
        color: num < 10 ? "#ffffff" : color,
        background: background
      };
    }
  },
  onPageScroll: throttle(function({ scrollTop }) {
    this.scrollTop = scrollTop;
  }, 10),
  methods: {}
};
