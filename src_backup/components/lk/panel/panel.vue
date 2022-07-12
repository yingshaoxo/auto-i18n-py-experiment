<template>
  <view class="panel" :class="[cardClass]">
    <slot name="header">
      <lk-cell
        :icon="icon"
        :title="title"
        :label="desc"
        v-if="icon || title || desc"
      >
        <text class="status" v-if="status">{{ status }}</text>
      </lk-cell>
    </slot>
    <view class="content">
      <slot />
    </view>
    <view v-if="$slots.footer" class="footer hairline-top">
      <slot name="footer" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cname: "panel"
    };
  },
  props: {
    icon: String, // 頭部右側圖標
    title: String, // 頭部標題
    desc: String, // 頭部 標題描述
    status: String, //頭部 右側描述 字體顏色默認紅色
    card: Boolean // 是否卡片式
  },
  computed: {
    cardClass() {
      return this.card ? "card-group-box" : "";
    }
  }
};
</script>

<style scoped lang="scss">
.panel {
  background-color: $white;
}

.status {
  color: $red;
}

.content {
  padding: $cell-padding;
}

.footer {
  padding: $cell-padding;
  display: flex;
  justify-content: flex-end;
}
</style>
