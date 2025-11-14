import emitter from "@/utils/eventEmitter";
import router from ".";

// 监听 noAuth 事件
emitter.on("noAuth", () => {
  localStorage.removeItem("token");
  router.push("/login");
});

// 监听 login 事件
emitter.on("login", (path?: string) => {
  router.push(path || "/");
});
