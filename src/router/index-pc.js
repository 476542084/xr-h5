import { createRouter, createWebHashHistory } from "vue-router";
import ViEwPC from "../view/index-pc";
import VIewPCVscreen from "../view/index-pc-vscreen";
import VIewPCVscreen2K from "../view/index-pc-vscreen-2k";
const { width, height } = window.screen
const screenShow =
  new URLSearchParams(window.location.search).get("screenShow") || "";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: screenShow === `"VSCREEN"` ? (width === 1080 && height === 1920 ? VIewPCVscreen2K : VIewPCVscreen) : ViEwPC,
      meta: {
        title: "广汽传祺 E9",
      },
    },
  ],
});
export default router;
