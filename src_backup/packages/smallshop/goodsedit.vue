<template>
  <view class="page">
    <edit-info-panel v-model="state" :info="goodsInfo" />
    <edit-sku-panel :list="sku_list" />
    <edit-foot-btn-group :list="sku_list" :loading="isLoading" @comfirm="save" />
  </view>
</template>

<script>
// import pages from "@/mixins/pages";
import { SETGOODS, SAVEGOODS } from "@/common/interface/smallshop";


import EditInfoPanel from "./component/goodslist/edit-info-panel";
import EditSkuPanel from "./component/goodslist/edit-sku-panel";
import EditFootBtnGroup from "./component/goodslist/edit-foot-btn-group";
import { mapMutations } from "vuex";
export default {
  data () {
    return {
      goodsId: null,
      state: false,
      isLoading: false,
      goodsInfo: {
        image: [],
        name: ""
      },
      sku_list: [
        {
          sku_name: "",
          sku_id: 0,
          price: 0,
          market_price: 0,
          cost_price: 0,
          guidance_price: 0,
          stock: 0,
          bar_code: ""
        }
      ]
    };
  },
  //   mixins: [pages],
  computed: {},
  onLoad (query) {
    this.pageOption = query;
    const { goods_id, page_type } = query;
    const type = page_type || "edit";
    this.getData(goods_id, type).then(data => {
      this.goodsInfo = {
        image: data.goods_info.img_temp_array || [],
        name: data.goods_info.goods_name
      };
      this.state = !!data.state;
      data.sku_info.forEach(e => {
        e.bar_code = e.bar_code || "";
      });
      this.sku_list = data.sku_info || [];
      this.setEditGoodsSkuList(this.sku_list);
    });
  },
  beforeDestroy () {
    this.resetEditGoodsSkuList();
  },
  methods: {
    ...mapMutations(["setEditGoodsSkuList", "resetEditGoodsSkuList"]),
    getData (goods_id, type) {
      return new Promise((resolve, reject) => {
        SETGOODS({ goods_id })
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      });
    },
    save (sku_list) {
      this.isLoading = true;
      SAVEGOODS({ goods_id: this.pageOption.goods_id, sku: sku_list })
        .then(({ message }) => {
          this.$Prompt.toast(message);
          setTimeout(() => {
            this.$Navigate.push('/packages/smallshop/goodslist')
          }, 500);

        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    EditInfoPanel,
    EditSkuPanel,
    EditFootBtnGroup
  }
};
</script>

<style scope lang='scss'>
</style>
