<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <!-- #ifndef H5 -->
    <lk-navbar
      immersive
      :title-color="nbStyle.color"
      :back-icon-color="nbStyle.color"
      route-title
      :background="{ background: nbStyle.background }"
    />
    <!-- #endif -->
    <lk-header-panel
      top-bar
      :avatar="info.user_headimg"
      :name="info.member_name"
      margin-bottom="-80"
    >
      <view class="info">
        <view class="text-item" v-for="(item, index) in agentInfo" :key="index">
          <text>{{ item.name }}：</text>
          <text @click="toLink(item.levelLink)">
            {{ item.level_name || "- -" }}
          </text>
        </view>
      </view>
    </lk-header-panel>
    <view class="card-panel card-group-box" v-if="isBonus">
      <view class="item">
        <text class="num">{{ info.grant_bonus || 0 }}</text>
        <text class="text">{{ texts.common.withdrawals_bonus }}</text>
      </view>
      <view class="item">
        <text class="num">{{ info.ungrant_bonus || 0 }}</text>
        <text class="text">{{ texts.common.withdrawal_bonus }}</text>
      </view>
      <view class="item">
        <text class="num">{{ info.freezing_bonus || 0 }}</text>
        <text class="text">{{ texts.common.frozen_bonus }}</text>
      </view>
    </view>
    <lk-grid-panel card cols="3" :items="cardItems" />
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { GET_CENTREINFO } from "@/common/interface/bonus";
import { mapState, mapActions, mapGetters } from "vuex";
import bonusMixin from "@/mixins/bonus";
import navbarStyle from "@/mixins/navbar-style";
export default {
  name: "pages-bonus-index",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      info: {}
    };
  },
  mixins: [bonusMixin, navbarStyle],
  computed: {
    ...mapState({
      texts: ({ bonus }) => bonus.texts,
      distributeText: ({ distribute }) => distribute.texts,
      addons: ({ config }) => config.addons
    }),
    ...mapGetters(["static"]),
    isBonus() {
      const info = this.info;
      let flag = false;
      if (
        (info.global_is_start == 1 && info.is_global_agent == 2) ||
        (info.area_is_start == 1 && info.is_area_agent == 2) ||
        (info.team_is_start == 1 && info.is_team_agent == 2)
      ) {
        flag = true;
      }
      return flag;
    },
    agentInfo() {
      const info = this.info;
      const { area, global, team } = this.texts;
      const arr = [];
      if (info.global_is_start == 1) {
        let global_obj = {};
        global_obj.name = global.global_agreement;
        global_obj.applyLink = "/packages/bonus/apply?type=1";
        global_obj.levelLink =
          info.is_global_agent == 2 ? "/packages/bonus/level?type=3" : "";
        global_obj.applyState = info.is_global_agent;
        global_obj.level_name = info.global_level_name;
        arr.push(global_obj);
      }
      if (info.area_is_start == 1) {
        let area_obj = {};
        area_obj.name = area.area_agreement;
        area_obj.applyLink = "/packages/bonus/apply?type=2";
        area_obj.levelLink =
          info.is_area_agent == 2 ? "/packages/bonus/level?type=2" : "";
        area_obj.applyState = info.is_area_agent;
        area_obj.level_name = info.area_level_name;
        arr.push(area_obj);
      }
      if (info.team_is_start == 1) {
        let team_obj = {};
        team_obj.name = team.team_agreement;
        team_obj.applyLink = "/packages/bonus/apply?type=3";
        team_obj.levelLink =
          info.is_team_agent == 2 ? "/packages/bonus/level?type=1" : "";
        team_obj.applyState = info.is_team_agent;
        team_obj.level_name = info.team_level_name;
        arr.push(team_obj);
      }
      return arr;
    },
    cardItems() {
      const info = this.info;
      const { global, area, team, common } = this.texts;
      let items = [];
      if (this.isBonus) {
        items.push(
          {
            title: common.bonus_money,
            icon: this.static.baseImgPath + "icons/money.png",
            to: "/packages/bonus/detail"
          },
          {
            title: common.bonus_order,
            icon: this.static.baseImgPath + "icons/order.png",
            to: "/packages/bonus/order"
          }
        );
      }
      if (this.addons.credential) {
        const roleType = [];
        if (info.team_is_start == 1 && info.is_team_agent == 2) {
          roleType.push(1);
        }
        if (info.area_is_start == 1 && info.is_area_agent == 2) {
          roleType.push(2);
        }
        if (info.global_is_start == 1 && info.is_global_agent == 2) {
          roleType.push(3);
        }
        if (roleType.length) {
          items.push({
            title: "授權證書",
            icon: this.static.baseImgPath + "icons/certify.png",
            to: {
              path: "/packages/bonus/credential",
              query: {
                types: roleType.join(",")
              }
            }
          });
        }
      }
      if (this.isBonus && info.is_teamagent_delivery) {
        items.push({
          title: "我要發貨",
          icon: this.static.baseImgPath + "icons/order.png",
          to: "/packages/bonus/delivery/list"
        });
      }
      if (
        info.global_is_start == 1 &&
        (info.complete_datum_global || info.is_global_agent != 2)
      ) {
        let global_obj = {};
        let text =
          info.is_global_agent == 0 ? global.apply_global : "查看申請情況";
        global_obj.title = info.complete_datum_global
          ? "完善" + global.global_agreement + "資料"
          : text;
        global_obj.to = info.complete_datum_global
          ? "/packages/bonus/apply?type=1&hash=replenish"
          : "/packages/bonus/apply?type=1";
        global_obj.state = info.is_global_agent;
        global_obj.icon = this.static.baseImgPath + "icons/qqgd.png";
        items.push(global_obj);
      }
      if (info.area_is_start == 1 && info.is_area_agent != 2) {
        let area_obj = {};
        let text = info.is_area_agent == 0 ? area.apply_area : "查看申請情況";
        area_obj.title = text;
        area_obj.to = "/packages/bonus/apply?type=2";
        area_obj.icon = this.static.baseImgPath + "icons/qydl.png";
        items.push(area_obj);
      }
      if (
        info.team_is_start == 1 &&
        (info.complete_datum_team || info.is_team_agent != 2)
      ) {
        let team_obj = {};
        let text = info.is_team_agent == 0 ? team.apply_team : "查看申請情況";
        team_obj.title = info.complete_datum_team
          ? "完善" + team.team_agreement + "資料"
          : text;
        team_obj.to = info.complete_datum_team
          ? "/packages/bonus/apply?type=3&hash=replenish"
          : "/packages/bonus/apply?type=3";
        team_obj.icon = this.static.baseImgPath + "icons/tddz.png";
        items.push(team_obj);
      }
      return items;
    }
  },
  onLoad() {
    this.getMemberInfo().then(info => {
      if (info.isdistributor == 2) {
        this.getData();
      } else {
        this.$Prompt
          .toast("請先成為" + this.distributeText.distributor_name)
          .then(() => {
            this.$Navigate.replace("/pages/member/index");
          });
      }
    });
  },
  methods: {
    ...mapActions(["getMemberInfo"]),
    getData() {
      GET_CENTREINFO()
        .then(({ data }) => {
          this.info = data;
          this.pageStyle.title = this.texts.common.bonus_name;
        })
        .catch(() => {});
    },
    toLink(link) {
      this.$Navigate.push(link);
    }
  },
  components: {}
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
</style>
