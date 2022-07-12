import { addImgSrcDomain } from "@/common/utils";

export default {
  data() {
    return {
      cname: this.items.id,

      viewLoading: false, // 視圖加載中
      viewLoaded: false, // 視圖加載完成
      viewError: false, // 視圖加載錯誤

      threshold: 50
    };
  },
  filters: {
    addDomain(value) {
      return addImgSrcDomain(value);
    }
  },
  props: {
    type: [String, Number],
    items: [Object, Array]
  },
  created() {},
  mounted() {
    // this.initIntersection();
  },
  beforeDestroy() {
    this.disconnectObserver();
  },
  methods: {
    toLink(link) {
      this.$Navigate.push(link);
    },
    disconnectObserver() {
      if (this.observer) this.observer.disconnect();
    },
    initIntersection(elClass) {
      return new Promise((resovle, reject) => {
        // mounted的時候，不一定掛載了這個元素，延時30ms
        // setTimeout(() => {
        this.disconnectObserver();
        this.$nextTick(() => {
          const observer = uni.createIntersectionObserver(this);
          // #ifdef H5
          try {
            if (window.parent.document.getElementById("wap-preview-iframe")) {
              resovle();
            } else {
              observer
                .relativeToViewport({ bottom: this.threshold })
                .observe(".reform-box", res => {
                  if (res.intersectionRatio > 0 && !this.appear) {
                    this.appear = true;
                    // console.log(this.items.id, this.items.key, "顯示了");
                    this.disconnectObserver();
                    resovle();
                  }
                });
            }
          } catch (error) {
            resovle();
          }
          // #endif
          
          // #ifndef H5
          observer
            .relativeToViewport({ bottom: this.threshold })
            .observe(".reform-box", res => {
              if (res.intersectionRatio > 0 && !this.appear) {
                this.appear = true;
                // console.log(this.items.id, this.items.key, "顯示了");
                this.disconnectObserver();
                resovle();
              }
            });
          // #endif
          this.observer = observer;
        });
        // }, 30);
      });
    }
  }
};
