import { createRouter, createWebHashHistory } from "vue-router";
import ViEwPC from "../view/index-pc";
import VIewPCVscreen from "../view/index-pc-vscreen";
const screenShow =
  new URLSearchParams(window.location.search).get("screenShow") || "";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: screenShow === `"VSCREEN"` ? VIewPCVscreen : ViEwPC,
      meta: {
        title: "广汽传祺 E9",
      },
    },
  ],
});
export default router;
