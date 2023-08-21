import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueWechatTitle from "vue-wechat-title";
import { ShareSheet } from "vant";

const sourceType = new URLSearchParams(window.location.search).get(
  "sourceType"
);
switch (sourceType) {
  case '"APP_01"':
    window.souceType_port = "小程序";
    break;
  case '"APP_02"':
    window.souceType_port = "app";
    break;
  case '"APP_03"':
    window.souceType_port = "大屏-H5";
    break;
  case '"APP_04"':
    window.souceType_port = "大屏-APP";
    break;
  default:
    window.souceType_port = "unknown";
    break;
}

window.carList = [
  {
    title: "传祺E9",
    version: "PRO",
    sa: "PRO",
    timeLineId: "LC-00000003",
    disabled: false,
  },
  {
    title: "传祺E9",
    version: "MAX",
    sa: "MAX",
    timeLineId: "LC-00000002",
    disabled: false,
  },
  {
    title: "传祺E9",
    version: "宗师",
    sa: "宗师",
    timeLineId: "LC-00000001",
    disabled: false,
  },
  {
    title: "传祺E9",
    version: "冠军",
    sa: "冠军",
    timeLineId: "LC-00000004",
    disabled: true,
    sub: "(敬请期待)",
  },
];

window.startTime = +new Date();
console.log("ENV", process.env.VUE_APP_ENV);
console.log("VUE_APP_SA_URL", process.env.VUE_APP_SA_URL);
try {
  if (
    //暂时 dev 正式以及uat测试环境埋点
    process.env.VUE_APP_ENV === "LauncherPrivate-test" ||
    process.env.VUE_APP_ENV === "Launcher-prod"
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
    sensors.use("PageLeave");
    const uid = new URLSearchParams(window.location.search).get("uid");
    // const shareTimeLineId = new URLSearchParams(window.location.search).get(
    //   "shareTimeLineId"
    // );
    uid && sensors.login(uid);
    window.uid = uid;
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
