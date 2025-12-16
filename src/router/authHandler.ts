import emitter from "@/utils/eventEmitter";
import router from ".";
import { removeItem } from "@/utils/storage";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user/user";
import pinia from "@/stores";
import { notFoundRoute, permissionRoutes } from "./layout/layout";
const { userInfo } = storeToRefs(useUserStore(pinia));
const { getUserInfo } = useUserStore();
// 监听 noAuth 事件
emitter.on("noAuth", () => {
  removeItem("token");
  router.push("/login");
});

// 监听 login 事件
emitter.on("login", () => {
  router.push("/");
});

emitter.on("logout", () => {
  removeItem("token");
  removeItem("userInfo");
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
    // 将权限路由作为 /layout 的子路由添加
    [...filterRoutes, ...notFoundRoute].forEach((item) => {
      router.addRoute("Layout", item);
    });

    // 通知动态路由添加完成
    emitter.emit("permissionAdded");
  }
});
