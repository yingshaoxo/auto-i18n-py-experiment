// mescroll-body 龢 mescroll-uni 通用

// import MescrollUni from "./mescroll-uni.vue";
// import MescrollBody from "./mescroll-body.vue";
import { mapGetters } from "vuex";
const loadMixin = {
  // components: { // 非H5端無法通過mixin注冊組件, 只能在main.js中注冊全局組件或具體界面中注冊
  // 	MescrollUni,
  // 	MescrollBody
  // },
  data() {
    return {
      $load: null, //mescroll實例對象
      downOption: {
        use: false,
        native: true
      },
      upOption: {
        empty: {
          tip: "暫無數據"
        }
      },
      // 加載列表所需參數
      loadParams: {
        page_index: 1,
        page_size: 20
      },
      list: [] //列表數據
    };
  },
  // 注冊系統自帶的下拉刷新 (配置down.native為true時生效, 還需在pages配置enablePullDownRefresh:true;詳請參考mescroll-native的案例)
  onPullDownRefresh() {
    if (this.params&&this.params.recommend_goods_ids) {
      this.params.recommend_goods_ids=''
    }
    this.$load && this.$load.onPullDownRefresh();
  },
  // 注冊列表滾動事件,用於判定在頂部可下拉刷新,在指定位置可顯示隱藏回到頂部按鈕 (此方法為页面生命周期,無法在子組件中觸發, 僅在mescroll-body生效)
  onPageScroll(e) {
    this.$load && this.$load.onPageScroll(e);
  },
  // 注冊滾動到底部的事件,用於上拉加載 (此方法為页面生命周期,無法在子組件中觸發, 僅在mescroll-body生效)
  onReachBottom() {
    this.$load && this.$load.onReachBottom();
  },
  methods: {
    // mescroll組件初始化的回調,可獲取到mescroll對象
    loadInit(mescroll) {
      this.$load = mescroll;
      this.loadInitByRef(); // 兼容字節跳動小程序
      this.loadInitEnd(mescroll);
    },
    // 初始化完成 (一般用於手動觸髮上拉加載時用到)
    loadInitEnd(mescroll) {},
    // 以ref的方式初始化mescroll對象 (兼容字節跳動小程序: http://www.mescroll.com/qa.html?v=20200107#q26)
    loadInitByRef() {
      if (!this.$load || !this.$load.resetUpScroll) {
        let mescrollRef = this.$refs.mescrollRef;
        if (mescrollRef) this.$load = mescrollRef.mescroll;
      }
    },
    // 下拉刷新的回調
    downCallback() {
      // mixin默認resetUpScroll
      this.$load.resetUpScroll();
    },
    // 上拉加載的回調
    upCallback() {
      // mixin默認延時500自動結束加載
      setTimeout(() => {
        this.$load.endErr();
      }, 500);
    },
    emptyClick(e) {
      console.log(e);
    },
    /**
     * 合并列表數據
     * pageList  當前頁數據
     * totalSize 列表的總數據量
     */
    concatList(pageList = [], totalSize) {
      this.$load.endBySize(pageList.length, totalSize);
      if (this.$load.num == 1) {
        this.list = [];
      }
      this.list = this.list.concat(pageList);
    },
    /**
     * 重置列表
     */
    resetList() {
      this.list = [];
      this.$load && this.$load.resetUpScroll();
    }
  },
  mounted() {
    this.loadInitByRef(); // 兼容字節跳動小程序, 避免未設置@init或@init此時未能取到ref的情況
  }
};

export default loadMixin;
