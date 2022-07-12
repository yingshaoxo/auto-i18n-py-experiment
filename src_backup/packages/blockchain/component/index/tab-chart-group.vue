<template>
  <view class="cell-group">
    <lk-tabs theme-color slot-title nav-per-view="3" @change="onTab">
      <lk-tab v-for="(tab, index) in tabs" :key="index">
        {{ tab.text }}
      </lk-tab>
    </lk-tabs>
    <view>
      <canvas
        canvas-id="canvasChart"
        id="canvasChart"
        class="charts"
        @touchstart="touchChart"
      ></canvas>
    </view>
  </view>
</template>

<script>
import { GET_BLOCKCHAINCHART } from "@/common/interface/blockchain";
import { formatDate } from "@/common/utils";
import uCharts from "../u-charts/u-charts";
export default {
  data() {
    return {
      tabs: [
        {
          text: "分鐘",
          type: "1min"
        },
        {
          text: "小時",
          type: "60min"
        },
        {
          text: "天",
          type: "1day"
        }
      ],
      timeType: "1min",
      opts: {
        xAxis: {
          scrollAlign: "right",
          itemCount: 20,
          scrollShow: true
        },
        yAxis: {
          splitNumber: 3
        }
      },
      chartsDataCandle1: {}
    };
  },
  props: {
    type: String,
    publicLink: String
  },
  watch: {
    publicLink(e) {
      if (e) {
        this.$nextTick(() => {
          this.getData().then(data => {
            this.initChart(data);
          });
        });
      }
    }
  },
  mounted() {},
  methods: {
    onTab(e) {
      this.timeType = this.tabs[e].type;
      this.getData().then(data => {
        this.canvasChart.updateData({
          series: data
        });
      });
    },
    getData() {
      return new Promise((resolve, reject) => {
        GET_BLOCKCHAINCHART(
          {
            symbol: String(this.type).toLocaleUpperCase(),
            publicLink: this.publicLink,
            size: 1000,
            period: this.timeType
          },
          { isShowLoading: true }
        )
          .then(({ data }) => {
            let series = this.formatSeries(data.list || []);
            resolve(series);
          })
          .catch(() => {
            reject();
          });
      });
    },
    formatSeries(list = []) {
      let series = [{ name: this.type.toUpperCase() + "行情走勢", data: [] }];
      let categories = [];
      list.forEach(e => {
        // series[0].data.push([e.open, e.close, e.low, e.high]);
        // categories.push(e.timestamp);
        series[0].data.push([e.id, e.price]);
      });
      return series;
      // return { series, categories };
    },
    initChart(series) {
      this.canvasChart = new uCharts({
        $this: this,
        canvasId: "canvasChart",
        type: "area",
        fontSize: 11,
        padding: [15, 20, 0, 15],
        legend: false,
        dataLabel: false,
        dataPointShape: false,
        background: "#FFFFFF",
        pixelRatio: 1,
        categories: [],
        series: series,
        animation: true,
        xAxis: {
          type: "grid",
          gridColor: "#CCCCCC",
          gridType: "dash",
          dashLength: 5,
          splitNumber: 8,
          boundaryGap: "justify",
          format: val => {
            return formatDate(val, "hh:mm");
          }
        },
        yAxis: {
          gridType: "dash",
          gridColor: "#CCCCCC",
          dashLength: 5,
          splitNumber: 5,
          format: val => {
            return parseInt(val);
          }
        },
        width: 375,
        height: 250,
        extra: {
          area: {
            type: "curve",
            addLine: true
          }
        }
      });
    },
    touchChart(e) {
      this.canvasChart.showToolTip(e, {
        format: function(item, category) {
          return "價格:" + item.data[1];
        }
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
.charts {
  width: 750rpx;
  height: 500rpx;
  background-color: #ffffff;
}
</style>
