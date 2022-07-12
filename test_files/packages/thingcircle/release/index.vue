<template>
  <view class="pages">
    <view class="cell-group">
      <lk-field
        v-model="params.thing_title"
        placeholder="加個標題會有更多贊哦！最多20字"
        maxlength="20"
      />
      <lk-field
        v-model="params.content"
        type="textarea"
        maxlength="1000"
        placeholder="說說此刻心情。最多1000字"
      />
      <lk-cell>
        <lk-upload
          :file-list="imgList"
          :max-count="9"
          @on-success="onUploadSuccess"
          @on-remove="onRemove"
        />
      </lk-cell>
      <cell-goods v-model="params.goods_array" />
      <cell-topic v-model="params.topic_id" />
      <cell-location @get-info="getLocationInfo" />
    </view>
    <view class="foot-btn-group">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        :loading="isLoading"
        @click="onSubmit"
      >
        發布乾貨
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  ADD_RELEASEDRY,
  GET_THINGCIRCLEDETAIL
} from "@/common/interface/thingcircle";
import cellGoods from "../component/release/cell-goods";
import cellTopic from "../component/release/cell-topic";
import cellLocation from "../component/release/cell-location";
import thingcircleMixin from "@/mixins/thingcircle";

function getListValue(list = []) {
  let a = [];
  list.forEach(e => {
    if (e.src) {
      a.push(e.src);
    } else if (e.response) {
      a.push(e.response.src);
    } else if (e.url) {
      a.push(e.url);
    }
  });
  return a.join(",");
}
export default {
  name: "packages-thingcircle-release-index",
  data() {
    return {
      isLoading: false,
      params: {
        thing_type: 1, //發布類型
        topic_id: "",
        content: "",
        thing_title: "",
        img_id: "",
        goods_array: "",
        location: "",
        lat: "",
        lng: ""
      },
      imgList: []
    };
  },
  mixins: [thingcircleMixin],
  onLoad(query) {
    this.params.thing_id = query.thing_id || "";
    if (this.params.thing_id) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      GET_THINGCIRCLEDETAIL({ thing_id: this.params.thing_id })
        .then(({ data }) => {
          this.params.thing_type = data.thing_type;
          this.params.topic_id = data.topic_id;
          this.params.content = data.content;
          this.params.thing_title = data.title;
          this.params.goods_array = data.recommend_goods;
          this.params.location = data.location;
          this.params.lat = data.lat;
          this.params.lng = data.lng;
          let imgArr = [];
          data.img_temp_array.forEach(e => {
            imgArr.push(e.pic_cover);
            this.imgList.push({ url: e.pic_cover, src: e.pic_cover, ...e });
          });
          this.params.img_id = imgArr.join(",");
        })
        .catch(() => {});
    },
    getLocationInfo(data) {
      this.params.location = data.title;
      this.params.lat = data.lat;
      this.params.lng = data.lng;
    },
    onUploadSuccess(data, i, list) {
      this.params.img_id = getListValue(list);
    },
    onRemove(index, list) {
      this.params.img_id = getListValue(list);
    },
    onSubmit() {
      if (!this.params.content) {
        return this.$Prompt.toast("請填寫話題內容");
      }
      if (!this.params.img_id) {
        return this.$Prompt.toast("請添加話題圖片");
      }
      this.isLoading = true;
      ADD_RELEASEDRY(this.params)
        .then(({ message }) => {
          this.$Navigate.replace("/pages/thingcircle/index").then(() => {
            this.$Prompt.toast({ title: message, icon: "success" });
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    cellGoods,
    cellTopic,
    cellLocation
  }
};
</script>

<style lang="scss" scoped></style>
