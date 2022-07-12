/**
 * 裝修頁面下拉加載更多
 * 優化裝修數據過多頁面渲染慢問題
 * 直接調用initLoadItems傳入裝修數據即可
 */
import { pxTorpx } from "@/common/utils";
export default {
  data() {
    return {
      items: [],

      searchItems: { id: "", params: {}, style: {}, vheight: 0 },
      floaterItems: {
        id: "",
        params: {},
        style: {},
        data: {},
        scrollTop: 0
      },

      reform: {
        index: 0,
        viewHeight: 0,
        viewTop: 0,

        offset: 100,

        list: [],

        loading: true,
        finished: false
      }
    };
  },
  watch: {
    // 按需加載方式
    // "reform.loading"() {
    //   this.$nextTick(this.check);
    // },
    // "reform.finished"() {
    //   this.$nextTick(this.check);
    // }
  },
  onPageScroll(e) {
    // 按需加載方式
    // this.reform.viewTop = e.scrollTop;
    // this.$nextTick(this.check);
    if (this.floaterItems.id) {
      this.floaterItems.scrollTop = e.scrollTop;
    }
  },
  mounted() {
    // this.$nextTick(this.check);
  },
  onShow() {
    // if (this.isIncomplete) {
    //   console.log(
    //     "上次頁面未加載完成，加載到第",
    //     this.reform.index,
    //     "條，還差",
    //     this.reform.list.length - this.reform.index,
    //     "條"
    //   );
    //   this.timerLoadItems();
    // }
  },
  onHide() {
    // console.log(this.reform.index, this.reform.list.length);
    // if (this.reform.index != this.reform.list.length) {
    //   this.isIncomplete = true;
    // }
    // this.destroyTimer();
  },
  onUnload() {
    // this.destroyTimer();
  },
  methods: {
    resetItems() {
      this.items = [];
      this.reform.index = 0;
      this.reform.viewHeight = 0;
      this.reform.viewTop = 0;
      this.reform.list = [];
      this.reform.loading = true;
      this.reform.finished = false;
      this.searchItems = { id: "", params: {}, style: {}, vheight: 0 };
      this.floaterItems = {
        id: "",
        params: {},
        style: {},
        data: {},
        scrollTop: 0
      };
      uni.stopPullDownRefresh();
    },
    initLoadItems(items, pageType) {
      this.reform.list = this.itemsObjToArr(items);
      if (pageType == 1 || pageType == 4) {
        this.reform.list.push({ id: "copyright" });
      }

      // this.$nextTick(this.load);// 按需加載方式

      // this.timerLoadItems();// 定時加載方式

      this.items = [...this.reform.list];
    },
    // 定時加載方式
    timerLoadItems() {
      this.destroyTimer();
      this.timer = setInterval(() => {
        this.items.push(this.reform.list[this.reform.index]);
        this.reform.index++;
        if (this.reform.index >= this.reform.list.length) {
          this.destroyTimer();
        }
        console.log(this.items);
      }, 10);
    },
    // 銷毀定時
    destroyTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    load() {
      this.reform.loading = false;
      if (this.reform.list.length === this.reform.index) {
        this.reform.finished = true;
      }
    },
    check() {
      if (this.reform.loading || this.reform.finished) {
        return;
      }
      setTimeout(() => {
        this.getViewRect();
      }, 100);
      const systemInfo = uni.getSystemInfoSync();
      //判斷視圖是否鋪滿全屏
      // console.log({
      //   視圖高度: this.reform.viewHeight,
      //   視圖滾動距離: this.reform.viewTop,
      //   觸底:
      //     this.reform.viewHeight -
      //       this.reform.viewTop -
      //       systemInfo.safeArea.height <=
      //     this.reform.offset
      // });
      // console.log(systemInfo.safeArea.height);
      // this.items = [...this.reform.list];

      if (
        this.reform.viewHeight -
          this.reform.viewTop -
          systemInfo.safeArea.height <=
        this.reform.offset
      ) {
        this.reform.loading = true;

        this.items.push(this.reform.list[this.reform.index]);
        this.reform.index++;

        setTimeout(() => {
          this.load();
        }, 200);
      }
    },
    getViewRect(el) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".reform-view")
        .boundingClientRect(data => {
          // console.log("得到布局位置信息", data);
          this.reform.viewHeight = data.height;
        })
        .exec();
    },
    // 裝修數據對象轉成數組
    itemsObjToArr(items = {}) {
      if (typeof items != "object") {
        return items;
      }
      const arr = [];
      const obj = Object.assign({}, { ...items });
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key].id) {
          if (obj[key].id == "search_top") {
            this.searchItems = obj[key];
            this.searchItems.vheight = pxTorpx(
              34 + parseInt(obj[key].style.paddingtop) * 2
            );
          } else if (obj[key].id == "floater") {
            setTimeout(() => {
              this.floaterItems = {
                ...obj[key],
                key: key,
                scrollTop: 0,
                timestamp: key + "_" + new Date().getTime()
              };
            }, 10);
          } else {
            // #ifdef MP-WEIXIN
            arr.push({
              key: key,
              timestamp: key + "_" + new Date().getTime(),
              ...obj[key]
            });
            // #endif

            // #ifndef MP-WEIXIN
            if (obj[key].id != "customer" && obj[key].id != "mplive") {
              arr.push({
                key: key,
                timestamp: key + "_" + new Date().getTime(),
                ...obj[key]
              });
            }
            // #endif
          }
        }
      }
      return arr;
    }
  }
};
