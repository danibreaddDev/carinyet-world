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
  {
    path: "/plans",
    children: [
      {
        path: "",
        name: "Plans",
        component: () => import("./modules/Plans/Plans.vue"),
      },
      {
        path: "planner",
        name: "Planner",
        component: () => import("./modules/Plans/PlannerForm.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("./modules/Admin/Admin.vue"),
    children: [
      {
        path: "music",
        name: "AdminMusic",
        component: () => import("./modules/Admin/MusicRecomendationForm.vue"),
      },
    ],
  },
];
export const router = createRouter({
  history: createWebHistory(),
  routes,
});
