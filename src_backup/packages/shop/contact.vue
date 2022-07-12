<template>
  <view class="Container">
    <div class="Rows FullSize">
      <lk-field
        v-model="contact"
        label="聯繫方式:"
        placeholder="请输入聯繫方式"
        required
      />
      <lk-field
        v-model="description"
        class="theTextarea"
        type="textarea"
        label="問題描述:"
        placeholder="请输入問題描述"
        required
      />
      <lk-cell center title="" class="">
        <div class="Rows2 Center">
          <lk-upload
            class="upload imageDiv"
            uploadText="(最多上傳5張圖片)"
            height="400"
            width="800"
            :maxCount="5"
            @on-success="voucherSuccess"
          ></lk-upload>
        </div>
      </lk-cell>
      <div class="FullSize shit">
        <div class="submitButton">提交</div>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  name: "package-shop-contact",
  data() {
    return {
      contact: "",
      description: "",
      src: [],
    };
  },
  props: {},
  computed: {},
  methods: {
    voucherSuccess(e) {
      this.src = e;
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.Rows {
  display: flex;
  flex-direction: column;

  padding: 30px;

  > * {
    margin-bottom: 40px;
  }
}

input {
  border: 1px solid #000;
  width: 100%;
  padding: 20px;
}

textarea {
  border: 1px solid #000;
  width: 100%;
  height: 60vh !important;
  padding: 20px;
}

.Center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.Rows2 {
  display: flex;
  flex-direction: column;
}

.tip {
  font-size: 12px;
  text-align: center;
}

.upload {
}

.submitButton {
  // margin-top: 40px;
  margin-bottom: 20px;

  background-color: #037049;
  text-align: center;
  color: white;
  width: 100%;
  height: 40px !important;
  padding-top: 8px;
  padding-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px;
}

.theTextarea {
  height: 40vh;
}

.Container {
  height: 100vh;
}

.FullSize {
  height: 100%;
}

.shit {
  display: flex;

  align-items: flex-end;
}

.imageDiv {
  height: 30vh;
}
</style>
