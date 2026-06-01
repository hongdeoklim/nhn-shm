/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import App from "./App.vue";
import "@/util/GlobalComponents";

// Vuesax Component Framework
import Vuesax from "vuesax";
import "material-icons/iconfont/material-icons.css"; //Material Icons
import "vuesax/dist/vuesax.css"; // Vuesax
Vue.use(Vuesax);

// axios
import axios from "./axios.js";
Vue.prototype.$http = axios;

// chart
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

// i18n
import i18n from "./i18n";

// Filters
import "./filters/filters.js";

// Theme Configurations
import "../themeConfig.js";

// Globally Registered Components
import "./globalComponents.js";

// Styles: SCSS
import "./assets/scss/main.scss";

// Tailwind
import "@/assets/css/main.css";

// Vue Router
import router from "./router";

// Vuex Store
import store from "./store/store";

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from "vue2-hammer";
Vue.use(VueHammer);

// PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Feather font icon
require("./assets/css/iconfont.css");

// moment.js
import vueMoment from "vue-moment";
import moment from "moment";

moment.updateLocale("en", {
  weekdays: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  weekdaysShort : ["일", "월", "화", "수", "목", "금", "토"],
});
Vue.use(vueMoment, { moment });

// v-calendar
import VCalendar from "v-calendar";
Vue.use(VCalendar, {
  componentPrefix: "vc",
});

// fregment
import Fragment from "vue-fragment";
Vue.use(Fragment.Plugin);

// 검증
import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

// 이미지 클립
import VueRx  from "vue-rx";
import VuejsClipper from 'vuejs-clipper/dist/vuejs-clipper.umd.min'
import 'vuejs-clipper/dist/vuejs-clipper.css'
Vue.use(VueRx);
Vue.use(VuejsClipper);

// 이벤트버스
Vue.prototype.$eventbus = new Vue();

// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';

import constant from "./constant/constant";

// Toast : npm install vue-toast-notification@^1
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
Vue.use(ToastPlugin);

Vue.config.productionTip = false;

// prototype
Vue.prototype.$constant = constant;

new Vue({
  router,
  store,
  i18n,
  constant,
  render: (h) => h(App),
}).$mount("#app");
