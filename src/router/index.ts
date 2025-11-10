import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { homeRoutes } from "./home/home";
import { layoutRoutes } from "./layout/layout";
import emitter from "@/utils/eventEmitter";
// 定义路由配置
const routes: RouteRecordRaw[] = [...homeRoutes, ...layoutRoutes];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 监听 noAuth 事件
emitter.on("noAuth", () => {
  router.push("/login");
});

// 监听 login 事件
emitter.on("login", () => {
  router.push("/");
});

export default router;
