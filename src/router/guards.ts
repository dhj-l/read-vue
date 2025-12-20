import { getItem } from "@/utils/storage";
import router from ".";
import emitter from "@/utils/eventEmitter";

const whiteList = ["/login", "/home"];

// 标记是否已经添加过动态路由
let hasDynamicRoutesAdded = false;

// 导出重置函数，供退出登录时调用
export const resetDynamicRoutes = () => {
  hasDynamicRoutesAdded = false;
};

router.beforeEach(async (to, from, next) => {
  console.log(to, from, "出发了");
  const token = getItem("token", false);
  if (token) {
    if (to.path === "/login") {
      next("/");
    } else {
      // 如果还没有添加动态路由，先添加动态路由
      if (!hasDynamicRoutesAdded) {
        try {
          await new Promise<void>((resolve) => {
            // 监听权限路由添加完成事件
            const permissionListener = () => {
              hasDynamicRoutesAdded = true;
              emitter.off("permissionAdded", permissionListener);
              resolve();
            };
            emitter.on("permissionAdded", permissionListener);
            emitter.emit("permission");
          });

          // 动态路由添加完成后，重新导航到目标路由
          next({ ...to, replace: true });
        } catch (error) {
          console.error("添加动态路由失败:", error);
          next("/login");
        }
      } else {
        // 已经添加过动态路由，直接放行
        next();
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});
