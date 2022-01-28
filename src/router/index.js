import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Manage from "@/views/Manage.vue";

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
    name: "manage",
    component: Manage,
  },
  {
    path: "/manage",
    redirect: { name: "manage" }, // /manage redirect to /manage-music path
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

export default router;
