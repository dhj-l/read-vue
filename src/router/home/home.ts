import { Document, Odometer } from "@element-plus/icons-vue";
import { toRaw } from "vue";
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
        name: "home",
        component: () => import("@/views/index/index.vue"),
      },
      {
        path: "/home/detail",
        name: "detail",
        component: () => import("@/views/detail/detail.vue"),
      },
      {
        path: "/home/library",
        name: "library",
        component: () => import("@/views/library/library.vue"),
      },
      {
        path: "/home/shelf",
        name: "shelf",
        component: () => import("@/views/shelf/shelf.vue"),
      },
      {
        path: "/home/search",
        name: "search",
        component: () => import("@/views/search/search.vue"),
      },
      {
        path: "/home/writer",
        name: "writer",
        component: () => import("@/views/writer/writer.vue"),
        redirect: "/home/writer/center",
        children: [
          {
            path: "/home/writer/center",
            name: "writer-center",
            component: () => import("@/views/writer/center/center.vue"),
            meta: {
              title: "作家中心",
              icon: toRaw(Odometer),
              //是否显示在侧边栏
              show: true,
            },
          },
          {
            path: "/home/writer/work",
            name: "writer-work",
            component: () => import("@/views/writer/work/work.vue"),
            meta: {
              title: "我的作品",
              icon: toRaw(Document),
              //是否显示在侧边栏
              show: true,
            },
          },
          //章节管理
          {
            path: "/home/writer/chapter",
            name: "writer-chapter",
            component: () => import("@/views/writer/chapter/chapter.vue"),
            meta: {
              title: "章节管理",
              icon: toRaw(Document),
              //是否显示在侧边栏
              show: false,
            },
          },
        ],
      },
      {
        path: "/home/center",
        name: "center",
        component: () => import("@/views/center/center.vue"),
      },
    ],
  },
  {
    path: "/reader",
    name: "Reader",
    component: () => import("@/views/reader/reader.vue"),
  },
  {
    path: "/editor",
    name: "Editor",
    component: () => import("@/views/editor/editor.vue"),
  },
];
