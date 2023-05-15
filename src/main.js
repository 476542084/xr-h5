import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueWechatTitle from "vue-wechat-title";
import { ShareSheet } from "vant";

// let sensors = require("sa-sdk-javascript");

// sensors.init({
//   server_url: "http://livegq.3dcat.live/sa?project=production",
//   is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
//   use_client_time: true,
//   show_log: true,
//   send_type: "beacon",
//   source_type: "",
//   heatmap: {
//     track_attr: [],
//     clickmap: "default",
//     scroll_notice_map: true,
//     get_vtrack_config: true,  
//   },
// });
// //user id
// sensors.login("")
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
