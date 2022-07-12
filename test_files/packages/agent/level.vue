<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.user_headimg"
      :name="info.user_name"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        <view>{{ info.level_name }}</view>
      </view>
    </lk-header-panel>
    <view class="cell-group">
      <view class="tabel-title">等級權益介紹</view>
      <view class="tabel">
        <lk-table :th="levelHead" :tr="levelList" />
      </view>
    </view>
    <view class="cell-group" v-if="upgrade.levelName">
      <view class="tips">
        <view class="title">
          {{ upgrade.label1 }}
          <text>{{ upgrade.levelName }}</text>
          {{ upgrade.label2 }}
          <text class="light">{{ upgrade.conditeText }}</text>
        </view>
        <view v-for="(item, index) in upgrade.items" :key="index">
          {{ item.index }}
          {{ item.label1 }}
          <text>{{ item.numText }}</text>
          {{ item.label2 }}
          <text class="light">{{ item.labelLight }}</text>
        </view>
      </view>
    </view>
    <view class="cell-group" v-if="downgrade.levelName">
      <view class="tips">
        <view class="title">
          {{ downgrade.label1 }}
          <text>{{ downgrade.levelName }}</text>
          {{ downgrade.label2 }}
          <text class="light">{{ downgrade.conditeText }}</text>
        </view>
        <view v-for="(item, index) in downgrade.items" :key="index">
          {{ item.index }}
          {{ item.label1 }}
          <text>{{ item.days }}</text>
          {{ item.label2 }}
          <text>{{ item.down_number }}</text>
          {{ item.label3 }}
          <text class="light">{{ item.labelLight }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_UPBONUESLEVEL } from "@/common/interface/agent";
function ratio(value) {
  return value ? parseFloat(value) + "%" : "--";
}
// 比例
function recommendRatio(commission, point) {
  let text = null;
  let com = parseFloat(commission);
  let pot = parseFloat(point);
  if (com > 0 && pot > 0) {
    text = com + "%佣金 + " + pot + "%積分";
  } else if (com > 0 && pot == 0) {
    text = com + "%佣金";
  } else if (com == 0 && pot > 0) {
    text = pot + "%積分";
  } else {
    text = "--";
  }
  return text;
}
// 固定
function recommendFixed(commission, point) {
  let text = null;
  let com = parseFloat(commission);
  let pot = parseFloat(point);
  if (com > 0 && pot > 0) {
    text = com + "元佣金 + " + pot + "積分";
  } else if (com > 0 && pot == 0) {
    text = com + "元佣金";
  } else if (com == 0 && pot > 0) {
    text = pot + "積分";
  } else {
    text = "--";
  }
  return text;
}
export default {
  name: "packages-agent-level",
  data() {
    return {
      info: {},
      levelHead: [
        { value: "等級" },
        { value: "一級返傭" },
        { value: "二級返傭" },
        { value: "三級返傭" },
        { value: "一級推薦" },
        { value: "二級推薦" },
        { value: "三級推薦" }
      ],
      levelList: [],

      //升級條件
      upgrade: {
        label1: "升級",
        label2: "條件",
        levelName: "",
        conditeText: "",
        items: []
      },
      //降級條件
      downgrade: {
        label1: "降級",
        label2: "條件",
        levelName: "",
        conditeText: "",
        items: []
      }
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      GET_UPBONUESLEVEL({ types: 4 })
        .then(({ data }) => {
          this.info = data.user || {};
          this.upgrade.levelName = data.levelCondition.levelname;
          this.upgrade.conditeText = `(${
            data.levelCondition.upgrade_condition == 1 ? "滿足所有" : "滿足一條"
          })`;
          this.upgrade.items = this.getUpgrade(data.levelCondition.result);

          this.downgrade.levelName = data.downlevelCondition.levelname;
          this.downgrade.conditeText = `(${
            data.downlevelCondition.starttime
          }至${data.downlevelCondition.endtime}，${
            data.downlevelCondition.downgrade_condition == 1
              ? "滿足所有"
              : "滿足一條"
          })`;
          this.downgrade.items = this.getDowngrade(
            data.downlevelCondition.result
          );

          this.levelList = this.getLevelList(data.levels);
        })
        .catch(error => {});
    },
    getLevelList(items = []) {
      let arr = [];
      items.forEach(e => {
        let td = [
          {
            value: e.level_name
          }
        ];
        if (e.recommend_type == 1) {
          td.push(
            {
              value: recommendRatio(e.commission1, e.commission_point1)
            },
            {
              value: recommendRatio(e.commission2, e.commission_point2)
            },
            {
              value: recommendRatio(e.commission3, e.commission_point3)
            }
          );
        } else {
          td.push(
            {
              value: recommendFixed(e.commission11, e.commission_point11)
            },
            {
              value: recommendFixed(e.commission22, e.commission_point22)
            },
            {
              value: recommendFixed(e.commission33, e.commission_point33)
            }
          );
        }
        td.push(
          {
            value: recommendFixed(e.recommend1, e.recommend_point1)
          },
          {
            value: recommendFixed(e.recommend2, e.recommend_point2)
          },
          {
            value: recommendFixed(e.recommend3, e.recommend_point3)
          }
        );
        arr.push({ td });
      });
      return arr;
    },
    getUpgrade(items = []) {
      let arr = [];
      items.forEach((e, i) => {
        let obj = {};
        obj.index = `${i + 1}、`;
        obj.labelLight = `(${parseFloat(e.number)}/${parseFloat(e.up_number)})`;
        obj.label1 = e.condition_type == 7 ? "購買商品" : e.condition_name;
        obj.label2 = e.condition_type == 7 ? "" : e.unit;
        obj.numText =
          e.condition_type == 7 ? e.condition_name : parseFloat(e.up_number);
        arr.push(obj);
      });
      return arr;
    },
    getDowngrade(items = []) {
      let arr = [];
      const conditeObj = {
        1: {
          label1: "團隊訂單量在",
          label2: "天內，少於",
          label3: "單"
        },
        2: {
          label1: "团队订單金额在",
          label2: "天內，少於",
          label3: "元"
        },
        3: {
          label1: "",
          label2: "天內，需要消費",
          label3: "元"
        }
      };
      items.forEach((e, i) => {
        let obj = {};
        obj.index = `${i + 1}、`;
        obj.labelLight = `(${parseFloat(e.number)}/${parseFloat(
          e.down_number
        )})`;
        obj.label1 = conditeObj[e.condition_type].label1;
        obj.label2 = conditeObj[e.condition_type].label2;
        obj.label3 = conditeObj[e.condition_type].label3;
        obj.days = parseFloat(e.days);
        obj.down_number = parseFloat(e.down_number);
        arr.push(obj);
      });
      return arr;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.cell-group {
  margin: 20rpx 0;
}
.tabel {
  padding: $cell-padding;
  background-color: #ffffff;
}
.tabel-title {
  padding: 20rpx 30rpx 0;
  background-color: #ffffff;
}
.tips {
  padding: $cell-padding;
  line-height: 40rpx;
  background-color: #ffffff;
  font-size: $font-size-sm;
  .title {
    font-size: $font-size;
    line-height: 48rpx;
  }
  text {
    color: $red;
    padding: 0 8rpx;
  }
  .light {
    color: $text-light;
    font-size: $font-size-sm;
  }
}
</style>
