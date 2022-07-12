<template>
  <view class="card-group-box">
    <lk-cell icon="edit" title="買家留言" />
    <lk-cell :value="detail.buyer_message || '該訂單沒有留言'" />
  </view>
</template>

<script>
export default {
  props: {
    detail: Object
  }
};
</script>
