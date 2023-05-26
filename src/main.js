import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueWechatTitle from "vue-wechat-title";
import { ShareSheet } from "vant";
console.log("ENV", process.env.VUE_APP_ENV);
console.log("VUE_APP_SA_URL", process.env.VUE_APP_SA_URL);
try {
  if (
    //暂时 uat 测试以及正式环境埋点
    (process.env.VUE_APP_ENV &&
      process.env.VUE_APP_ENV === "LauncherPrivate-test") ||
    process.env.VUE_APP_ENV === "LauncherPrivate-prod"
  ) {
    let sensors = require("sa-sdk-javascript");
    sensors.init({
      server_url: process.env.VUE_APP_SA_URL,
      is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
      use_client_time: true,
      show_log: true,
      send_type: "beacon",
      heatmap: {
        track_attr: [],
        clickmap: "default",
        scroll_notice_map: true,
        get_vtrack_config: true,
      },
    });
    const uid = new URLSearchParams(window.location.search).get("uid");
    uid && sensors.login(uid);
    sensors.quick("autoTrack");
    window.sensors = sensors;
  }
} catch (error) {
  console.log("sensors error", error);
}

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
