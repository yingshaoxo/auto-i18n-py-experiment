<template>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell
        v-for="(item, index) in list"
        :key="index"
        center
        :icon="item.avatar"
        icon-size="40"
        :title="item.nameText"
        :label="item.labelText"
      >
        <lk-button
          slot="rightIcon"
          size="small"
          :color="item.btnColor"
          :loading="item.btnLoading"
          round
          @click="toggleFollow(index)"
        >
          {{ item.btnText }}
        </lk-button>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import {
  GET_FANSUSERLIST,
  GET_THINGCIRCLEFOLLOW
} from "@/common/interface/thingcircle";
import loadMixin from "@/mixins/load-list";
import thingcircleMixin from "@/mixins/thingcircle";
export default {
  name: "packages-thingcircle-follow",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          tip: "木有粉絲"
        }
      }
    };
  },
  mixins: [loadMixin, thingcircleMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_FANSUSERLIST(this.params)
        .then(({ data }) => {
          let list = data.data;
          list.forEach(e => {
            e.avatar = e.user_headimg;
            e.nameText = e.thing_user_name || "匿名";
            e.labelText = "乾貨：" + e.thing_count || 0;
            e.btnText = e.mutual ? "互相關注" : "回粉";
            e.btnColor = e.mutual ? "" : this.theme.color;
            e.btnLoading = false;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    toggleFollow(index) {
      const item = this.list[index];
      item.btnLoading = true;
      GET_THINGCIRCLEFOLLOW({
        thing_auid: item.uid
      })
        .then(res => {
          item.mutual = !item.mutual;
          item.btnText = item.mutual ? "互相關注" : "回粉";
          item.btnColor = item.mutual ? "" : this.theme.color;
          item.btnLoading = false;
        })
        .catch(() => {
          item.btnLoading = false;
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
