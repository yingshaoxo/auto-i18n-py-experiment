<template>
  <page-meta>
    <navigation-bar front-color="#000000" background-color="#FFFFFF" :title="pageStyle.title" />
  </page-meta>
  <view class="pages">
    <lk-navbar immersive :title-color="nbStyle.color" :back-icon-color="nbStyle.color" route-title
      :background="{ background: nbStyle.background }" />
    <div class="myContainer">
      <!-- <div>
        <div>风格选择:</div>
        <lk-cell-picker-group v-model="pageStyle.style_type" :label="''" :required="false" placeholder="請選擇"
          :columns="columns" @confirm="onConfirm" />
      </div> -->
      <div>
        <div>店鋪頂部背景:</div>
        <div class="Center">
          <div class="imageContainer Columns">
            <img class="anImage" :class="{
              imageOnSelect: url == pageStyle.background
            }" v-for="url, index in getASeriesOfImageURL()" :src="url" @click="onImageSelect(index + 1)" />
          </div>
          <!-- <lk-upload uploadText="" height="250" width="600" :maxCount="1"
            @on-success="onBackgoundImageUploadSuccessful">
          </lk-upload> -->
        </div>
      </div>
      <div>
        <div>店鋪Logo:</div>
        <div class="Center">
          <div class="Columns">
            <img class="logoImage" :src="this.pageStyle.logo" />
            <div class="logoUploader">
              <lk-upload uploadText="" height="250" width="600" :maxCount="1"
                @on-success="onLogoImageUploadSuccessful" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>店鋪名称:</div>
        <div class="Center">
          <input type="text" class="textInputBox" placeholder="" v-model="pageStyle.shop_name" />
        </div>
      </div>
      <div class="Center">
        <div class="saveButton" @click="onSubmit">保存</div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import navbarStyle from "@/mixins/navbar-style";
import { WXSHOPCENTER, SET_BACKGROUND } from "@/common/interface/smallshop";
import { mapState, mapGetters } from "vuex";
export default {
  name: "pages-smallshop-index",
  data () {
    return {
      pageStyle: {
        style_type: 0,
        background: "",
        logo: "",
        shop_name: "",
      },
      wx_id: '',
      columns: [1, 2, 3].map(item => { return { name: String(item) } }),
    };
  },
  computed: {
    ...mapGetters({
      static: "static",
    }),
  },
  mixins: [navbarStyle],
  onLoad (query) {
    this.wx_id = query.wx_id

    WXSHOPCENTER({ id: this.wx_id })
      .then(({ data }) => {
        this.pageStyle.style_type = Number(data.style_type) - 1;
        this.pageStyle.background = data.background;
        this.pageStyle.logo = data.logo;
        this.pageStyle.shop_name = data.shop_name;
      })
      .catch(() => { });
  },
  methods: {
    onConfirm (index) {
      // console.log(this.columns, index)

      this.pageStyle.style_type = index;
    },
    getImageURL (imageNum) {
      return this.static.baseImgPath + "style/shop-head-0" + String(imageNum) + ".jpg"
    },
    getASeriesOfImageURL () {
      return [1, 2, 3, 4, 5].map((e) => {
        return this.getImageURL(e)
      })
    },
    onImageSelect (imageNum) {
      this.pageStyle.background = this.getImageURL(imageNum)
    },
    ...mapActions(["getMemberInfo"]),
    toLink (link) {
      this.$Navigate.push(link);
    },
    onBackgoundImageUploadSuccessful (e) {
      this.pageStyle.background = e.src
    },
    onLogoImageUploadSuccessful (e) {
      this.pageStyle.logo = e.src
    },
    async onSubmit () {
      if ((this.pageStyle.background) && (this.pageStyle.logo) && (this.pageStyle.shop_name)) {
        try {
          await SET_BACKGROUND({
            style_type: Number(this.pageStyle.style_type) + 1,
            background: this.pageStyle.background,
            logo: this.pageStyle.logo,
            shop_name: this.pageStyle.shop_name
          })
          this.$Prompt.toast("修改成功！")
          setTimeout(() => {
            this.$Navigate.replace('/packages/smallshop/home?wx_id=' + this.wx_id);
          }, 500);
        } catch {
          this.$Prompt.toast("修改失敗！")
        }
      } else {
        console.log(
          {
            background: this.pageStyle.background,
            logo: this.pageStyle.logo,
            shop_name: this.pageStyle.shop_name
          }
        )
        this.$Prompt.toast("請確保每項都有上傳或填寫！")
      }
    }
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.info {
  padding-bottom: 40rpx;
  height: 160rpx;
}

.text-item {
  font-size: $font-size-sm;
  line-height: 40rpx;
}

.card-panel {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background: #fff;

  .item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 30rpx 0;
    line-height: 40rpx;
  }

  .text {
    font-size: $font-size;
  }

  .num {
    color: $red;
  }
}


.myContainer {
  margin-top: 40px;
  padding: 40px;

  >* {
    margin-bottom: 80px;
    width: 100%;
  }
}

.Center {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.textInputBox {
  border-style: solid;
  border-width: 1px;
  border-color: #666;

  margin-top: 20px;
  width: 100%;
}

.saveButton {
  margin-top: 60px;
  padding-top: 5px;
  padding-bottom: 5px;

  background-color: #139CD3;
  color: white;
  width: 100%;
  height: 60px;

  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.Columns {
  display: flex;
  flex-direction: row;
}

.imageContainer {
  overflow-x: scroll;
}

.anImage {
  margin-right: 20px;
  width: 400px;
  height: 150px;
}

.imageOnSelect {
  border: 5px solid #139CD3;
}

.logoImage {
  width: 100px;
  height: 100px;
}

.Columns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
}

.logoUploader {
  width: 80% !important;
}
</style>
