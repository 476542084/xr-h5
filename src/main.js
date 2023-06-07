import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueWechatTitle from "vue-wechat-title";
import { ShareSheet } from "vant";

window.carList = [
  {
    title: "传祺E9",
    version: "PRO",
    sa: "PRO",
    timeLineId: "LC-00000003",
  },
  {
    title: "传祺E9",
    version: "MAX",
    sa: "MAX",
    timeLineId: "LC-00000002",
  },
  {
    title: "传祺E9",
    version: "宗师",
    sa: "宗师",
    timeLineId: "LC-00000001",
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
    const shareTimeLineId = new URLSearchParams(window.location.search).get(
      "shareTimeLineId"
    );
    uid && sensors.login(uid);
    window.uid = uid;
    try {
      sensors.quick("autoTrack");
      sensors.track("vr_carType_load_browse", {
        platform: "h5",
        car_series: "mpv",
        car_type: "E9",
        cartype_version: shareTimeLineId
          ? window.carList.filter(
              (car) => `"${car.timeLineId}"` === shareTimeLineId
            )[0]["version"]
          : "宗师",
        uid: window.uid,
      });
    } catch (_) {
      console.error(_);
    }

    window.sensors = sensors;

    window.addEventListener("beforeunload", function () {
      const time = (+new Date() - window.startTime) / 1000;
      // 发送ajax请求或者使用图片请求将数据上报到服务器端

      window.sensors.track("vr_carType_load_leave", {
        e_code_team: "瑞云",
        e_code_version: "",
        car_series: "mpv",
        car_type: "E9",
        event_duration: +(time / 60).toFixed(2),
        cartype_version: shareTimeLineId
          ? window.carList.filter(
              (car) => `"${car.timeLineId}"` === shareTimeLineId
            )[0]["version"]
          : "宗师",
        uid: window.uid,
      });
    });
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
