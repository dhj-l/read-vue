import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { homeRoutes } from "./home/home";
import { layoutRoutes } from "./layout/layout";

// 定义路由配置
const routes: RouteRecordRaw[] = [...homeRoutes, ...layoutRoutes];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
