import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueWechatTitle from "vue-wechat-title";
import { ShareSheet } from "vant";
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
