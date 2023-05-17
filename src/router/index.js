import { createRouter, createWebHashHistory } from "vue-router";
import ViEw from "../view";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: ViEw,
      meta: {
        title: "广汽传祺 E9",
      },
    },
  ],
});
export default router;
