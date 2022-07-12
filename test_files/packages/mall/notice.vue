<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <lk-empty :image="image" :message="message"></lk-empty>
    <block v-if="pagetype == '404' || pagetype == 'noaddon'">
      <lk-shortcut-entry />
    </block>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
const pageObj = {
  404: {
    title: "很抱歉，找不到你要訪問的頁面",
    message: "很抱歉，找不到你要訪問的頁面",
    img: "empty-404.png"
  },
  noaddon: {
    title: "未開啟相關應用",
    message: "未開啟相關應用",
    img: "empty-fail.png"
  },
  nowechat: {
    title: "該商城未對接公眾號",
    message: "該商城未對接公眾號",
    img: "empty-fail.png"
  },
  unopened: {
    title: "很抱歉，商城已經關閉！",
    message: "關閉原因：商城已過期",
    img: "empty-shop.png"
  }
};
export default {
  name: "packages-mall-notice",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      pagetype: ""
    };
  },
  computed: {
    ...mapGetters(["static"]),
    image() {
      return pageObj[this.pagetype]
        ? this.static.baseImgPath + pageObj[this.pagetype].img
        : "";
    },
    message() {
      return pageObj[this.pagetype] ? pageObj[this.pagetype].message : "";
    }
  },
  onLoad(query) {
    this.pagetype = query.type;
    this.tip = query.tip;
    if (this.tip) {
      pageObj[this.pagetype].message = this.tip;
    }
    if (this.pagetype) {
      this.pageStyle.title = pageObj[this.pagetype]
        ? pageObj[this.pagetype].title
        : "";
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.pages {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}
</style>
