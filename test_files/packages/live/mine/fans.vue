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
      <view class="list">
        <lk-cell
          v-for="(item, index) in list"
          :key="index"
          center
          :icon="item.user_headimg"
          icon-size="40"
          :title="item.uname"
        >
          <lk-button
            slot="rightIcon"
            size="small"
            :theme-color="!item.is_mutual_focus"
            :loading="item.btnLoading"
            round
            @click="toggleFollow(index)"
          >
            {{ item.btnText }}
          </lk-button>
        </lk-cell>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_LIVEFANSLIST, SET_LIVEFOCUS } from "../interface";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-live-mine-fans",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {}
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_LIVEFANSLIST(this.params)
        .then(({ data }) => {
          let list = data.focus_list || [];
          list.forEach(e => {
            e.btnText = e.is_mutual_focus ? "相互關注" : "回粉";
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
      SET_LIVEFOCUS(
        {
          follow_uid: item.uid
        },
        { isFocued: !!item.is_mutual_focus } //
      )
        .then(res => {
          this.resetList();
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
