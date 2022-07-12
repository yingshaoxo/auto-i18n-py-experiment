<template>
  <view class="datatime">
    <picker
      mode="multiSelector"
      :range="range"
      range-key="text"
      @change="change"
      @columnchange="columnchange"
      :value="value"
      :disabled="disabled"
    >
      <view class="content" :class="{ placeholder: !dateStr }">
        <text>{{ dateStr ? dateStr : placeholder }}</text>
      </view>
    </picker>
  </view>
</template>

<script>
function isString(val) {
  return Object.prototype.toString.call(val) === "[object String]";
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]";
}
function formatDate(date) {
  let YYYY = null;
  let M = null;
  let MM = null;
  let D = null;
  let DD = null;
  let h = null;
  let hh = null;
  let m = null;
  let mm = null;
  let s = null;
  let ss = null;
  let ms = null;
  let ms2 = null;
  let ms3 = null;
  let ms4 = null;
  let dt = null;

  // 如果 date 是 String 類型
  if (date && isString(date)) {
    // 真機運行時，如果直接用 new Date('YYYY-MM-DD hh:mm:ss') 會報 Invalid Date 錯誤，所以採用下麵的方式創建日期
    let dtArr = date
      .replace(/\//g, ".")
      .replace(/-/g, ".")
      .replace(/:/g, ".")
      .replace(/T/g, " ")
      .replace(" ", ".")
      .replace("Z", "")
      .split(".");

    let year = 2020;
    let month = 12;
    let day = 18;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let millisecond = 0;

    // 年
    if (dtArr.length > 0 && !isNaN(dtArr[0])) {
      year = parseInt(dtArr[0]);
    }
    // 月
    if (dtArr.length > 1 && !isNaN(dtArr[1])) {
      month = parseInt(dtArr[1]);
    }
    // 日
    if (dtArr.length > 2 && !isNaN(dtArr[2])) {
      day = parseInt(dtArr[2]);
    }
    // 時
    if (dtArr.length > 3 && !isNaN(dtArr[3])) {
      hour = parseInt(dtArr[3]);
    }
    // 分
    if (dtArr.length > 4 && !isNaN(dtArr[4])) {
      minute = parseInt(dtArr[4]);
    }
    // 秒
    if (dtArr.length > 5 && !isNaN(dtArr[5])) {
      second = parseInt(dtArr[5]);
    }
    // 毫秒
    if (dtArr.length > 6 && !isNaN(dtArr[6])) {
      millisecond = parseInt(dtArr[6]);
    }

    date = new Date(year, month - 1, day, hour, minute, second, millisecond);
  }

  // 如果 date 是 Date 類型
  if (date && isDate(date)) {
    YYYY = date.getFullYear();
    M = date.getMonth() + 1;
    MM = M >= 10 ? M : "0" + M;
    D = date.getDate();
    DD = D >= 10 ? D : "0" + D;
    h = date.getHours();
    hh = h >= 10 ? h : "0" + h;
    m = date.getMinutes();
    mm = m >= 10 ? m : "0" + m;
    s = date.getSeconds();
    ss = s >= 10 ? s : "0" + s;
    ms = date.getMilliseconds();
    ms2 = ms;
    ms3 = ms;
    ms4 = ms;
    if (ms < 10) {
      ms2 = "0" + ms;
      ms3 = "00" + ms;
      ms4 = "000" + ms;
    } else if (ms < 100) {
      ms3 = "0" + ms;
      ms4 = "00" + ms;
    } else {
      ms4 = "0" + ms;
    }
  }

  // 返回的數據對象
  let result = {
    YYYY: YYYY,
    MM: MM,
    M: M,
    DD: DD,
    D: D,
    hh: hh,
    h: h,
    mm: mm,
    m: m,
    ss: ss,
    s: s,
    ms: ms,
    ms2: ms2,
    ms3: ms3,
    ms4: ms4,
    dt: date,
    f1: `${YYYY}-${MM}-${DD}`,
    f2: `${YYYY}年${M}月${D}日`,
    f3: `${YYYY}-${M}-${D} ${hh}:${mm}`,
    f4: `${h}:${m}:${s}`,
    f5: `${MM}-${DD}`,
    f6: `${YYYY}-${MM}`,
    f7: `${YYYY}年${M}月`,
    f8: `${h}:${m}`,
    f9: `${M}月${D}日`,
    notes:
      "YYYY（年），MM（月，補0），M（月，不補0），DD（日，補0），D（日，不補0），hh（時，補0），h（時，不補0），mm（分，補0），m（分，不補0），ss（秒，補0），s（秒，不補0），ms（毫秒，不補0），ms2（毫秒，補0到2位），ms3（毫秒，補0到3位），ms4（毫秒，補0到4位），其餘的f1，f2，... 看格式就知道了！"
  };
  return result;
}
export default {
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },

    // 占位符
    placeholder: {
      type: String,
      default: "请选择日期時间"
    },

    // 表示有效日期時间范围的開始，
    // 字符串格式為 "YYYY-MM-DD hh:mm"
    start: {
      type: String,
      default: "1970-1-1 00:00"
    },

    // 表示有效日期時间范围的结束
    // 字符串格式為 "YYYY-MM-DD hh:mm"
    end: {
      type: String,
      default: "2300-1-1 00:00"
    },

    // 表示選擇器的粒度，有效值：year | month | day | hour | minute
    fields: {
      type: String,
      default: "minute"
    },

    // 默認值
    // 字符串格式為 "YYYY-MM-DD hh:mm"
    defaultValue: {
      type: String,
      default: ""
    }
  },

  /**
   * 數據
   */
  data() {
    return {
      range: [],
      value: [],
      dateStr: "", // 最終顯示的字符串
      dtStart: null, // 有效範圍開始
      dtEnd: null // 有效範圍結束
    };
  },

  /**
   * 监听數據
   */

  watch: {
    // 默認值
    defaultValue() {
      // 設置默認值
      this.setDefaultValue();
    }
  },

  /**
   * 組件初次加載完成
   */
  mounted() {
    // 有效日期開始和結束
    let start = this.start;
    let end = this.end;

    // 驗證是否是有效的開始和結束日期
    if (!isString(this.start)) {
      console.log('開始日期需為String類型，格式為 "YYYY-MM-DD hh:mm"');
      start = "1970-1-1 00:00";
    }
    if (!isString(this.start)) {
      console.log('結束日期需為String類型，格式為 "YYYY-MM-DD hh:mm"');
      start = "2300-1-1 00:00";
    }

    // 將開始日期和結束日期轉為 Date
    let dtStart = formatDate(start).dt;
    let dtEnd = formatDate(end).dt;

    // 判斷有效日期結束是否大於有效日期開始，如果不是，則將有效日期結束修改為有效日期開始往後300年
    if (dtEnd <= dtStart) {
      dtEnd = formatDate(start).dt;
      dtEnd.setFullYear(dtStart.getFullYear() + 300);
      dtEnd.setDate(dtEnd.getDate() - 1);
    }

    // 更新開始日期和結束日期
    this.dtStart = dtStart;
    this.dtEnd = dtEnd;

    // 設置默認值
    this.setDefaultValue();
  },

  /**
   * 方法
   */
  methods: {
    /**
     * 確認選擇
     */
    change(event) {
      let year, month, day, hour, minute;
      if (this.fields == "year") {
        year = this.range[0][this.value[0]].number; // 年
        let dtStr = `${year}`;
        this.setDateStr(dtStr);
        this.$emit("change", formatDate(dtStr));
        return;
      } else if (this.fields == "month") {
        year = this.range[0][this.value[0]].number; // 年
        month = this.range[1][this.value[1]].number; // 月
        let dtStr = `${year}-${month}`;
        this.setDateStr(dtStr);
        this.$emit("change", formatDate(dtStr));
        return;
      } else if (this.fields == "day") {
        year = this.range[0][this.value[0]].number; // 年
        month = this.range[1][this.value[1]].number; // 月
        day = this.range[2][this.value[2]].number; // 日
        let dtStr = `${year}-${month}-${day}`;
        this.setDateStr(dtStr);
        this.$emit("change", formatDate(dtStr));
        return;
      } else if (this.fields == "hour") {
        year = this.range[0][this.value[0]].number; // 年
        month = this.range[1][this.value[1]].number; // 月
        day = this.range[2][this.value[2]].number; // 日
        hour = this.range[3][this.value[3]].number; // 時
        day = this.range[2][this.value[2]].number; // 日
        let dtStr = `${year}-${month}-${day} ${hour}`;
        this.setDateStr(dtStr);
        this.$emit("change", formatDate(dtStr));
        return;
      } else if (this.fields == "minute") {
        year = this.range[0][this.value[0]].number; // 年
        month = this.range[1][this.value[1]].number; // 月
        day = this.range[2][this.value[2]].number; // 日
        hour = this.range[3][this.value[3]].number; // 時
        minute = this.range[4][this.value[4]].number; // 分
        let dtStr = `${year}-${month}-${day} ${hour}:${minute}`;
        this.setDateStr(dtStr);
        this.$emit("change", formatDate(dtStr));
        return;
      }
    },

    /**
     * 設置顯示的值
     * @param {Date|String} date 日期字符串或日期對象
     */
    setDateStr(date) {
      let dt = formatDate(date);
      if (this.fields == "year") {
        this.dateStr = `${dt.YYYY}年`;
        return;
      }
      if (this.fields == "month") {
        this.dateStr = `${dt.YYYY}年${dt.M}月`;
        return;
      }
      if (this.fields == "day") {
        this.dateStr = `${dt.YYYY}年${dt.M}月${dt.D}日`;
        return;
      }
      if (this.fields == "hour") {
        this.dateStr = `${dt.YYYY}年${dt.M}月${dt.D}日 ${dt.h}時`;
        return;
      }
      this.dateStr = `${dt.YYYY}年${dt.M}月${dt.D}日 ${dt.h}時${dt.m}分`;
    },

    /**
     * 設置年數據
     */

    setYearData() {
      // 有效日期
      let yearStart = this.dtStart.getFullYear();
      let yearEnd = this.dtEnd.getFullYear();
      // 年
      let years = [];
      for (let year = yearStart; year <= yearEnd; year++) {
        let item = {
          number: year,
          text: `${year}年`
        };
        years.push(item);
      }
      this.range.splice(0, 1, years);
    },

    /**
     * 設置月數據
     * @param {Number} year 年
     */

    setMonthData(year) {
      // 有效日期
      let yearStart = this.dtStart.getFullYear();
      let monthStart = this.dtStart.getMonth() + 1;
      let yearEnd = this.dtEnd.getFullYear();
      let monthEnd = this.dtEnd.getMonth() + 1;

      // 月
      let months = [];
      let monthStartIndex = year == yearStart ? monthStart : 1;
      let monthEndIndex = year == yearEnd ? monthEnd : 12;
      for (let month = monthStartIndex; month <= monthEndIndex; month++) {
        let item = {
          number: month,
          text: `${month}月`
        };
        months.push(item);
      }
      this.range.splice(1, 1, months);
    },

    /**
     * 設置日數據
     * @param {Number} year 年
     * @param {Number} month 月
     */

    setDayData(year, month) {
      // 有效日期
      let yearStart = this.dtStart.getFullYear();
      let monthStart = this.dtStart.getMonth() + 1;
      let dayStart = this.dtStart.getDate();
      let yearEnd = this.dtEnd.getFullYear();
      let monthEnd = this.dtEnd.getMonth() + 1;
      let dayEnd = this.dtEnd.getDate();

      // 日
      let days = [];
      let dayStartIndex =
        year == yearStart && month == monthStart ? dayStart : 1;
      let dayEndIndex;
      if (year == yearEnd && month == monthEnd) {
        dayEndIndex = dayEnd;
      } else {
        dayEndIndex = new Date(year, month, 0).getDate();
      }
      for (let day = dayStartIndex; day <= dayEndIndex; day++) {
        let item = {
          number: day,
          text: `${day}日`
        };
        days.push(item);
      }
      this.range.splice(2, 1, days);
    },

    /**
     * 設置時數據
     * @param {Number} year 年
     * @param {Number} month 月
     * @param {Number} day 日
     */

    setHourData(year, month, day) {
      // 有效日期
      let yearStart = this.dtStart.getFullYear();
      let monthStart = this.dtStart.getMonth() + 1;
      let dayStart = this.dtStart.getDate();
      let hourStart = this.dtStart.getHours();
      let yearEnd = this.dtEnd.getFullYear();
      let monthEnd = this.dtEnd.getMonth() + 1;
      let dayEnd = this.dtEnd.getDate();
      let hourEnd = this.dtEnd.getHours();

      // 時
      let hours = [];
      let hourStartIndex =
        year == yearStart && month == monthStart && day == dayStart
          ? hourStart
          : 0;
      let hourEndIndex =
        year == yearEnd && month == monthEnd && day == dayEnd ? hourEnd : 23;
      for (let hour = hourStartIndex; hour <= hourEndIndex; hour++) {
        let item = {
          number: hour,
          text: `${hour}時`
        };
        hours.push(item);
      }
      this.range.splice(3, 1, hours);
    },

    /**
     * 設置分數據
     * @param {Number} year 年
     * @param {Number} month 月
     * @param {Number} day 日
     * @param {Number} hour 時
     */

    setMinuteData(year, month, day, hour) {
      // 有效日期
      let yearStart = this.dtStart.getFullYear();
      let monthStart = this.dtStart.getMonth() + 1;
      let dayStart = this.dtStart.getDate();
      let hourStart = this.dtStart.getHours();
      let minuteStart = this.dtStart.getMinutes();
      let yearEnd = this.dtEnd.getFullYear();
      let monthEnd = this.dtEnd.getMonth() + 1;
      let dayEnd = this.dtEnd.getDate();
      let hourEnd = this.dtEnd.getHours();
      let minuteEnd = this.dtEnd.getMinutes();

      // 分
      let minutes = [];
      let minuteStartIndex =
        year == yearStart &&
        month == monthStart &&
        day == dayStart &&
        hour == hourStart
          ? minuteStart
          : 0;
      let minuteEndIndex =
        year == yearEnd && month == monthEnd && day == dayEnd && hour == hourEnd
          ? minuteEnd
          : 59;
      for (let minute = minuteStartIndex; minute <= minuteEndIndex; minute++) {
        let item = {
          number: minute,
          text: `${minute}分`
        };
        minutes.push(item);
      }
      this.range.splice(4, 1, minutes);
    },

    /**
     * 設置默認值
     */
    setDefaultValue() {
      // 默認日期
      let dtDefault;

      // 開始日期和結束日期
      let dtStart = this.dtStart;
      let dtEnd = this.dtEnd;

      // 判斷是否傳了默認日期
      // 傳了默認日期，格式化默認日期為日期對象
      if (this.defaultValue) {
        dtDefault = formatDate(this.defaultValue).dt;
      }
      // 如果沒有傳默認日期，將默認日期設置為當前日期
      else {
        dtDefault = new Date();
      }

      // 如果默認日期不在有效日期範圍內，設置默認日期為有效日期開始值
      if (dtDefault < dtStart || dtDefault > dtEnd) {
        dtDefault = dtStart;
      }

      // 更新 dateStr
      if (this.defaultValue) this.setDateStr(dtDefault);

      // 默認值相关數據
      let dfYear = dtDefault.getFullYear();
      let dfMonth = dtDefault.getMonth() + 1;
      let dfDay = dtDefault.getDate();
      let dfHour = dtDefault.getHours();
      let dfMinute = dtDefault.getMinutes();

      // 設置年數據
      this.setYearData();
      // 設置 Year 這一列的 value 值
      let yearIndex = this.range[0].findIndex(year => {
        return dfYear == year.number;
      });
      this.value.splice(0, 1, yearIndex >= 0 ? yearIndex : 0);

      // 設置月數據
      if (this.fields == "year") return;
      this.setMonthData(dfYear);
      // 設置 Month 這一列的 value 值
      let monthIndex = this.range[1].findIndex(month => {
        return dfMonth == month.number;
      });
      this.value.splice(1, 1, monthIndex >= 0 ? monthIndex : 0);

      // 設置日數據
      if (this.fields == "month") return;
      this.setDayData(dfYear, dfMonth);
      // 設置 Day 這一列的 value 值
      let dayIndex = this.range[2].findIndex(day => {
        return dfDay == day.number;
      });
      this.value.splice(2, 1, dayIndex >= 0 ? dayIndex : 0);

      // 設置時數據
      if (this.fields == "day") return;
      this.setHourData(dfYear, dfMonth, dfDay);
      // 設置 Hour 這一列的 value 值
      let hourIndex = this.range[3].findIndex(hour => {
        return dfHour == hour.number;
      });
      this.value.splice(3, 1, hourIndex >= 0 ? hourIndex : 0);

      // 設置分數據
      if (this.fields == "hour") return;
      this.setMinuteData(dfYear, dfMonth, dfDay, dfHour);
      // 設置 Minute 這一列的 value 值
      let minuteIndex = this.range[4].findIndex(minute => {
        return dfMinute == minute.number;
      });
      this.value.splice(4, 1, minuteIndex >= 0 ? minuteIndex : 0);
    },

    /**
     * 某一列的值改变時触发
     * @param {Number} event.detail.column 表示改變了第幾列（下標從0開始）
     * @param {Number} event.detail.value 表示變更值的下標
     */
    columnchange(event) {
      let columnIndex = event.detail.column; // 改變的列的下標
      let valueIndex = event.detail.value; // 變更值的下標

      // 更新改變列的 value
      this.value.splice(columnIndex, 1, valueIndex);

      // 改變年要更新月數據
      if (this.fields == "year") return;
      if (columnIndex == 0) {
        // 當前選擇的月
        let monthBeforeUpdate = this.range[1][this.value[1]];
        // 更新月數據
        this.setMonthData(this.range[0][this.value[0]].number);
        // 更新 Month Value
        let monthIndex = this.range[1].findIndex(month => {
          return month.number == monthBeforeUpdate.number;
        });
        this.value.splice(1, 1, monthIndex >= 0 ? monthIndex : 0);
      }

      // 改變年、月都要更新日數據
      if (this.fields == "month") return;
      if (columnIndex == 0 || columnIndex == 1) {
        // 當前選擇的日
        let dayBeforeUpdate = this.range[2][this.value[2]];
        // 更新日數據
        this.setDayData(
          this.range[0][this.value[0]].number,
          this.range[1][this.value[1]].number
        );
        // 更新 Day Value
        let dayIndex = this.range[2].findIndex(day => {
          return day.number == dayBeforeUpdate.number;
        });
        this.value.splice(2, 1, dayIndex >= 0 ? dayIndex : 0);
      }

      // 改變年、月、日都要更新時數據
      if (this.fields == "day") return;
      if (columnIndex == 0 || columnIndex == 1 || columnIndex == 2) {
        // 当前选择的時
        let hourBeforeUpdate = this.range[3][this.value[3]];
        // 更新時數據
        this.setHourData(
          this.range[0][this.value[0]].number,
          this.range[1][this.value[1]].number,
          this.range[2][this.value[2]].number
        );
        // 更新 Hour Value
        let hourIndex = this.range[3].findIndex(hour => {
          return hour.number == hourBeforeUpdate.number;
        });
        this.value.splice(3, 1, hourIndex >= 0 ? hourIndex : 0);
      }

      // 當前選擇的分
      if (this.fields == "hour") return;
      let minuteBeforeUpdate = this.range[4][this.value[4]];
      // 更新分數據
      this.setMinuteData(
        this.range[0][this.value[0]].number,
        this.range[1][this.value[1]].number,
        this.range[2][this.value[2]].number,
        this.range[3][this.value[3]].number
      );
      // 更新 Minute Value
      let minuteIndex = this.range[4].findIndex(minute => {
        return minute.number == minuteBeforeUpdate.number;
      });
      this.value.splice(4, 1, minuteIndex >= 0 ? minuteIndex : 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  text-align: left;
}

.placeholder {
  color: #949596;
}
</style>
