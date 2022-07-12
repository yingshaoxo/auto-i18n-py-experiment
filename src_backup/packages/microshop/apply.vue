<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <apply-header :info="info" />
    <view class="cell-group" v-if="pageType">
      <lk-cell title="等級" field>
        <view class="level-box">
          <lk-tag
            class="tag"
            v-for="(item, index) in levelList"
            :key="index"
            size="large"
            :plain="levelActive != index"
            :color="levelActive === index ? theme.color : '#666'"
            @click="onChangeLevel(index)"
          >
            {{ item.level_name }}
          </lk-tag>
        </view>
      </lk-cell>
    </view>
    <goods-tab :list="goodsList" @item-click="goodsClick" />
    <view class="swiper-box">
      <lk-swiper
        v-if="details[active]"
        :height="swiperHeight"
        :list="details[active].swiperList"
      />
    </view>
    <lk-goods-info-panel
      :name="goodsInfo.title"
      :price="goodsInfo.goodsPrice"
      :origin-price="goodsInfo.marketPrice"
      :foot-info="goodsInfo.footInfo"
    />
    <view class="cell-group spec-group">
      <lk-cell is-link @click="showSku = true">
        <view slot="icon" class="title">
          規格
        </view>
        <view class="value">
          {{ specsText }}
        </view>
      </lk-cell>
    </view>
    <lk-sku
      v-if="details[active]"
      v-model="showSku"
      :info="details[active]"
      action="buy"
      @action="onSkuAction"
      @get-active-info="onGoodsInfo"
    />
    <benefit-group />
    <desc-group v-if="details[active]" :desc="details[active].description" />
    <view class="foot-btn-group fixed">
      <lk-button
        round
        block
        type="danger"
        :color="theme.gradient"
        @click="showSku = true"
      >
        <view class="btn-flex-column">
          <view>{{ btnTexts.title }}</view>
          <view>{{ btnTexts.label }}</view>
        </view>
      </lk-button>
    </view>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import applyHeader from "./component/apply/header";
import goodsTab from "./component/apply/goods-tab";
import benefitGroup from "./component/apply/benefit-group";
import descGroup from "./component/apply/desc-group";
import { GET_RENEW, GET_UPGRADE } from "@/common/interface/microshop";
import { GET_GOODSDETAIL } from "@/common/interface/goods";
import { Base64 } from "@/common/lib/base64";
const pageObj = {
  0: {
    title: "申請店主",
    button: "立即開店",
    label: "購買下麵任意禮包即可成為店主",
    type: 2
  },
  1: {
    title: "升級店主",
    button: "立即升級",
    label: "购买商品晋升相应等級",
    type: 4
  },
  2: {
    title: "續費店主",
    button: "立即續費",
    label: "购买商品晋升相应等級",
    type: 3
  }
};
export default {
  name: "packages-microshop-apply",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      /**
       * 頁面類型
       * 0 ==> 申請成為店主  默認
       * 1 ==> 升級
       * 2 ==> 續費
       */
      pageType: 0,
      info: {},

      levelActive: 0,
      levelList: [],
      goodsList: [],

      active: 0,
      details: [],
      showSku: false,
      goodsInfo: {},
      specsText: "",
      changeFlag: false,

      swiperHeight: 375
    };
  },
  watch: {
    active(e) {
      this.changeFlag = true;
    }
  },
  computed: {
    btnTexts() {
      const goodsInfo = this.goodsInfo;
      return {
        title: pageObj[this.pageType].button,
        label: goodsInfo.title ? "已選擇" + goodsInfo.title : ""
      };
    }
  },
  created() {
    const systemInfo = uni.getSystemInfoSync();
    this.swiperHeight = systemInfo.safeArea.width + "px";
  },
  onLoad(query) {
    this.pageType = query.type || 0;
    this.getMicroshopInfo().then(info => {
      if (this.pageType == 0) {
        if (info.isshopkeeper == 2) {
          return this.$Navigate.replace("/pages/microshop/index").then(() => {
            this.$Prompt.toast("您已經是店主");
          });
        }
        this.goodsList = info.microshop_set.goods_info;
        if (this.goodsList.length) {
          this.getGoodsDetail(this.goodsList[0].goods_id);
        }
      }
      if (this.pageType == 1) {
        GET_UPGRADE().then(({ data }) => {
          //判断是否是最高等級
          if (data.length == 0) {
            return this.$Navigate.replace("/pages/microshop/index").then(() => {
              this.$Prompt.toast("您当前已是最高等級");
            });
          }
          const levels = data || [];
          this.levelList = levels;
          this.goodsList = this.levelList[0].goods_info;
          if (this.goodsList.length) {
            this.getGoodsDetail(this.goodsList[0].goods_id);
          }
        });
      }
      if (this.pageType == 2) {
        if (info.is_default_shopkeeper) {
          return this.$Navigate.replace("/pages/microshop/index").then(() => {
            this.$Prompt.toast("您不能續費");
          });
        }
        GET_RENEW().then(({ data }) => {
          const levels = [data || {}];
          this.levelList = levels;
          this.goodsList = this.levelList[0].goods_info;
          if (this.goodsList.length) {
            this.getGoodsDetail(this.goodsList[0].goods_id);
          }
        });
      }
      this.info = {
        isshopkeeper: info.isshopkeeper,
        shopkeeper_id: info.uid,
        avatar: info.user_headimg,
        title: info.member_name,
        label: pageObj[this.pageType].label
      };
      this.pageStyle.title = pageObj[this.pageType].title;
    });
  },
  methods: {
    ...mapActions(["getMicroshopInfo"]),
    getGoodsDetail(goods_id) {
      return new Promise((resovle, reject) => {
        GET_GOODSDETAIL(
          {
            goods_id,
            mic_goods: 1 //微店必傳
          },
          { isShowLoading: true }
        ).then(({ data }) => {
          let goodsData = this.packageGoodsData(data);
          this.details.push(goodsData);
          resovle(data);
        });
      });
    },
    goodsClick(index) {
      const item = this.goodsList[index];
      if (this.details[index]) {
        this.active = index;
      } else {
        this.getGoodsDetail(item.goods_id).then(() => {
          this.active = index;
        });
      }
    },
    // 組裝商品所需數據
    packageGoodsData(data) {
      let info = {};
      // 組裝sku所需數據格式
      info = data.goods_detail;
      info.goods_image = data.goods_detail.goods_image_yun;
      info.is_allow_buy =
        typeof data.is_allow_buy == "boolean" ? data.is_allow_buy : true;
      info.swiperList = data.goods_detail.goods_images.map(e => ({ image: e }));
      return info;
    },
    // sku觸發事件
    onSkuAction(action, data) {
      let params = {};
      let shopkeeper_id = "";
      params.sku_list = [];
      params.order_type = pageObj[this.pageType].type;
      let sku_list_obj = {};
      sku_list_obj.num = data.selectedNum || 1;
      sku_list_obj.sku_id = data.selectedSkuComb.id; //sku的Id
      params.sku_list.push(sku_list_obj);
      if (params.order_type != 2) {
        // 升級或續費 需帶上店主id
        shopkeeper_id = this.info.shopkeeper_id;
      }
      // return console.log(params,shopkeeper_id);
      this.$Navigate.push({
        path: "/packages/microshop/order/confirm",
        query: {
          params: JSON.stringify(params),
          shopkeeper_id: shopkeeper_id
        }
      });
    },
    onGoodsInfo(data) {
      const goodsData = this.details[this.active];
      this.goodsInfo = {
        ...data,
        footInfo: [{ name: "庫存:", value: data.stock }]
      };
      if (data.isHasSku) {
        this.specsText = data.selectedSkuComb
          ? data.selectedSkuComb.sku_name
          : "请选择規格";
      } else {
        this.specsText = "已選：" + data.selectedNum + "件";
      }
    },
    onChangeLevel(index) {
      this.levelActive = index;
      this.goodsList = this.levelList[index].goods_info;
      // 初始化商品
      this.active = 0;
      this.details = [];
      this.showSku = false;
      this.goodsInfo = {};
      this.specsText = "";
      if (this.goodsList.length) {
        this.getGoodsDetail(this.goodsList[0].goods_id);
      }
    }
  },
  components: {
    applyHeader,
    goodsTab,
    benefitGroup,
    descGroup
  }
};
</script>

<style lang="scss" scoped>
.pages {
  margin-bottom: 190rpx;
}
.swiper-box {
  position: relative;
  width: 100%;
  height: 100vw;
}

.cell-group {
  margin: 20rpx 0;
}
.level-box {
  .tag {
    margin-right: 10rpx;
  }
}
.spec-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }
  .value {
    color: $text-light;
  }
}
.btn-flex-column {
  display: flex;
  flex-flow: column;
  line-height: 1.2;
  font-size: $font-size-sm;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  view {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 auto;
    max-width: 400rpx;
  }
}
.foot-btn-group {
  background: transparent;
}
</style>
