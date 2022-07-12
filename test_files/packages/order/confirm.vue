<template>
  <view class="pages">
    <block v-if="isShowShipping">
      <lk-cell field title="配送方式" v-if="!noExpress && isPickup">
        <lk-radio-group v-model="shipping_type" :active-color="theme.color">
          <lk-radio :name="1">快遞配送</lk-radio>
          <lk-radio :name="2">線下自提</lk-radio>
        </lk-radio-group>
      </lk-cell>
      <view class="shipping-tip" v-if="shippingTip">{{ shippingTip }}</view>
      <view v-if="isShowAddress">
        <lk-choice-address :info="address" @select="onAddress" />
      </view>
    </block>
    <cell-pay-type-group v-if="isDpay" v-model="payType" />

    <form-group v-if="isForm" :items="formList" ref="formGroup" />

    <view class="list">
      <view class="items card-group-box" v-for="(item, index) in items" :key="index">
        <lk-cell :title="item.shop_name" icon="shop-o" />
        <lk-goods-card v-for="child in item.goods_list" :key="child.goods_id" cell-padding :title="child.goods_name"
          :desc="child.spec" :price="child.discount_price" :image="child.goods_pic">
          <view slot="num">
            <lk-stepper v-if="
              orderType === 'buy_now' &&
                params.goodsType != 4 &&
                params.goodsType != 6 &&
                !params.luckyspell_id
            " integer v-model="params.sku_list[0].num" :disabled="disabledStepper" disable-input
              @change="onStepperChange" :max="child.quota" :min="child.least" />
            <view class="goods-num" v-else>x{{ child.num }}</view>
          </view>
        </lk-goods-card>
        <cell-presell v-if="params.presell_id" :info="item.presell_info" />
        <cell-store-group v-if="!isVirtualGoods" :title="item.cellShippingText" :value="item.cellShippingValue"
          :is-link="item.isSelectStore" ref="store-group" :store_id="item.store_id" :list="item.store_list"
          @show-popup="onPopupStore(index)" @select="onStore" />
        <!-- 優惠券 -->
        <cell-coupon-group v-if="item.coupon_num > 0" :shop-name="item.shop_name" :coupon-num="item.coupon_num"
          :coupon-name="item.coupon_name" :list="item.coupon_list" :items="items" :coupon-use="item.is_use_coupon"
          :receive-goodsuse="item.receive_goods_code_used ? 1 : 2" @use="onUseCoupon" />
        <!-- 領貨碼 -->
        <cell-cargo-group v-if="item.receive_goods_code && item.receive_goods_code.copy_writing"
          :cargo-num="item.receive_goods_code.count" :cargo-name="item.receive_goods_code_used"
          :lists="item.receive_goods_code.data" :is_use_manys="item.receive_goods_code.is_use_many" :items="items"
          :goods-list="item.goods_list" :is_use_many="item.goods_list.is_use_many" :shop_id="item.shop_id"
          :receivegoodscode="member.info.receivegoodscode" :isreceivegoodscodeused="isreceivegoodscodeused"
          :coupon-use="item.is_use_coupon" :coupon-list="item.coupon_promotion > 0 ? 1 : 2" :cleararrcode="cleararrcode"
          @use="onUseCargo" />
        <cell-invoice-group :tax_fee="item.tax_fee" :shop_id="item.shop_id" :price="item.amount_for_coupon_discount"
          @get-invoice="getInvoice" />
        <lk-field label="買家留言" v-model="item.leave_message" placeholder="選填：留言內容盡量和商家溝通" rows="1" autosize />
        <lk-cell-full-cut v-if="item.full_cut.rule_id" :items="item.full_cut" />
        <lk-cell>
          <view class="shop-foot">
            <text>共</text>
            <view class="num">{{ item.goods_num }}</view>
            <text>件商品，小計：</text>
            <view class="price first-letter">
              {{ item.shop_amount | yuan }}
            </view>
          </view>
        </lk-cell>
      </view>
      <cell-point-deduct :is-point-deduct="isPointDeduct" :info="pointInfo" @load-data="onPointDeduct" />

      <cell-membercard v-if="isMembercard" :info="membercard_info"
        :total_memebrcard_deduction="total_memebrcard_deduction" @load-data="onMembercard" />

      <lk-cell-info-list :list="cellInfoGroup" card align="right" />
    </view>

    <cell-purrule-group v-model="isPurruleChecked" />

    <view>
      <lk-submit-bar :showsubscribe="true" :price="order_data.total_amount" button-text="提交訂單" :disabled="isDisabled"
        :loading="isLoading" @submit="onSubmit" />
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import {
  GET_ORDERINFO,
  CREATE_ORDER,
  PAY_DPAY
} from "@/common/interface/order";
import { yuan, isEmpty } from "@/common/utils";
import formGroup from "@/components/custom/form-group";

import cellPayTypeGroup from "./component/cell-pay-type-group";
import cellPresell from "./component/cell-presell";
import cellInvoiceGroup from "./component/cell-invoice-group";
import cellPointDeduct from "./component/cell-point-deduct";
import cellCouponGroup from "./component/cell-coupon-group";
import cellStoreGroup from "./component/cell-store-group";
import cellMembercard from "./component/cell-membercard";
import cellCargoGroup from "./component/cell-cargo-group";
import cellPurruleGroup from "./component/cell-purrule-group";

// 計算店鋪商品數量總和
function shopGoodsAmount(item) {
  const arr = item.map(({ num }) => num);
  return arr.reduce((x, y) => x + y);
}
// 過濾規格數組
function filterSpec(value) {
  if (isEmpty(value)) return "";
  let newArr = [];
  value.forEach(e => {
    let str = e.spec_name + " " + e.spec_value_name;
    newArr.push(str);
  });
  return newArr.join(" , ");
}
export default {
  name: "packages-order-confirm",
  data() {
    return {
      params: {},
      orderType: "", //提交類型 cart ==> 購物車 /  buy_now ==> 立即購買

      address: {},
      items: null,
      goods_amount: 0, // 总商品小計
      promotion_amount: 0, // 總優惠券金額
      total_shipping: 0, // 總運費
      total_amount: 0, // 結算金額
      receive_goods_code_deduct: 0, //領貨碼優惠金额
      pointInfo: {},
      isPointDeduct: false, //是否可以積分抵扣
      isGivePoint: false, //是否購物返積分
      givePoint: 0,

      isLoading: false,
      disabledStepper: false,

      isPickup: 0, // 是否可以線下自提 1為可以
      noExpress: 0, //是否可以快遞配送 默認為0 可以，其他表示為不可快遞配送

      formList: [],

      shipping_type: 1,

      payType: 1, //支付方式  默認在線支付

      is_tax_fee: 0, //是否打開發票
      total_tax: 0,
      invoice_list: [],
      shop_id_list: [],
      shop_invoice_list: [],
      membercard_info: {}, //會員卡
      total_memebrcard_deduction: "", //會員卡抵扣金额
      show_receive_use: [], //領貨碼 展示使用情況

      isPurruleChecked: false, // 購買等級協議

      isreceivegoodscodeused: [], //后台返回的領貨碼
      cleararrcode: "", //商品數量+- 清空領貨碼

      ws_token: "" //提交訂單 socket 標識
    };
  },
  watch: {
    shipping_type(e) {
      if (e) {
        if (e == 2) {
          this.params.shipping_type = e;
        } else {
          delete this.params.shipping_type;
          this.params.sku_list.forEach(s => {
            s.store_id = 0;
            s.store_name = null;
          });
        }
        this.getData(true);
      }
    }
  },
  computed: {
    ...mapState({
      mallConfig: ({ config }) => config,
      addons: ({ config }) => config.addons,
      payConfig: ({ config }) => config.payConfig,
      member: ({ member }) => member
    }),
    ...mapGetters(["orderFrom"]),
    cellInfoGroup() {
      const {
        goods_amount,
        promotion_amount,
        total_shipping,
        isGivePoint,
        givePoint,
        receive_goods_code_deduct
      } = this.$data;
      let arr = [];
      if (isGivePoint && givePoint > 0) {
        arr.push({
          title: "獲得" + this.member.texts.point_style,
          value: givePoint,
          color: "#ff454e"
        });
      }
      arr.push({
        title: "商品小計",
        value: yuan(goods_amount),
        color: "#ff454e"
      });
      if (!this.params.presell_id && !this.isVirtualGoods) {
        arr.push({
          title: "運費",
          value: yuan(total_shipping),
          color: "#ff454e"
        });
      }
      if (receive_goods_code_deduct > 0) {
        arr.push({
          title: this.member.info.receivegoodscode.copy_writing + "優惠",
          value: yuan(receive_goods_code_deduct),
          color: "#ff454e"
        });
      }
      arr.push({
        title: "優惠金额",
        value: yuan(promotion_amount),
        color: "#ff454e"
      });
      if (this.is_tax_fee) {
        arr.push({
          title: "稅費",
          value: yuan(this.total_tax),
          color: "#ff454e"
        });
      }

      return arr;
    },
    order_data() {
      const items = this.items;
      const obj = {};
      obj.custom_order = "";
      obj.order_from = this.orderFrom;
      obj.is_deduction = this.params.is_deduction ? 1 : 0;
      obj.is_membercard_deduction = this.params.is_membercard_deduction ? 1 : 0;
      obj.total_amount = this.total_amount > 0 ? this.total_amount : 0;
      if (this.ws_token) {
        obj.ws_token = this.ws_token;
      }
      if (this.orderType === "cart") {
        obj.cart_from = this.params.cart_from || 1;
      }
      if (this.shipping_type !== 0) {
        obj.shipping_type = this.shipping_type;
        obj.address_id = this.address.id;
      }
      if (this.isOfflineGoods) {
        //線下商品（計時/計次商品）配送方式為門店自提
        obj.shipping_type = 2;
      }
      if (this.params.group_id) {
        obj.group_id = this.params.group_id;
        if (this.params.record_id) obj.record_id = this.params.record_id;
      }
      if (this.params.luckyspell_id) {
        obj.luckyspell_id = this.params.luckyspell_id;
      }
      if (this.params.shopkeeper_id) {
        obj.shopkeeper_id = this.params.shopkeeper_id;
      }
      obj.shop_list = [];
      if (!items) return {};
      items.forEach(e => {
        let shop_obj = {};

        shop_obj.leave_message = e.leave_message;
        shop_obj.shop_id = e.shop_id;
        shop_obj.rule_id = e.full_cut.rule_id ? e.full_cut.rule_id : "";
        shop_obj.coupon_id = e.coupon_id;

        shop_obj.shop_amount =
          e.shop_amount <= 0 ? (e.shop_amount = 0) : e.shop_amount;
        if (this.shipping_type == 2) {
          if (this.isOfflineGoods) {
            shop_obj.card_store_id = e.store_id;
          } else {
            shop_obj.store_id = e.store_id;
            shop_obj.has_store = e.has_store;
          }
        }
        // 發票
        if (this.is_tax_fee) {
          this.shop_invoice_list.forEach(i_item => {
            if (shop_obj.shop_id == i_item.shop_id) {
              shop_obj.invoice = i_item.invoice;
              shop_obj.invoice.invoice_tax =
                e.tax_fee[i_item.invoice.invoice_tax_key];
            }
          });
        }

        //領貨碼 創建訂單

        shop_obj.goods_list = [];
        shop_obj.receive_goods_code = [];
        e.goods_list.forEach(g => {
          let goods_obj = {};
          if (
            g.receive_goods_code_used &&
            g.receive_goods_code_used.length > 0
          ) {
            g.receive_goods_code_used.forEach(w => {
              shop_obj.receive_goods_code.push(w);
            });
          }

          goods_obj.goods_id = g.goods_id;
          goods_obj.goods_name = g.goods_name;
          goods_obj.sku_id = g.sku_id;
          goods_obj.price = g.price;
          goods_obj.num = g.num;
          goods_obj.discount_price = g.discount_price;
          goods_obj.seckill_id = g.seckill_id || "";
          goods_obj.channel_id = g.channel_id || "";
          goods_obj.discount_id = g.discount_id;
          goods_obj.bargain_id = g.bargain_id || "";
          goods_obj.presell_id = this.params.presell_id || "";
          goods_obj.anchor_id = g.anchor_id || "";
          shop_obj.goods_list.push(goods_obj);
          if (g.custom_id) {
            obj.custom_id = g.custom_id;
          }
        });
        obj.shop_list.push(shop_obj);
      });
      // console.log("order_data==", obj);
      return obj;
    },
    isDisabled() {
      let flag =
        this.order_data.total_amount >= 0 &&
        this.order_data.total_amount !== undefined
          ? false
          : true;
      if (this.mallConfig.pur_rule && !flag) {
        flag = !this.isPurruleChecked;
      }
      return flag;
    },
    isForm() {
      return !isEmpty(this.formList);
    },
    isMembercard() {
      return this.addons.membercard && !isEmpty(this.membercard_info); //是否顯示會員抵扣
    },
    // 是否顯示配送
    isShowShipping() {
      return (
        !this.isVirtualGoods &&
        !this.isOfflineGoods &&
        !this.isCourseGoods &&
        !this.isCardPasswordGoods
      );
    },
    // 是否顯示配送地址
    isShowAddress() {
      let flag = true;
      if (this.shipping_type == 2 && this.items) {
        flag = !this.items.every(({ has_store }) => parseInt(has_store));
      }
      return flag;
    },
    // 配送/自提相關提示
    shippingTip() {
      let text = null;
      if (this.noExpress) {
        // 该单不可快遞配送文案提示
        text = "由於部分商品商城缺貨，只能通过線下自提下单取货。";
      } else {
        if (this.shipping_type == 2 && this.items) {
          // 線下自提时，多店鋪情況下，部分店鋪不支持自提文案提示
          if (!this.items.every(({ has_store }) => parseInt(has_store))) {
            text =
              "由于部分商家不支持線下自提，请為不支持線下自提的訂單商品选择收货地址";
          }
        }
      }
      return text;
    },
    // 是否虛擬商品(預約商品也算虛擬商品處理)
    isVirtualGoods() {
      let flag = false;
      if (
        this.orderType === "buy_now" &&
        (this.params.goodsType == 3 || this.params.goodsType == 6)
      ) {
        flag = true;
      }
      return flag;
    },
    // 是否線下商品(計時/次商品)
    isOfflineGoods() {
      let flag = false;
      if (this.orderType === "buy_now" && this.params.goodsType == 0) {
        flag = true;
      }
      return flag;
    },
    // 是否知識付費商品
    isCourseGoods() {
      let flag = false;
      if (this.orderType === "buy_now" && this.params.goodsType == 4) {
        flag = true;
      }
      return flag;
    },
    // 是否電子卡密商品
    isCardPasswordGoods() {
      let flag = false;
      if (this.orderType === "buy_now" && this.params.goodsType == 5) {
        flag = true;
      }
      return flag;
    },
    // 貨到付款
    isDpay() {
      return (
        !this.params.presell_id &&
        !this.isOfflineGoods &&
        !this.isVirtualGoods &&
        !this.isCourseGoods &&
        !this.isCardPasswordGoods &&
        this.payConfig.dPay
      );
    },
    // 门店購物車訂單
    isStoreCartOrder() {
      return this.params.cart_from == 2;
    }
  },
  onLoad(options) {
    const params = JSON.parse(decodeURIComponent(options.params));
    // cart_from  購物車来源 1=>平台購物車 2=>门店購物車
    // goodsType 商品類型 1==> 普通商品  0 ==> 線下商品（計時计次） 3 ==> 虛擬商品
    let shipping_type = 1; // 配送方式 1==> 快遞  2==> 自提  0 ==> 虛擬（无）
    if (params.order_tag == "buy_now") {
      if (
        params.goodsType == 3 ||
        params.goodsType == 4 ||
        params.goodsType == 5 ||
        params.goodsType == 6
      ) {
        shipping_type = 0;
      } else if (params.goodsType == 0 || params.sku_list[0].store_id) {
        // 計時計次商品或门店商品
        shipping_type = 2;
      }
    }
    this.params = params;
    this.orderType = params.order_tag;
    this.shipping_type = shipping_type;

    this.getData(true);
  },
  onUnload() {
    if (this.socketTask) {
      this.socketTask.close();
    }
  },
  methods: {
    ...mapActions(["getLocation", "setSubscribe"]),
    onAddress(address) {
      this.address = address;
      this.params.address_id = address.id;
      this.getData(true);
    },
    cellShippingValue({ shipping_fee, store_name, has_store }) {
      // has_store  是否可以選擇門店，為1可以選擇門店則否
      const $this = this;
      if ($this.isOfflineGoods) {
        return store_name || "請選擇門店";
      }
      let text = "";
      if ($this.shipping_type == 1) {
        fnText();
      }
      if ($this.shipping_type == 2) {
        if (has_store) {
          text = store_name || "請選擇自提門店";
        } else {
          fnText();
        }
      }
      function fnText() {
        text = "快遞 ¥" + shipping_fee;
        if (parseFloat(shipping_fee) == 0) {
          text = $this.params.presell_id ? "快遞" : "快遞 包郵";
        }
        if (!$this.address.id) {
          text = "未選擇收貨地址";
        }
      }
      return text;
    },
    isSelectStore(item) {
      return !!(
        this.isOfflineGoods ||
        (item.has_store && this.shipping_type == 2)
      );
    },
    onPopupStore(index) {
      const item = this.items[index];
      this.$refs["store-group"][index].show = this.isSelectStore(item);
      item.store_show = this.isSelectStore(item);
    },
    onStepperChange(value) {
      if (this.orderType === "buy_now") {
        this.disabledStepper = true;
        this.params.sku_list.forEach(e => {
          e.receive_goods_code = [];
          e.coupon_id = 0;
        });
        this.cleararrcode = value;
        this.getData(true);
      }
    },
    onStepperLimit(action) {
      if (action === "plus") {
        this.$Prompt.toast("已超出最大購買數！");
      } else {
        this.$Prompt.toast("至少選擇一件！");
      }
    },
    onPointDeduct(checked) {
      this.params.is_deduction = checked ? 1 : 0;
      this.getData(true);
    },
    onMembercard(checked) {
      this.params.is_membercard_deduction = checked ? 1 : 0;
      this.getData(true);
    },
    getDataLocation() {
      return new Promise((resolve, reject) => {
        if (this.shipping_type == 2 || this.isOfflineGoods) {
          this.getLocation({ showLoading: true }).then(res => {
            this.params.lng = res.lng;
            this.params.lat = res.lat;
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    // 連接socket
    connectSocket(options = {}) {
      if (this.socketTask) {
        return this.socketTask;
      }
      this.socketTask = uni.connectSocket({
        ...options,
        complete: e => {}
      });
      this.socketTask.onMessage(res => {
        const taskData = res.data ? JSON.parse(res.data) : {};
        try {
          // console.log("socket:message", taskData);
          if (taskData.code >= 0) {
            if (taskData.code === 0) {
              // 訂單創建成功
              this.$Prompt.clear();
              this.clearDetailForm();
              if (this.payType) {
                this.$Navigate.replace({
                  path: "/pay/payment",
                  query: {
                    out_trade_no: taskData.data.out_trade_no
                  }
                });
              } else {
                this.onDpay(taskData.data.out_trade_no);
              }
              this.isLoading = false;
            } else {
              this.ws_token = taskData.data;
            }
          } else {
            this.$Prompt
              .modal({
                content: taskData.message || "message為空",
                showCancel: false
              })
              .then(() => {
                this.$Navigate.back();
              });
          }
        } catch (error) {
          console.log(error, taskData);
        }
      });
      this.socketTask.onOpen(e => {
        // console.log("socket:open", e);
      });
      this.socketTask.onClose(e => {
        // console.log("socket:close", e);
      });
      this.socketTask.onError(e => {
        console.log("socket:error", e);
      });
    },
    getData(isShowLoading) {
      const $this = this;
      this.getDataLocation().then(() => {
        GET_ORDERINFO($this.params, { isShowLoading })
          .then(({ data, message, code }) => {
            if (message) $this.$Prompt.toast(message);

            if (data.websorket_url) {
              this.connectSocket({
                url: data.websorket_url
              });
            }

            this.params.sku_list.forEach(e => {
              e.receive_goods_code = [];
              data.shop.forEach(i => {
                if (e.shop_id == i.shop_id) {
                  if (i.receive_goods_code_used) {
                    i.receive_goods_code_used.forEach(b => {
                      e.receive_goods_code.push(b.base64_has_key_code);
                    });
                  }
                }
              });
            });

            $this.goods_amount = data.goods_amount;
            $this.promotion_amount = data.promotion_amount;
            $this.total_shipping = data.total_shipping;
            $this.total_amount = data.amount;
            $this.membercard_info = data.membercard_info || {};
            $this.total_memebrcard_deduction = data.total_memebrcard_deduction;
            $this.isPickup = parseInt(data.has_store);
            $this.noExpress = data.has_express;
            $this.receive_goods_code_deduct = data.receive_goods_code_deduct;
            if ($this.noExpress) {
              $this.shipping_type = 2;
            }
            if (!isEmpty(data.address)) {
              let addressDetail = "";
              if (data.address.type == 1) {
                // 國際地址
                addressDetail =
                  data.address.chinese_country_name +
                  data.address.address_detail;
              } else {
                addressDetail =
                  data.address.province_name +
                  data.address.city_name +
                  data.address.district_name +
                  data.address.address_detail;
              }
              $this.address = {
                name: data.address.consigner,
                tel: data.address.mobile,
                id: data.address.address_id,
                address: addressDetail
              };
            }
            $this.items = data.shop.map((e, i) => {
              e.leave_message = $this.items ? $this.items[i].leave_message : "";
              e.shop_amount = e.total_amount;
              e.goods_num = shopGoodsAmount(e.goods_list);
              e.goods_list.forEach(g => {
                g.spec = filterSpec(g.spec);
                g.stock = g.stock || 0;
                g.num = g.num < g.least ? g.least : g.num;
                g.quota =
                  g.max_buy === 0
                    ? g.stock
                    : g.stock > g.max_buy
                    ? g.max_buy
                    : g.stock;
                g.least = g.least_buy || 1;
              });
              //領貨碼相关
              if (
                e.receive_goods_code &&
                e.receive_goods_code_used &&
                e.receive_goods_code_used.length &&
                e.receive_goods_code_used[0].base64_has_key_code
              ) {
                e.code_show = false;
                e.code_id = "";

                e.receive_goods_code_used.forEach(e1 => {
                  if (e1.discount_type == 1) {
                    e1.code_name = "優惠金额:全額滿減。" + e1.goods_name;
                  } else {
                    e1.code_name =
                      "優惠金额:" + e1.discount_price + "￥。" + e1.goods_name;
                  }

                  e.receive_goods_code.data.forEach(c => {
                    c.shop_id = e.shop_id;
                    c.selected = false;
                    c.loading = false;
                  });
                });

                this.show_receive_use = e.receive_goods_code_used;
              }

              // 優惠券相關
              let current_coupon_id = e.goods_list[0].coupon_id;
              e.coupon_show = false;
              e.coupon_id = "";
              e.coupon_name = "";
              e.coupon_list.forEach(c => {
                c.shop_id = e.shop_id;
                c.selected = false;
                c.loading = false;
              });
              if (current_coupon_id) {
                e.coupon_list.forEach(c => {
                  if (c.coupon_id == current_coupon_id) {
                    e.coupon_id = c.coupon_id;
                    e.coupon_name = c.coupon_name;
                    c.selected = true;
                    c.loading = !c.selected;
                  }
                });
              }

              if (e.tax_fee) {
                $this.is_tax_fee = 1;
                $this.total_tax = data.total_tax;
              }

              // 門店相關
              e.store_show = false;
              e.store_id = e.store_id || "";
              e.store_name = e.store_name || "";
              e.cellShippingText = this.isOfflineGoods
                ? "使用門店"
                : "配送方式";
              e.cellShippingValue = this.cellShippingValue(e);
              e.isSelectStore = this.isSelectStore(e);

              // 預售相關
              if ($this.params.presell_id) {
                e.goods_list.forEach(g => {
                  g.presell_price = e.presell_info.allmoney;
                  e.presell_info.frontMoney =
                    parseFloat(e.presell_info.firstmoney) * parseInt(g.num); // 計算定金
                  e.presell_info.tailMoney = parseFloat(
                    e.presell_info.final_real_money
                  ); // 計算尾款
                  e.presell_info.tailText =
                    "(含運費" + (e.tax_fee ? "稅費" : "") + ")";
                  g.stock = e.presell_info.presellnum;
                  g.max_buy = e.presell_info.maxbuy;
                });
              }
              return e;
            });

            this.isreceivegoodscodeused = $this.items;

            // 是否開啟積分抵扣
            $this.isPointDeduct = parseInt(data.is_point_deduction)
              ? true
              : false;
            $this.pointInfo = data.deduction_point;
            // 是否開啟購物返積分
            $this.isGivePoint = parseInt(data.is_point) ? true : false;
            $this.givePoint = data.total_give_point;

            if ($this.orderType === "buy_now") {
              $this.disabledStepper = false;
            }
            $this.formList = !isEmpty(data.customform) ? data.customform : [];
          })
          .catch(({ code, message }) => {
            $this.$Prompt
              .modal({ content: message, showCancel: false })
              .then(() => {
                if (code == -1) {
                  $this.$Navigate.back();
                }
                if (code == -2) {
                  $this.$Navigate.replace("/pages/mall/cart");
                }
              });
          });
      });
    },
    // 選擇門店
    onStore({ shop_id, store_id, store_name }) {
      this.items.forEach(shop => {
        if (shop.shop_id == shop_id) {
          shop.store_id = store_id;
          shop.store_name = store_name;
          this.params.sku_list.forEach((s, i) => {
            const goods_item = shop.goods_list.filter(
              g => g.sku_id == s.sku_id
            )[0];
            if (goods_item) {
              s.store_id = store_id;
              s.store_name = store_name;
            }
          });
          this.getData(true);
        }
      });
    },
    //使用領貨碼
    onUseCargo(item) {
      this.items.forEach(shop => {
        if (shop.shop_id == item.shop_id) {
          shop.receive_goods_code_base = item.receive_goods_code_base;
          shop.coupon_list = shop.coupon_list.map(c => {
            c.selected =
              c.receive_goods_code_base == item.receive_goods_code_base
                ? true
                : false;
            c.loading = c.selected;
            return c;
          });
          this.params.sku_list.forEach((s, i) => {
            const goods_item = shop.goods_list.filter(
              g => g.sku_id == s.sku_id
            )[0];
            if (goods_item) {
              s.receive_goods_code = item.receive_goods_code_base;
            }
          });
          this.getData(true);
        }
      });
    },
    // 使用優惠券
    onUseCoupon(item) {
      const flag = this.items.some(({ coupon_id }) => {
        if (coupon_id == item.coupon_id) {
          this.$Prompt.toast("該優惠券只能使用一次！");
          return true;
        }
      });
      if (!flag) {
        this.items.forEach(shop => {
          if (shop.shop_id == item.shop_id) {
            shop.coupon_id = item.coupon_id;
            shop.coupon_list = shop.coupon_list.map(c => {
              c.selected = c.coupon_id == item.coupon_id ? true : false;
              c.loading = c.selected;
              return c;
            });
            this.params.sku_list.forEach((s, i) => {
              const goods_item = shop.goods_list.filter(
                g => g.sku_id == s.sku_id
              )[0];
              if (goods_item) {
                s.coupon_id = item.coupon_id;
              }
            });
            this.getData(true);
          }
        });
      }
    },
    //訂單創建成功 清除商品詳情數據
    clearDetailForm() {
      let pages = getCurrentPages(); //當前頁
      let beforePage = pages[pages.length - 2]; //上個頁面
      if(beforePage){
      // #ifdef H5
      if (isEmpty(beforePage.formList)) return;
      // #endif
      // #ifndef H5
      if (isEmpty(beforePage.$vm.formList)) return;
      // #endif
      uni.$emit("clearDetailForm", { msg: "提交訂單成功！" });
      }
    },
    onSubmit() {
      this.setSubscribe({ node_id: 8 }).then(res => {
        const $this = this;
        let orderData = {
          ...$this.order_data
        };
        orderData.shop_list.forEach(e => {
          e.receive_goods_code = [];
          this.isreceivegoodscodeused.forEach(i => {
            if (e.shop_id == i.shop_id) {
              if (i.receive_goods_code_used) {
                i.receive_goods_code_used.forEach(b => {
                  e.receive_goods_code.push(b.base64_has_key_code);
                });
              }
            }
          });
        });
        const form_data = $this.$refs["formGroup"]
          ? $this.$refs["formGroup"].getFormData()
          : "";

        if ($this.isForm) {
          if (!form_data) return false;

          // 預約商品，需提交預約日期
          if (orderData.custom_id) {
            let day_time = "";
            let hours_time = "";
            form_data.forEach(e => {
              if (e.tag == "schedule") {
                let val = e.value.split(",");
                day_time = val[0] || "";
                hours_time = val[1] || "";
              }
            });
            if (day_time) {
              orderData.day_time = day_time;
            }
            if (hours_time) {
              orderData.hours_time = hours_time;
            }
          }
          orderData.custom_order = JSON.stringify(form_data);
        }

        if ($this.shipping_type == 1) {
          if (!orderData.address_id)
            return $this.$Prompt.toast("請選擇收貨地址！");
        }
        if ($this.shipping_type == 2) {
          if ($this.isOfflineGoods) {
            //計時計次商品判断card_store_id
            if (
              !orderData.shop_list.every(({ card_store_id }) => card_store_id)
            ) {
              return $this.$Prompt.toast("請選擇門店！");
            }
          } else {
            const flag = orderData.shop_list.some(
              ({ store_id, has_store }, i) => {
                if (!has_store && !orderData.address_id) {
                  return $this.$Prompt.toast(
                    $this.items[i].shop_name + "需要選擇收貨地址！"
                  );
                }
                if (has_store && !store_id) {
                  return $this.$Prompt.toast(
                    $this.items[i].shop_name + "需要選擇自提門店！"
                  );
                }
              }
            );
            if (flag) return false;
          }
        }

        // return console.log(orderData);

        $this.isLoading = true;
        CREATE_ORDER(
          { order_data: orderData },
          {
            isStoreOrder: orderData.shipping_type == 2,
            loadingText: "提交中"
          }
        )
          .then(({ code, data, message }) => {
            if (code === 1 && this.socketTask) {
              // 訂單創建中,監聽socket返回的狀態
              this.$Prompt.loading(message || "創建中");
              return;
            }
            this.clearDetailForm();
            if ($this.payType) {
              $this.$Navigate.replace({
                path: "/pay/payment",
                query: {
                  out_trade_no: data.out_trade_no
                }
              });
            } else {
              $this.onDpay(data.out_trade_no);
            }
          })
          .catch(({ code, message }) => {
            if (code == -2) {
              this.getData(true);
            }
            $this.isLoading = false;
          });
      });
    },
    onDpay(out_trade_no) {
      PAY_DPAY({ out_trade_no })
        .then(() => {
          this.$Navigate.replace({
            path: "/packages/pay/result",
            query: {
              out_trade_no,
              dpay_order: 1
            }
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    //發票
    getInvoice(invoice, shop_id, is_tax) {
      const $this = this;

      let obj = {};
      obj.shop_id = shop_id;
      obj.tax_type = is_tax == 1 ? invoice.type : 0;

      let bill = {};
      bill.shop_id = shop_id;
      bill.invoice = is_tax == 1 ? invoice : {};

      if ($this.shop_id_list.indexOf(shop_id) == -1) {
        $this.shop_id_list.push(shop_id);
        $this.invoice_list.push(obj);
        $this.shop_invoice_list.push(bill);
      } else {
        $this.invoice_list.forEach(e => {
          if (e.shop_id == shop_id) {
            e.tax_type = is_tax == 1 ? invoice.type : 0;
          }
        });
        $this.shop_invoice_list.forEach(e => {
          if (e.shop_id == shop_id) {
            e.invoice = is_tax == 1 ? invoice : {};
          }
        });
      }
      $this.params.invoice_list = $this.invoice_list;
      $this.getData(true);
    }
  },
  components: {
    formGroup,
    cellPayTypeGroup,
    cellPresell,
    cellInvoiceGroup,
    cellPointDeduct,
    cellCouponGroup,
    cellStoreGroup,
    cellMembercard,
    cellCargoGroup,
    cellPurruleGroup
  }
};
</script>

<style lang="scss" scoped>
.pages {
  padding-bottom: 200rpx;

  .shop-foot {
    display: flex;
    flex-flow: row;
    justify-content: flex-end;

    .num,
    .price {
      padding: 0 8rpx;
    }

    .price {
      color: $red;
    }
  }

  .goods-num {
    font-size: $font-size-sm;
    color: $text-light;
  }

  .shipping-tip {
    padding: 20rpx;
    color: #f56723;
    font-size: $font-size-sm;
    line-height: 1.5;
    background-color: #fff7cc;
  }
}
</style>
