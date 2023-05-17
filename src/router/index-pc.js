import { createRouter, createWebHashHistory } from "vue-router";
import ViEwPC from "../view/index-pc";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: ViEwPC,
      meta: {
        title: "广汽传祺 E9",
      },
    },
  ],
});
export default router;
