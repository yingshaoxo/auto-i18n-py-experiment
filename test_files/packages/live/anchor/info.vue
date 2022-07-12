<template>
  <view class="pages">
    <view class="warp">
      <view class="cell-group card-group-box">
        <lk-cell>
          <view slot="icon">
            <lk-upload
              :max-count="1"
              @on-success="onUploadSuccess"
              @on-remove="onRemove"
            />
          </view>
          <view class="live-title-group">
            <view class="title">直播標題</view>
            <lk-field
              v-model="params.live_title"
              :border="false"
              placeholder="給直播寫個標題吧~"
            />
          </view>
        </lk-cell>
        <lk-cell-picker-group
          v-model="cateActive"
          placeholder="選擇一個直播分類"
          :columns="cateItems"
          @confirm="onSelectCate"
        />
        <lk-cell v-if="pageType == 2">
          <datetime-picker
            placeholder="選擇預告開播時間"
            :start="defaultStartValue"
            :end="defaultEndValue"
            fields="minute"
            @change="onTimeConfirm"
          />
        </lk-cell>
        <lk-field
          v-if="pageType == 2"
          v-model="params.live_introduce"
          type="textarea"
          placeholder="填寫直播介紹，讓大家更清楚該場主播的主要內容把~"
        />
      </view>
    </view>
    <view
      class="foot-btn-group fixed"
      :class="showAdvanceBtn ? 'flex-space-between' : ''"
      v-if="pageType == 1"
    >
      <lk-button
        class="btn"
        theme-color
        :loading="isLoading"
        round
        block
        @click="onSubmit"
      >
        開始直播
      </lk-button>
      <lk-button
        v-if="showAdvanceBtn"
        class="btn"
        theme-color
        round
        plain
        block
        @click="onAdvance"
      >
        直播預告
      </lk-button>
    </view>
    <view class="foot-btn-group fixed" v-if="pageType == 2">
      <lk-button theme-color round block :loading="isLoading" @click="onSubmit">
        確定
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_LIVEANCHORAPPLYINFO,
  APPLY_LIVEANCHORAPPLYPLAY
} from "../interface";
import { dateToTimestamp, formatDate } from "@/common/utils";
import datetimePicker from "../component/datetime-picker/datetime-picker";
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
function getListValue(list = []) {
  let a = [];
  list.forEach(e => {
    if (e.response) {
      a.push(e.response.src);
    }
  });
  return a.join(",");
}
export default {
  name: "packages-live-anchor-info",
  data() {
    return {
      pageType: 0, // 頁面類型 1：填寫開播信息 2：填寫預告信息
      defaultStartValue: formatDate(new Date().getTime(), "YYYY-MM-DD hh:mm"), //默認開播時間
      defaultEndValue: getFutureDate(10), //默認結束時間,未來3天
      live_id: 0,
      params: {
        anchor_id: 0,
        predict_start_time: "",
        predict_end_time: "",
        advance_time: "",
        cate_id: "",
        live_img: "",
        live_title: "",
        live_introduce: "",
        status: ""
      },
      cateActive: -1,
      cateItems: [],
      isLoading: false,

      showAdvanceBtn: false //顯示預告按鈕
    };
  },
  computed: {},
  onLoad(query) {
    this.params.anchor_id = query.anchor_id || 0;
    this.params.status = query.status || 2; // 默認為2，直播狀態
    this.getData();
  },
  methods: {
    getData() {
      GET_LIVEANCHORAPPLYINFO({
        anchor_id: this.params.anchor_id
      }).then(({ data }) => {
        if (data.live_info) {
          let is_apply = parseInt(data.live_info.is_apply); //是否申請過
          let status = data.live_info.status; //審核狀態
          this.live_id = data.live_info.live_id;

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
            // 審核通過 ，填寫預告信息
            if (this.params.status == 1) {
              this.pageType = 2;
            } else {
              this.pageType = 1;
            }
          } else {
            if (data.is_play_checked == 1) {
              // 需要審核
              return this.$Navigate.replace({
                path: "/packages/live/anchor/apply",
                query: {
                  anchor_id: this.params.anchor_id,
                  live_id: this.live_id
                }
              });
            } else {
              // 填寫開播信息
              this.pageType = 1;
              this.showAdvanceBtn = true; //無審核開播,顯示預告按鈕
            }
          }
          this.params.predict_start_time =
            data.live_info.predict_start_time || "";
          this.params.predict_end_time = data.live_info.predict_end_time || "";
          this.params.cate_id = data.live_info.live_cate;

          let cateList = data.cate_list || [];
          this.cateItems = cateList.map((e, i) => {
            if (e.cate_id == this.params.cate_id) {
              this.cateActive = i;
            }
            e.name = e.cate_name;
            return e;
          });
        }
      });
    },
    onUploadSuccess(data, i, list) {
      this.params.live_img = getListValue(list);
    },
    onRemove(index, list) {
      this.params.live_img = getListValue(list);
    },
    onTimeConfirm(e) {
      this.params.advance_time = dateToTimestamp(e.f3);
    },
    onSelectCate(e) {
      this.cateActive = e;
      this.params.cate_id = this.cateItems[e].cate_id;
    },
    onAdvance() {
      this.params.status = 1;
      this.pageType = 2;
    },
    onSubmit() {
      if (!this.params.live_img) {
        return this.$Prompt.toast("請上傳直播封面");
      }
      if (!this.params.live_title) {
        return this.$Prompt.toast("请填写直播標題");
      }
      if (!this.params.cate_id) {
        return this.$Prompt.toast("請選擇直播分類");
      }
      if (this.params.status == 1 && !this.params.advance_time) {
        return this.$Prompt.toast("请選擇預告開播時間");
      }
      // return console.log(this.params);
      this.isLoading = true;
      APPLY_LIVEANCHORAPPLYPLAY(this.params)
        .then(({ data, message }) => {
          this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
            if (this.params.status == 1) {
              // 前往預告
              this.$Navigate
                .replace({
                  path: "/packages/live/anchor/notice",
                  query: {
                    anchor_id: this.params.anchor_id,
                    live_id: this.live_id
                  }
                })
                .catch(() => {
                  this.isLoading = false;
                });
            } else {
              // 前往主播間
              setTimeout(() => {
                this.$Navigate
                  .replace({
                    path: "/packages/live/anchor/player",
                    query: {
                      anchor_id: this.params.anchor_id,
                      live_id: this.live_id
                    }
                  })
                  .catch(() => {
                    this.isLoading = false;
                  });
              }, 200);
            }
          });
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
.warp {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cell-group {
  width: 100%;
}
.live-title-group {
  .title {
    padding: 0 30rpx;
  }
}

.flex-space-between {
  display: flex;
  justify-content: space-between;
}

.flex-space-between .btn {
  margin: 0 20rpx;
  flex: 1;
}
</style>
