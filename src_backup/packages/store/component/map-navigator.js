import { mapState } from "vuex";
import { encodeUriParams } from "@/common/utils";
import { openLink } from "@/common/utils/comp-path";
// 將騰訊/高德地圖經緯度轉換為百度地圖經緯度
const txMapTransBMap = (lng, lat) => {
  if (!lng && !lat) {
    return {
      lng: "",
      lat: ""
    };
  }
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  let x = lng;
  let y = lat;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let lngs = z * Math.cos(theta) + 0.0065;
  let lats = z * Math.sin(theta) + 0.006;
  return {
    lng: lngs,
    lat: lats
  };
};

// 將百度地圖經緯度轉換為騰訊/高德地圖經緯度
const bMapTransTxMap = (lng, lat) => {
  if (!lng && !lat) {
    return {
      lng: "",
      lat: ""
    };
  }
  let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  let x = lng - 0.0065;
  let y = lat - 0.006;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let lngs = z * Math.cos(theta);
  let lats = z * Math.sin(theta);
  return {
    lng: lngs,
    lat: lats
  };
};

const maps = [
  {
    name: "高德地圖",
    type: "gd"
  },
  {
    name: "百度地圖",
    type: "bd"
  },
  {
    name: "騰訊地圖",
    type: "tx"
  }
];
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      domain: ({ domain }) => domain
    })
  },
  methods: {
    showSelectMap() {
      uni.showActionSheet({
        itemList: maps.map(({ name }) => name),
        success: ({ tapIndex }) => {
          const item = maps[tapIndex];
          let location = {
            ...this.info.location,
            city: ""
          };
          let info = {
            name: this.info.store_name,
            lng: this.info.lng,
            lat: this.info.lat
          };
          const url = this[item.type + "Map"](location, info);
          this.openMap(url);
        }
      });
    },
    openMap(url) {
      openLink(url);
    },
    // 高德地圖
    gdMap({ lng, lat }, params = {}) {
      const location = bMapTransTxMap(lng, lat);
      const api = "https://uri.amap.com/navigation?";
      const toLocation = bMapTransTxMap(params.lng, params.lat);
      const obj = {
        from: location.lng + "," + location.lat + "," + "當前位置",
        to: toLocation.lng + "," + toLocation.lat + "," + params.name,
        src: this.domain,
        callnative: 1,
        via: "",
        mode: "",
        policy: "",
        coordinate: "gaode"
      };
      console.log(obj);
      return api + encodeUriParams(obj);
    },
    // 百度地圖
    bdMap({ lng, lat, city }, params = {}) {
      const api = "http://api.map.baidu.com/direction?";
      const obj = {
        origin: lat + "," + lng,
        destination: params.lat + "," + params.lng,
        mode: "driving",
        output: "html",
        region: city || "",
        src: this.domain
      };
      console.log(obj);
      return api + encodeUriParams(obj);
    },
    // 騰訊地圖
    txMap({ lng, lat }, params = {}) {
      const location = bMapTransTxMap(lng, lat);
      const api = "https://apis.map.qq.com/uri/v1/routeplan?";
      const toLocation = bMapTransTxMap(params.lng, params.lat);
      const obj = {
        type: "drive",
        fromcoord: location.lng + "," + location.lat,
        to: params.name,
        tocoord: toLocation.lng + "," + toLocation.lat,
        coord_type: 2,
        referer: this.domain
      };
      console.log(obj);
      return api + encodeUriParams(obj);
    }
  }
};
