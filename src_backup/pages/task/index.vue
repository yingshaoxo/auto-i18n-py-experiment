<template>
  <view class="pages">
    <!-- #ifndef H5 -->
    <lk-navbar
      immersive
      route-title
      :title-color="nbStyle.color"
      :back-icon-color="nbStyle.color"
      :background="{ background: nbStyle.background }"
    />
    <!-- #endif -->
    <lk-header-panel
      top-bar
      :avatar="info.user_headimg"
      :name="info.user_name"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        待完成
        <text class="strong">{{ info.unfinished_count || 0 }}</text>
        個任務
      </view>
      <view slot="right" class="btn-group">
        <lk-button
          size="small"
          round
          plain
          :color="theme.color"
          to="/packages/task/list"
        >
          我的任務
        </lk-button>
      </view>
    </lk-header-panel>
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="2"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <list-item v-for="(item, index) in list" :key="index" :items="item">
          <view class="item-btn" slot="right">
            <lk-button
              v-if="item.task_info_status == 0"
              type="danger"
              bing-mobile
              round
              size="small"
              :color="theme.gradient"
              :disabled="item.btnDisabled"
              :loading="item.btnLoading"
              @click="onReceive(index)"
            >
              領取
            </lk-button>
          </view>
        </list-item>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { GET_TASKCENTRE, RECEIVE_TASK } from "@/common/interface/task";
import loadMixin from "@/mixins/load-list";
import listItem from "./component/list-item";
import navbarStyle from "@/mixins/navbar-style";
export default {
  name: "pages-task-index",
  data() {
    return {
      info: {},
      tabs: [
        {
          name: "單次任務",
          task_kind: 1
        },
        {
          name: "多次任務",
          task_kind: 2
        }
      ],
      params: {
        page_index: 1,
        page_size: 20,
        task_kind: 1
      },
      upOption: {
        empty: {
          tip: "沒有相關任務"
        }
      }
    };
  },
  mixins: [loadMixin, navbarStyle],
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_TASKCENTRE(this.params)
        .then(({ data }) => {
          this.info = data.user_task_info.user_info;
          let list = data.user_task_info.task_info || [];
          list.forEach(e => {
            e.btnLoading = false;
            e.btnDisabled = false;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      this.params.task_kind = this.tabs[index].task_kind;
      this.resetList();
    },
    onReceive(index) {
      let item = this.list[index];
      item.btnLoading = true;
      RECEIVE_TASK({
        general_poster_id: item.general_poster_id
      })
        .then(({ message }) => {
          item.btnDisabled = true;
          item.btnLoading = false;
          this.$Prompt.toast({ title: message, icon: "success" });
        })
        .catch(() => {
          this.btnLoading = false;
        });
    }
  },
  components: {
    listItem
  }
};
</script>

<style lang="scss" scoped>
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.btn-group {
  display: flex;
  align-items: center;
}
.item-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
