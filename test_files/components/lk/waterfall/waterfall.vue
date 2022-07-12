<template>
  <view class="u-waterfall">
    <view id="u-left-cloumn" class="u-cloumn">
      <slot name="left"></slot>
    </view>
    <view id="u-right-cloumn" class="u-cloumn">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
/**
 * waterfall 瀑布流
 * @property {Array} flow-list 用於渲染的數據
 * @property {String Number} add-time 單條數據添加到隊列的時間間隔，單位ms，見上方注意事項說明（默認200）
 * @example <u-waterfall :flowList="flowList"></u-waterfall>
 */
export default {
  name: "u-waterfall",
  props: {
    value: {
      // 瀑布流數據
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    },
    // 每次向結構插入數據的時間間隔，間隔越長，越能保證兩列高度相近，但是對用戶體驗越不好
    // 單位ms
    addTime: {
      type: [Number, String],
      default: 10
    },
    // id值，用於清除某一條數據時，根據此idKey名稱找到並移除，如數據為{idx: 22, name: 'lisa'}
    // 那麼該把idKey設置為idx
    idKey: {
      type: String,
      default: "id"
    }
  },
  provide() {
    return {
      uWaterfall: this
    };
  },
  data() {
    return {
      leftList: [],
      rightList: [],
      tempList: [],
      children: []
    };
  },
  watch: {
    copyFlowList(nVal, oVal) {
      // 取差值，即這一次數組變化新增的部分
      let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
      this.tempList = this.cloneData(nVal.slice(startIndex));
      this.splitData();
    }
  },
  mounted() {
    this.tempList = this.cloneData(this.copyFlowList);
    this.splitData();
  },
  computed: {
    // 破壞flowList變量的引用，否則watch的結果新舊值是一樣的
    copyFlowList() {
      return this.cloneData(this.value);
    }
  },
  methods: {
    // 查詢節點信息
    $uGetRect(selector, all) {
      return new Promise(resolve => {
        uni
          .createSelectorQuery()
          .in(this)
          [all ? "selectAll" : "select"](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          })
          .exec();
      });
    },
    async splitData() {
      if (!this.tempList.length) return;
      let leftRect = await this.$uGetRect("#u-left-cloumn");
      let rightRect = await this.$uGetRect("#u-right-cloumn");
      // 如果左邊小於或等於右邊，就添加到左邊，否則添加到右边
      let item = this.tempList[0];
      // 解決多次快速上拉後，可能數據會亂的問題，因為經過上面的兩個await節點查詢阻塞一定時間，加上後面的定時器乾擾
      // 數組可能變成[]，導致此item值可能為undefined
      if (!item) return;
      if (leftRect.height < rightRect.height) {
        this.leftList.push(item);
        this.$emit("get-list", { left: this.leftList, right: this.rightList });
      } else if (leftRect.height > rightRect.height) {
        this.rightList.push(item);
        this.$emit("get-list", { left: this.leftList, right: this.rightList });
      } else {
        // 這裡是為了保證第一和第二張添加時，左右都能有內容
        // 因為添加第一張，實際隊列的高度可能還是0，這時需要根據隊列元素長度判斷下一個該放哪邊
        if (this.leftList.length <= this.rightList.length) {
          this.leftList.push(item);
          this.$emit("get-list", {
            left: this.leftList,
            right: this.rightList
          });
        } else {
          this.rightList.push(item);
          this.$emit("get-list", {
            left: this.leftList,
            right: this.rightList
          });
        }
      }
      // 移除臨時列表的第一項
      this.tempList.splice(0, 1);
      // 如果臨時數組還有數據，繼續循環
      if (this.tempList.length) {
        setTimeout(() => {
          this.splitData();
        }, this.addTime);
      }
    },
    // 復制而不是引用對象和數組
    cloneData(data) {
      return JSON.parse(JSON.stringify(data));
    },
    // 清空數據列表
    clear() {
      this.leftList = [];
      this.rightList = [];
      // 同時清除父組件列表中的數據
      this.$emit("input", []);
      this.$emit("get-list", {
        left: [],
        right: []
      });
    },
    // 清除某一條指定的數據，根據id實現
    remove(id) {
      let tmp = false;
      // 如果findIndex找不到合適的條件，就會返回-1
      let index = -1;
      index = this.leftList.findIndex(val => val[this.idKey] == id);
      if (index != -1) {
        // 如果index不等於-1，說明已經找到了要找的id，根據index索引刪除這一條數據
        this.leftList.splice(index, 1);
      } else {
        // 同理於上方面的方法
        index = this.rightList.findIndex(val => val[this.idKey] == id);
        if (index != -1) this.rightList.splice(index, 1);
      }
      // 同時清除父組件的數據中的對應id的條目
      index = this.value.findIndex(val => val[this.idKey] == id);
      if (index != -1) this.$emit("input", this.value.splice(index, 1));
    }
  }
};
</script>

<style lang="scss" scoped>
.u-waterfall {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.u-cloumn {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: auto;
}
.u-image {
  width: 100%;
}
</style>
