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
        :value="item.create_time"
        v-for="(item, index) in list"
        :key="index"
        :to="'/packages/property/log/detail?id=' + item.id"
      >
        <view slot="title">{{ item.type_name }}</view>
        <view
          slot="label"
          class="label"
          :class="item.status == 4 || item.status == -1 ? 'text-through' : ''"
          >{{ memberTexts.balance_style }}： {{ item.balance }}</view
        >
        <view>
          <view :class="item.change_money > 0 ? 'positive' : 'negative'">
            {{ item.change_money }}
          </view>
          <view class="time">{{ item.create_time }}</view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_ASSETBALANCELOG } from "@/common/interface/property";
import loadMixin from "@/mixins/load-list";
import { mapState } from "vuex";
export default {
  name: "packages-property-log-list",
  data() {
    return {
      isProceeds: false,
      params: {}
    };
  },
  onLoad(query) {
    this.isProceeds = query.hash == "proceeds";
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      memberTexts: ({ member }) => member.texts
    })
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      const isProceeds = this.isProceeds;
      setTimeout(() => {
        GET_ASSETBALANCELOG(this.params, { isProceeds }).then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.positive {
  color: #4b0;
}
.label,
.time {
  font-size: $font-size-sm;
  color: $text-light;
}
.negative {
  color: #ff454e;
}
.text-through {
  text-decoration: line-through;
}
</style>
