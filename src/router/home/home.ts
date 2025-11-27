import type { RouteRecordRaw } from "vue-router";

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/home.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "HomeIndex",
        component: () => import("@/views/index/index.vue"),
      },
      {
        path: "/home/detail",
        name: "HomeDetail",
        component: () => import("@/views/detail/detail.vue"),
      },
    ],
  },
  {
    path: "/reader",
    name: "Reader",
    component: () => import("@/views/reader/reader.vue"),
  },
];
