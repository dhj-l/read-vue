import emitter from "@/utils/eventEmitter";
import router from ".";
import { removeItem } from "@/utils/storage";

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
  router.push("/login");
});
