import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Menu",
    component: () => import("./modules/Menu/Menu.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("./modules/Home/Home.vue"),
  },
  {
    path: "/music",
    name: "Music",
    component: () => import("./modules/Music/Music.vue"),
  },
];
export const router = createRouter({
  history: createWebHistory(),
  routes,
});
