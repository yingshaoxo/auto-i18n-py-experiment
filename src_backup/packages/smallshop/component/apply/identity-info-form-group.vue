<template>
  <view class="cell-group">
    <view class="cell-group-title">身份驗證</view>
    <lk-field
      label="身份證號"
      required
      v-model="form.contacts_card_no"
      type="idcard"
      placeholder="必填，请输入身份證號"
    />
    <cell-upload-image
      v-model="form.contacts_card_electronic_1"
      label="手持身份證照"
      :example-img="exampleImgs[0]"
    />
    <cell-upload-image
      v-model="form.contacts_card_electronic_2"
      label="身份證正照"
      :example-img="exampleImgs[1]"
    />
    <cell-upload-image
      v-model="form.contacts_card_electronic_3"
      label="身份證反照"
      :example-img="exampleImgs[2]"
    />
  </view>
</template>

<script>
import cellUploadImage from "./cell-upload-image";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        contacts_card_no: "",
        contacts_card_electronic_1: "",
        contacts_card_electronic_2: "",
        contacts_card_electronic_3: ""
      }
    };
  },
  computed: {
    ...mapGetters(["static"]),
    exampleImgs() {
      let base = this.static.baseImgPath;
      return [
        base + "identity-img-1.png",
        base + "identity-img-2.png",
        base + "identity-img-3.png"
      ];
    }
  },
  methods: {},
  components: {
    cellUploadImage
  }
};
</script>

<style lang="scss" scoped>
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>
