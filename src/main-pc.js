import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index-pc";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
// import VueWechatTitle from "vue-wechat-title";
// import { ShareSheet } from "vant";
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});


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
    disabled: false,
    // sub: "(敬请期待)",
  },
];

createApp(App)
  .use(router)
  // .use(VueWechatTitle)
  // .use(ShareSheet)
  // .use(ElementPlus)
  .mount("#app");
