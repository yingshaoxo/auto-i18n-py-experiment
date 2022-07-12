<template>
  <view class="uni-calendar">
    <view
      v-if="!insert && show"
      class="uni-calendar__mask"
      :class="{ 'uni-calendar--mask-show': aniMaskShow }"
      @click="clean"
    ></view>
    <view
      v-if="insert || show"
      class="uni-calendar__content"
      :class="{
        'uni-calendar--fixed': !insert,
        'uni-calendar--ani-show': aniMaskShow
      }"
    >
      <view v-if="!insert" class="uni-calendar__header uni-calendar--fixed-top">
        <view class="uni-calendar__header-btn-box" @click="close">
          <text class="uni-calendar__header-text uni-calendar--fixed-width"
            >取消</text
          >
        </view>
        <view class="uni-calendar__header-btn-box" @click="confirm">
          <text class="uni-calendar__header-text uni-calendar--fixed-width"
            >確定</text
          >
        </view>
      </view>
      <view class="uni-calendar__header">
        <view class="uni-calendar__header-btn-box" @click.stop="pre">
          <view class="uni-calendar__header-btn uni-calendar--left"></view>
        </view>
        <picker
          mode="date"
          :value="date"
          fields="month"
          @change="bindDateChange"
        >
          <text class="uni-calendar__header-text">{{
            (nowDate.year || "") + "年" + (nowDate.month || "") + "月"
          }}</text>
        </picker>
        <view class="uni-calendar__header-btn-box" @click.stop="next">
          <view class="uni-calendar__header-btn uni-calendar--right"></view>
        </view>
        <text
          class="uni-calendar__backtoday"
          v-if="showBacktoday"
          @click="backtoday"
          >回到今天</text
        >
      </view>
      <view class="uni-calendar__box">
        <view v-if="showMonth" class="uni-calendar__box-bg">
          <text class="uni-calendar__box-bg-text">{{ nowDate.month }}</text>
        </view>
        <view class="uni-calendar__weeks">
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">日</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">一</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">二</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">三</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">四</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">五</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">六</text>
          </view>
        </view>
        <view
          class="uni-calendar__weeks"
          v-for="(item, weekIndex) in weeks"
          :key="weekIndex"
        >
          <view
            class="uni-calendar__weeks-item"
            v-for="(weeks, weeksIndex) in item"
            :key="weeksIndex"
          >
            <calendar-item
              :weeks="weeks"
              :calendar="calendar"
              :selected="selected"
              :lunar="lunar"
              @change="choiceDate"
            ></calendar-item>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Calendar from "./util";
import calendarItem from "./calendar-item";
/**
 * Calendar 日曆
 * @description 日曆组件可以查看日期，選擇任意範圍內的日期，打點操作。常用場景如：酒店日期預訂、火車機票選擇購買日期、上下班打卡等
 * @tutorial https://ext.dcloud.net.cn/plugin?id=56
 * @property {String} date 自定義當前時間，默認為今天
 * @property {Boolean} lunar 顯示農曆
 * @property {String} startDate 日期選擇範圍-開始日期
 * @property {String} endDate 日期選擇範圍-結束日期
 * @property {Boolean} range 範圍選擇
 * @property {Boolean} insert = [true|false] 插入模式,默認為false
 * 	@value true 彈窗模式
 * 	@value false 插入模式
 * @property {Boolean} clearDate = [true|false] 彈窗模式是否清空上次选择内容
 * @property {Array} selected 打點，期待格式[{date: '2019-06-27', info: '簽到', data: { custom: '自定義信息', name: '自定義消息頭',xxx:xxx... }}]
 * @property {Boolean} showMonth 是否選擇月份為背景
 * @event {Function} change 日期改變，`insert :ture` 時生效
 * @event {Function} confirm 確認選擇`insert :false` 時生效
 * @event {Function} monthSwitch 切換月份時觸發
 * @example <uni-calendar :insert="true":lunar="true" :start-date="'2019-3-2'":end-date="'2019-5-20'"@change="change" />
 */
export default {
  components: {
    calendarItem
  },
  props: {
    date: {
      type: String,
      default: ""
    },
    selected: {
      type: Array,
      default() {
        return [];
      }
    },
    lunar: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: String,
      default: ""
    },
    endDate: {
      type: String,
      default: ""
    },
    range: {
      type: Boolean,
      default: false
    },
    insert: {
      type: Boolean,
      default: true
    },
    showMonth: {
      type: Boolean,
      default: true
    },
    clearDate: {
      type: Boolean,
      default: true
    },
    showBacktoday: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      weeks: [],
      calendar: {},
      nowDate: "",
      aniMaskShow: false
    };
  },
  watch: {
    date(newVal) {
      this.cale.setDate(newVal);
      this.init(this.cale.selectDate.fullDate);
    },
    startDate(val) {
      this.cale.resetSatrtDate(val);
    },
    endDate(val) {
      this.cale.resetEndDate(val);
    },
    selected(newVal) {
      this.cale.setSelectInfo(this.nowDate.fullDate, newVal);
      this.weeks = this.cale.weeks;
    }
  },
  created() {
    // 获取日曆方法实例
    this.cale = new Calendar({
      // date: new Date(),
      selected: this.selected,
      startDate: this.startDate,
      endDate: this.endDate,
      range: this.range
    });
    // 選中某一天
    this.cale.setDate(this.date);
    this.init(this.cale.selectDate.fullDate);
    // this.setDay
  },
  methods: {
    // 取消穿透
    clean() {},
    bindDateChange(e) {
      const value = e.detail.value + "-1";
      console.log(this.cale.getDate(value));
      this.cale.setDate(value);
      this.init(value);
    },
    /**
     * 初始化日期顯示
     * @param {Object} date
     */
    init(date) {
      this.weeks = this.cale.weeks;
      this.nowDate = this.calendar = this.cale.getInfo(date);
    },
    /**
     * 打开日曆弹窗
     */
    open() {
      // 彈窗模式并且清理数据
      if (this.clearDate && !this.insert) {
        this.cale.cleanMultipleStatus();
        this.cale.setDate(this.date);
        this.init(this.cale.selectDate.fullDate);
      }
      this.show = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.aniMaskShow = true;
        }, 50);
      });
    },
    /**
     * 关闭日曆弹窗
     */
    close() {
      this.aniMaskShow = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = false;
          this.$emit("close");
        }, 300);
      });
    },
    /**
     * 確認按鈕
     */
    confirm() {
      this.setEmit("confirm");
      this.close();
    },
    /**
     * 變化觸發
     */
    change() {
      if (!this.insert) return;
      this.setEmit("change");
    },
    /**
     * 選擇月份觸發
     */
    monthSwitch() {
      let { year, month } = this.nowDate;
      this.$emit("monthSwitch", {
        year,
        month: Number(month)
      });
    },
    /**
     * 派髮事件
     * @param {Object} name
     */
    setEmit(name) {
      let { year, month, date, fullDate, lunar, extraInfo } = this.calendar;
      this.$emit(name, {
        range: this.cale.multipleStatus,
        year,
        month,
        date,
        fulldate: fullDate,
        lunar,
        extraInfo: extraInfo || {}
      });
    },
    /**
     * 選擇天觸發
     * @param {Object} weeks
     */
    choiceDate(weeks) {
      if (this.readonly) return;
      if (weeks.disable) return;
      this.calendar = weeks;
      // 設置多選
      this.cale.setMultiple(this.calendar.fullDate);
      this.weeks = this.cale.weeks;
      this.change();
    },
    /**
     * 回到今天
     */
    backtoday() {
      console.log(this.cale.getDate(new Date()).fullDate);
      let date = this.cale.getDate(new Date()).fullDate;
      this.cale.setDate(date);
      this.init(date);
      this.change();
    },
    /**
     * 上個月
     */
    pre() {
      const preDate = this.cale.getDate(this.nowDate.fullDate, -1, "month")
        .fullDate;
      this.setDate(preDate);
      this.monthSwitch();
    },
    /**
     * 下個月
     */
    next() {
      const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, "month")
        .fullDate;
      this.setDate(nextDate);
      this.monthSwitch();
    },
    /**
     * 設置日期
     * @param {Object} date
     */
    setDate(date) {
      this.cale.setDate(date);
      this.weeks = this.cale.weeks;
      this.nowDate = this.cale.getInfo(date);
    }
  }
};
</script>

<style lang="scss" scoped>
.uni-calendar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.uni-calendar__mask {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: $uni-bg-color-mask;
  transition-property: opacity;
  transition-duration: 0.3s;
  opacity: 0;
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.uni-calendar--mask-show {
  opacity: 1;
}

.uni-calendar--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transition-property: transform;
  transition-duration: 0.3s;
  transform: translateY(460px);
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.uni-calendar--ani-show {
  transform: translateY(0);
}

.uni-calendar__content {
  background-color: #fff;
}

.uni-calendar__header {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  border-bottom-color: $uni-border-color;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.uni-calendar--fixed-top {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: space-between;
  border-top-color: $uni-border-color;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-calendar--fixed-width {
  width: 100rpx;
  // padding: 0 15px;
}

.uni-calendar__backtoday {
  position: absolute;
  right: 0;
  top: 25rpx;
  padding: 0 10rpx;
  padding-left: 20rpx;
  height: 50rpx;
  line-height: 50rpx;
  font-size: $font-size-sm;
  border-top-left-radius: 50rpx;
  border-bottom-left-radius: 50rpx;
  color: $text-color;
  background-color: $background-color;
}

.uni-calendar__header-text {
  text-align: center;
  width: 200rpx;
  font-size: $font-size;
  color: $text-color;
}

.uni-calendar__header-btn-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
}

.uni-calendar__header-btn {
  width: 20rpx;
  height: 20rpx;
  border-left-color: $text-light;
  border-left-style: solid;
  border-left-width: 4rpx;
  border-top-color: $text-light;
  border-top-style: solid;
  border-top-width: 4rpx;
}

.uni-calendar--left {
  transform: rotate(-45deg);
}

.uni-calendar--right {
  transform: rotate(135deg);
}

.uni-calendar__weeks {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.uni-calendar__weeks-item {
  flex: 1;
}

.uni-calendar__weeks-day {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90rpx;
  border-bottom-color: #f5f5f5;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.uni-calendar__weeks-day-text {
  font-size: $font-size;
}

.uni-calendar__box {
  position: relative;
}

.uni-calendar__box-bg {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.uni-calendar__box-bg-text {
  font-size: 400rpx;
  font-weight: bold;
  color: $text-light;
  opacity: 0.1;
  text-align: center;
  /* #ifndef APP-NVUE */
  line-height: 1;
  /* #endif */
}
</style>
