import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueWechatTitle from "vue-wechat-title";
import { ShareSheet } from "vant";
console.log("ENV", process.env.ENV);

// if (
//   //暂时 uat 测试以及正式环境埋点
//   (process.env.ENV && process.env.ENV === "LauncherPrivate-test") ||
//   process.env.ENV === "LauncherPrivate-prod"
// ) {
//   let sensors = require("sa-sdk-javascript");
//   sensors.init({
//     server_url: process.env.VUE_APP_SA_URL,
//     is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
//     use_client_time: true,
//     show_log: true,
//     send_type: "beacon",
//     source_type: "",
//     heatmap: {
//       track_attr: [],
//       clickmap: "default",
//       scroll_notice_map: true,
//       get_vtrack_config: true,
//     },
//   });
//   const uid = new URLSearchParams(window.location.search).get("uid");
//   uid && sensors.login(uid);
//   sensors.quick("autoTrack");
// }

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

createApp(App)
  .use(router)
  .use(VueWechatTitle)
  .use(ShareSheet)
  .use(ElementPlus)
  .mount("#app");
