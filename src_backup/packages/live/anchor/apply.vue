<template>
  <view class="pages">
    <block v-if="pageType == 1">
      <view class="notice" v-if="notice">{{ notice }}</view>
      <view class="cell-group">
        <lk-cell title="房號" field :value="room_no" />
        <lk-cell title="直播時段" field>
          <view class="date-box">
            <view class="item">
              <datetime-picker
                placeholder="請選擇開播開始時間"
                :start="defaultStartValue"
                :end="defaultEndValue"
                fields="minute"
                @change="onStartConfirm"
              />
            </view>
            <view class="item">
              <datetime-picker
                placeholder="請選擇開播結束時間"
                :start="defaultEndStartValue"
                :end="defaultEndValue"
                fields="minute"
                @change="onEndConfirm"
              />
            </view>
          </view>
        </lk-cell>
        <lk-cell-picker-group
          v-model="cateActive"
          label="直播分類"
          placeholder="請選擇分類"
          :columns="cateItems"
          @confirm="onSelectCate"
        />
      </view>
      <view class="foot-btn-group">
        <lk-button
          round
          block
          theme-color
          bing-mobile
          :loading="isLoading"
          @click="onSubmit"
        >
          提交申請
        </lk-button>
      </view>
    </block>
    <block v-if="pageType == 2">
      <view class="result-box" v-if="resultInfo">
        <image class="image" :src="resultInfo.image" />
        <view class="result-text">
          <view>{{ resultInfo.text }}</view>
          <view class="text-msg" v-if="resultInfo.message">
            {{ resultInfo.message }}
          </view>
          <view v-if="resultInfo.text1">{{ resultInfo.text1 }}</view>
        </view>
      </view>
      <view class="foot-btn-group" v-if="resultInfo.btnText">
        <lk-button
          round
          block
          theme-color
          :plain="!!resultInfo.btnPlain"
          @click="onResultAction(resultInfo.btnAction)"
        >
          {{ resultInfo.btnText }}
        </lk-button>
      </view>
    </block>
  </view>
</template>

<script>
import {
  GET_LIVEANCHORAPPLYINFO,
  APPLY_LIVEANCHORAPPLYPLAY
} from "../interface";
import { dateToTimestamp, formatDate } from "@/common/utils";
import datetimePicker from "../component/datetime-picker/datetime-picker";
import { mapGetters } from "vuex";
// 獲取未來n天
function getFutureDate(n) {
  var s = "";
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (day > n) {
    if (mon > 1) {
      mon = mon + 1;
    } else {
      year = year + 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() + n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  s =
    year +
    "-" +
    (mon < 10 ? "0" + mon : mon) +
    "-" +
    (day < 10 ? "0" + day : day);
  return s;
}
// 當前時間是否在指定時間範圍內
function isDuringDate(beg = 0, end = 0) {
  const curDate = Math.round(new Date() / 1000); //當前時間
  return curDate >= beg && curDate <= end;
}
export default {
  name: "packages-live-anchor-apply",
  data() {
    return {
      pageType: 0, // 頁面類型 1==> 申請狀態 2==> 審核狀態
      notice: "",
      room_no: "",
      resultInfo: "",
      defaultStartValue: formatDate(new Date().getTime(), "YYYY-MM-DD hh:mm"), //默認開播時間
      defaultEndStartValue: formatDate(
        new Date().getTime(),
        "YYYY-MM-DD hh:mm"
      ), //默認結束開播時間
      defaultEndValue: getFutureDate(10), //默認結束時間,未來3天
      params: {
        anchor_id: 0,
        predict_start_time: "",
        predict_end_time: "",
        cate_id: "",
        status: 0 //默認无審核狀態
      },
      cateActive: -1,
      cateItems: [],
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["static"])
  },
  onLoad(query) {
    this.params.anchor_id = query.anchor_id || 0;
    this.getData();
  },
  methods: {
    getData() {
      GET_LIVEANCHORAPPLYINFO({
        anchor_id: this.params.anchor_id
      }).then(({ data }) => {
        let is_apply = parseInt(data.live_info.is_apply); //是否申請過
        let status = data.live_info.status || 0; //審核狀態
        this.live_id = data.live_info.live_id;

        this.room_no = data.room_no || "";
        let cateList = data.cate_list || [];
        this.cateItems = cateList.map((e, i) => {
          if (e.cate_id == data.live_info.live_cate) {
            this.cateActive = i;
          }
          e.name = e.cate_name;
          return e;
        });

        if (is_apply == 1) {
          if (status == 1) {
            //前往直播預告
            return this.$Navigate.replace({
              path: "/packages/live/anchor/notice",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: data.live_info.live_id
              }
            });
          }
          if (status == 2) {
            //前往主播間
            return this.$Navigate.replace({
              path: "/packages/live/anchor/player",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: data.live_info.live_id
              }
            });
          }
          if (status == 4) {
            //直播統計
            return this.$Navigate.replace({
              path: "/packages/live/anchor/end",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: data.live_info.live_id
              }
            });
          }
          // 已申請，查看申請結果
          this.pageType = 2;
          this.resultInfo = this.setResultInfo(data.live_info); //設置審核返回信息狀態
        } else {
          // 需要審核
          if (data.is_play_checked == 1) {
            if (status == 4) {
              // 開播過，但已下播，重新申請開播
              if (
                data.predict_start_time &&
                data.predict_end_time &&
                isDuringDate(data.predict_start_time, data.predict_end_time)
              ) {
                console.log("在開播時間範圍內，無需重新申請");
                return this.$Navigate.replace({
                  path: "/packages/live/anchor/info",
                  query: {
                    anchor_id: this.params.anchor_id,
                    live_id: this.live_id
                  }
                });
              }
            }
            this.pageType = 1;
            this.notice = "當前平臺開啟了直播審核，審核通過後才能開啟直播。";
          } else {
            // 無需審核，直接填寫開播信息
            this.$Navigate.replace({
              path: "/packages/live/anchor/info",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: this.live_id
              }
            });
          }
        }

        this.isLoading = false;
      });
    },
    setResultInfo({
      status,
      uncheck_reason,
      before_play_min,
      predict_start_time,
      predict_end_time,
      advance_limit_time
    }) {
      let info = "";
      const startTime = formatDate(predict_start_time, "YYYY-MM-DD hh:mm");
      const endTime = formatDate(predict_end_time, "YYYY-MM-DD hh:mm");
      const advanceFlag =
        Math.round(new Date() / 1000) >= parseInt(advance_limit_time); //是否已到開播時間臨界點
      const obj = {
        "0": {
          text: "您的申請已提交至平臺審核，請耐心等待！",
          image: this.static.baseImgPath + "empty-live.png"
        },
        "-1": {
          text: "您的直播申請不通過，原因：",
          message: uncheck_reason,
          btnText: "重新申請",
          btnAction: "anew",
          image: this.static.baseImgPath + "empty-live.png"
        },
        "3": {
          text: "您的直播申請已審核通過，",
          message: startTime + "~" + endTime,
          text1:
            "內開播無需再次審核，可提前" +
            (before_play_min || 0) +
            "分鐘開播。",
          btnText: advanceFlag ? "前往開播" : "直播預告",
          btnAction: advanceFlag ? "player" : "advance",
          btnPlain: !advanceFlag,
          image: this.static.baseImgPath + "empty-live.png"
        }
      };
      info = obj[status] || "";
      console.log(info);
      return info;
    },
    onStartConfirm(e) {
      this.defaultEndStartValue = e.f3;
      this.params.predict_start_time = dateToTimestamp(e.f3);
    },
    onEndConfirm(e) {
      this.params.predict_end_time = dateToTimestamp(e.f3);
    },
    onSelectCate(e) {
      this.cateActive = e;
      this.params.cate_id = this.cateItems[e].cate_id;
    },
    onResultAction(action) {
      if (action == "anew") {
        //重新申請
        this.pageType = 1;
        this.params.status = 0;
      }
      if (action == "player") {
        //前往開播
        this.$Navigate.replace({
          path: "/packages/live/anchor/info",
          query: {
            anchor_id: this.params.anchor_id,
            live_id: this.live_id,
            status: 2
          }
        });
      }
      if (action == "advance") {
        //直播預告
        this.$Navigate.replace({
          path: "/packages/live/anchor/info",
          query: {
            anchor_id: this.params.anchor_id,
            live_id: this.live_id,
            status: 1
          }
        });
      }
    },
    onSubmit() {
      if (!this.params.predict_start_time) {
        return this.$Prompt.toast("請選擇開播開始時間");
      }
      if (!this.params.predict_end_time) {
        return this.$Prompt.toast("請選擇開播結束時間");
      }
      if (this.params.predict_end_time < this.params.predict_start_time) {
        return this.$Prompt.toast("結束時間不能在開始時間之前");
      }
      if (!this.params.cate_id) {
        return this.$Prompt.toast("請選擇直播分類");
      }
      // return console.log(this.params);
      this.isLoading = true;
      APPLY_LIVEANCHORAPPLYPLAY(this.params)
        .then(({ data, message }) => {
          this.$Prompt.toast({ title: message, icon: "success" });
          this.getData();
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    datetimePicker
  }
};
</script>

<style lang="scss" scoped>
.notice {
  padding: 20rpx;
  color: #f56723;
  font-size: $font-size-sm;
  line-height: 1.5;
  background-color: #fff7cc;
}
.date-box {
  margin: -20rpx -30rpx;
  display: flex;
  flex-flow: column;
  .item {
    padding: $cell-padding;
    flex: 1;
    text-align: left;
  }
}
.result-box {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100vw;
  min-height: 100vw;
  justify-content: center;
  .image {
    display: block;
    width: 514rpx;
    height: 258rpx;
  }
  .result-text {
    padding: $cell-padding;
    line-height: 40rpx;
    color: $text-light;
    text-align: center;
    margin: 40rpx;
    .text-msg {
      color: $red;
    }
  }
}
</style>
