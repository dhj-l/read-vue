import emitter from "@/utils/eventEmitter";
import router from ".";
import { removeItem } from "@/utils/storage";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user/user";
import pinia from "@/stores";
import { notFoundRoute, permissionRoutes } from "./layout/layout";
import { resetDynamicRoutes } from "./guards";
const { userInfo } = storeToRefs(useUserStore(pinia));
const { getUserInfo } = useUserStore();

// 记录动态添加的路由名称
let dynamicRouteNames: string[] = [];
// 监听 noAuth 事件
emitter.on("noAuth", () => {
  removeItem("token");
  
  // 只移除动态添加的路由
  dynamicRouteNames.forEach((name) => {
    router.removeRoute(name);
  });
  dynamicRouteNames = [];
  
  resetDynamicRoutes();
  router.push("/login");
});

// 监听 login 事件
emitter.on("login", () => {
  router.push("/");
});

emitter.on("logout", () => {
  removeItem("token");
  removeItem("userInfo");
  
  // 只移除动态添加的路由
  dynamicRouteNames.forEach((name) => {
    router.removeRoute(name);
  });
  dynamicRouteNames = [];
  
  // 重置动态路由标记，确保下次登录时重新加载权限路由
  resetDynamicRoutes();
  
  console.log("退出登录后的路由:", router.getRoutes());

  emitter.emit("changeFontSize", 16);
  emitter.emit("message", {
    type: "success",
    content: "退出登录成功",
  });
  router.push("/login");
});

emitter.on("permission", async () => {
  await getUserInfo();
  if (userInfo.value) {
    const filterRoutes = permissionRoutes.filter((item) => {
      return userInfo.value?.permissions?.find((permission) => {
        return permission === item.meta!.permission;
      });
    });
    // 将权限路由作为 /layout 的子路由添加，并记录路由名称
    [...filterRoutes, ...notFoundRoute].forEach((item) => {
      router.addRoute("Layout", item);
      if (item.name) {
        dynamicRouteNames.push(item.name as string);
      }
    });

    // 通知动态路由添加完成
    emitter.emit("permissionAdded");
  }
});
