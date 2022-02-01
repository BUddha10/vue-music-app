import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Manage from "@/views/Manage.vue";
import Song from "@/views/Song.vue";

import store from "@/store";

const routes = [
  {
    path: "/",
    name: "home", // assign name to route
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/manage-music",
    meta: { requiresAuth: true },
    name: "manage",
    component: Manage,
  },
  {
    path: "/manage",
    // alias: "manage", // alternate to redirect
    redirect: { name: "manage" }, // /manage redirect to /manage-music path
  },
  {
    name: "song",
    path: "/song/:id",
    component: Song,
  },
  {
    path: "/:catchAll(.*)*", // catch unknown path
    redirect: { name: "home" }, // redirect unknown path to home path
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

// protecting routes form unauthorized users
router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;
