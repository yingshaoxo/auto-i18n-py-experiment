<template>
  <view class="footer">
    <view class="btn-group">
          <lk-button class="btn" block square plain @click="clickSet">
            批量設定
          </lk-button>
          <lk-button class="btn" block :loading="loading" square theme-color @click="comfirm">
            保存
          </lk-button>
        </view>
    <lk-popup v-model="isShow" position="bottom" round>
      <view>
        <lk-field
          v-model="item.price"
          label="銷售價"
          type="number"
          
          placeholder="请输入銷售價"
        />
      </view>
      <view class="btn-group">
        <view class="btn">
          <lk-button
            square
            text="確定"
            size="lg"
            block
            theme
            @click="popupComfirm"
          />
        </view>
        <view class="btn">
          <lk-button
            class-name="btn"
            square
            text="批量設定"
            size="lg"
            block
            theme
            @click="closePopup"
            >取消</lk-button
          >
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showPopup: false,
      item: {
        price: "",
        market_price: "",
        stock: "",
        bar_code: ""
      },
      isShow:false
    };
  },
  props: {
    loading: Boolean
  },
  computed: {
    ...mapState({
      list: ({ smallshop }) => smallshop.editGoodsSkuList
    }),
    showQrIcon() {
      let iconName = "qr1";

      return iconName;
    }
  },
  methods: {
    clickSet() {
      this.isShow=true;
    },
    comfirm() {
      let list = this.validator(this.list);
      if (list) {
        this.$emit("comfirm", list);
      }
    },
    validator(list) {
      let flag = true;
      let newList = [];
      list.forEach(e => {
        newList.push({
          sku_id: e.sku_id,
          price: e.price,
        });
        if (isNaN(parseFloat(e.price))) {
          this.$Prompt.toast("请输入銷售價");
          flag = false;
        }
        if (parseFloat(e.price) <= 0) {
          this.$Prompt.toast("銷售價不能小于0！");
          flag = false;
        }
        console.log(parseFloat(e.price),parseFloat(e.guidance_price))
        if (parseFloat(e.price) > parseFloat(e.guidance_price)) {
          this.$Prompt.toast("銷售價不能大于指导价！");
          flag = false;
        }
        
      });
      return flag ? newList : false;
    },
    closePopup() {
      this.isShow=false;
    },
    popupComfirm() {
      for (const key in this.item) {
        if (this.item[key]) {
          this.list.forEach(e => {
            e[key] = this.item[key];
          });
        }
      }
      this.closePopup();
    },
  },
  components: {}
};
</script>

<style scoped lang="scss">
.footer {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
}

.btn-group {
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  .btn {
    flex: 1;
  }
  .confirm-color {
    color: $red;
  }
}
</style>
