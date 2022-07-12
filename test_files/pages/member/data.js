// 會員中心默認裝修數據
export const memberCustomData = {
  items: {
    member_fixed: {
      id: "member_fixed",
      style: {
        backgroundimage: ""
      },
      params: {
        styletype: "1"
      },
      info: {}
    },
    member_bind_fixed: {
      id: "member_bind_fixed",
      style: {
        background: "#fff",
        iconcolor: "#ff454e",
        titlecolor: "#323233",
        desccolor: "#909399"
      },
      params: {
        title: "綁定手機",
        desc: "為了賬號安全、方便購物和訂單同步，请綁定手機号码。"
      },
      info: {}
    },
    member_assets_fixed: {
      id: "member_assets_fixed",
      style: {
        background: "#fff",
        textcolor: "#323233",
        iconcolor: "#323233",
        highlight: "#ff454e",
        titlecolor: "#323233",
        titleiconcolor: "#323233",
        titleremarkcolor: "#909399"
      },
      params: {
        title: "我的資產",
        remark: "更多",
        iconclass: "v-icon-assets"
      },
      data: {
        C0_balance: {
          key: "balance",
          name: "餘額",
          text: "餘額",
          is_show: "1"
        },
        C0_points: {
          key: "points",
          name: "積分",
          text: "積分",
          is_show: "1"
        },
        C0_coupontype: {
          key: "coupontype",
          name: "優惠券",
          text: "優惠券",
          is_show: "1"
        },
        C0_giftvoucher: {
          key: "giftvoucher",
          name: "禮品券",
          text: "禮品券",
          is_show: "1"
        },
        C0_store: {
          key: "store",
          name: "消費卡",
          text: "消費卡",
          is_show: "1"
        },
        C0_blockchain: {
          key: "blockchain",
          name: "數字錢包",
          text: "數字錢包",
          is_show: "1"
        }
      },
      info: {}
    },
    member_order_fixed: {
      id: "member_order_fixed",
      style: {
        background: "#fff",
        textcolor: "#323233",
        iconcolor: "#323233",
        titlecolor: "#323233",
        titleiconcolor: "#323233",
        titleremarkcolor: "#909399"
      },
      params: {
        title: "我的訂單",
        remark: "全部訂單",
        iconclass: "v-icon-form"
      },
      data: {
        C0123456789101: {
          key: "unpaid",
          name: "待付款",
          text: "待付款",
          iconclass: "v-icon-payment2",
          is_show: "1"
        },
        C0123456789102: {
          key: "unshipped",
          name: "待發貨",
          text: "待發貨",
          iconclass: "v-icon-delivery2",
          is_show: "1"
        },
        C0123456789103: {
          key: "unreceived",
          name: "待收貨",
          text: "待收貨",
          iconclass: "v-icon-logistic3",
          is_show: "1"
        },
        C0123456789104: {
          key: "unevaluated",
          name: "待評價",
          text: "待評價",
          iconclass: "v-icon-success1",
          is_show: "1"
        },
        C0123456789105: {
          key: "aftersale",
          name: "售後",
          text: "售後",
          iconclass: "v-icon-sale",
          is_show: "1"
        }
      },
      info: {}
    }
  }
};
