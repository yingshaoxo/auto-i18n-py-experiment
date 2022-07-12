<template>
  <view>
    <lk-cell>
      <view slot="title" class="title">基礎信息</view>
    </lk-cell>
    <lk-cell title="圖片" field>
      <lk-cell-image-panel :list="info.image" />
    </lk-cell>
    <lk-cell title="商品標題" field>
      <div class="value">{{info.name}}</div>
    </lk-cell>
  </view>
</template>

<script>
import lkCellImagePanel from "./cell-image-panel";
export default {
  data() {
    return {};
  },
  props: {
    value: Boolean,
    info: Object
  },
  computed: {
    checked: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  methods: {},
  components: {
    lkCellImagePanel
  }
};
</script>

<style scoped lang="scss">
.title {
  font-weight: 800;
}

.value {
  color: $text-color;
}
</style>