import Vue from "vue";
// @ts-ignore
import App from "./App";
import store from "./store";

import navigate from "./api/navigate";
import prompt from "./api/prompt";

// #ifndef APP-PLUS
import vGoogleTranslate from "v-google-translate";
Vue.use(vGoogleTranslate)
// #endif

// #ifdef MP-WEIXIN
import "./common/lib/weapp-cookie";
// #endif

// @ts-ignore
import { report_position } from "@/common/interface/task";

// #ifdef H5
import popupBindMobile from "./components/lk/bind-mobile";
Vue.component("popupBindMobile", popupBindMobile);
Vue.prototype.$BindMobile = popupBindMobile;
import barrage from "./components/lk/barrage";
Vue.component("barrage", barrage);
Vue.prototype.$Barrage = barrage;
Vue.prototype.$Barrage.create();
// #endif

import pages from "./mixins/pages";

Vue.prototype.$Navigate = navigate;
Vue.prototype.$Prompt = prompt;

// 注入全局
Vue.mixin(pages);

Vue.config.productionTip = false;
App.mpType = "app";

// #ifdef H5
Vue.config.ignoredElements.push("wx-open-subscribe");
// #endif

const inverval = 1000 * 60 * 10

const tenMinutesTask = () => {
  try {
    report_position()
    console.log("hi")
  } catch (e) {
  }
  setTimeout(() => {
    tenMinutesTask()
  }, inverval)
}

tenMinutesTask()



const app = new Vue({
  ...App,
  store
});

app.$mount();
