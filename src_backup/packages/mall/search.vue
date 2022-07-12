<template>
  <view class="pages">
    <lk-search
      v-model="value"
      focus
      placeholder="請輸入關鍵詞"
      action="搜索"
      @search="onSearch"
    />
    <view class="search-history" v-if="historyList.length">
      <view class="history-head">歷史搜索</view>
      <view class="history-list">
        <lk-cell
          clickable
          v-for="(item, index) in historyList"
          :key="index"
          :value="item.query.search_text"
          :to="item"
        />
      </view>
      <view class="history-foot">
        <lk-button round @click="removeHistory">清空歷史記錄</lk-button>
      </view>
    </view>
    <view class="empty" v-else>暫無搜索記錄</view>
  </view>
</template>

<script>
import $Storage from "@/api/storage";
export default {
  name: "packages-mall-search",
  data() {
    return {
      value: "",
      historyList: []
    };
  },
  onLoad(query) {
    const { type, shop_id, shopkeeper_id } = query;
    let to = "";
    if (type === "goods") {
      // 商品
      to = {
        path: "/pages/goods/list",
        query: {
          search_text: ""
        }
      };
      if (shop_id) {
        // 店鋪商品
        to.query.shop_id = shop_id;
      }
    } else if (type === "shop") {
      // 店鋪
      to = {
        path: "/packages/shop/search",
        query: {
          search_text: ""
        }
      };
    } else if (type === "microshopgoods") {
      //微店挑選商品
      to = {
        path: "/packages/microshop/goods/list",
        query: {
          search_text: ""
        }
      };
      if (shopkeeper_id) {
        // 店主商品
        to.query.shopkeeper_id = shopkeeper_id;
      }
    } else if (type === "integralgoods") {
      //積分商城
      to = {
        path: "/packages/integral/goods/list",
        query: {
          search_text: ""
        }
      };
    } else if (type === "store") {
      //門店
      to = {
        path: "/packages/store/search",
        query: {
          search_text: ""
        }
      };
      if (shop_id) {
        // 店鋪商品
        to.query.shop_id = shop_id;
      }
    }
    this.type = type;
    this.to = to;

    if ($Storage.get("history_key_" + type)) {
      this.historyList = $Storage.get("history_key_" + type);
    }
  },
  methods: {
    onSearch(value) {
      let to = this.to;
      const search_text = value.trim();
      if (!search_text) return this.$Prompt.toast("內容不能為空");
      to.query.search_text = search_text;
      this.saveHistory(to);
      this.$Navigate.push(to).then(() => {
        this.historyList = $Storage.get("history_key_" + this.type);
      });
    },
    insertArray(arr, val, compare, maxLen) {
      const index = arr.findIndex(compare);
      if (index === 0) {
        return;
      }
      if (index > 0) {
        arr.splice(index, 1);
      }
      arr.unshift(val);
      if (maxLen && arr.length > maxLen) {
        arr.pop();
      }
    },
    saveHistory(query) {
      let searches = $Storage.get("history_key_" + this.type)
        ? $Storage.get("history_key_" + this.type)
        : [];
      this.insertArray(
        searches,
        query,
        item => {
          if(item.query){
            return item.query.search_text == query.query.search_text;
          }else{
             return item == query;
          }
        },
        15
      );
      $Storage.set("history_key_" + this.type, searches);
      return searches;
    },
    removeHistory() {
      this.$Prompt
        .modal({
          title: "提示",
          content: "確定刪除所有歷史記錄？"
        })
        .then(() => {
          $Storage.remove("history_key_" + this.type);
          this.historyList = [];
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.search-history {
  margin-top: 20rpx;
  height: calc(100% - 120rpx);
}

.search-history .history-head {
  padding: 40rpx 28rpx;
  font-weight: 800;
}

.search-history .history-list {
  overflow-y: auto;
  max-height: calc(100% - 360rpx);
}

.history-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40rpx;
}
</style>
