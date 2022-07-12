export default {
  props: {
    // 自定義類名
    customClass: {
      type: [String, Array, Object],
      default: () => {}
    },
    // 自定義樣式
    customStyle: {
      type: [Object],
      default: () => {}
    }
  }
};
