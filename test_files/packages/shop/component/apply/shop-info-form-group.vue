<template>
  <view class="cell-group">
    <view class="cell-group-title">店鋪信息</view>
    <lk-field
      label="店鋪名稱"
      required
      v-model="form.shop_name"
      placeholder="必填，请输入店鋪名稱"
    />
    <lk-cell-picker-group
      v-model="shopType"
      required
      label="店鋪類型"
      placeholder="请选择店鋪類型"
      :columns="shopTypeColumn"
      @confirm="onConfirm"
    />
  </view>
</template>

<script>
import { GET_SHOPGROUP } from "@/common/interface/shop";
export default {
  data() {
    return {
      shopType: -1,
      shopTypeColumn: [],
      form: {
        shop_name: "",
        shop_group_id: "",
        shop_group_name: ""
      }
    };
  },
  mounted() {
    GET_SHOPGROUP().then(({ data }) => {
      data.shop_group_list.map(e => {
        this.shopTypeColumn.push({
          name: e.group_name,
          id: e.shop_group_id
        });
      });
    });
  },
  methods: {
    onConfirm(index) {
      const item = this.shopTypeColumn[index];
      this.form.shop_group_id = item.id;
      this.form.shop_group_name = item.name;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>
