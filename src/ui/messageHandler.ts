import emitter from "@/utils/eventEmitter";
import { ElMessage } from "element-plus";

emitter.on("noAuth", () => {
  ElMessage.error("登录过期，请重新登录");
});
emitter.on("requestError", (msg: string) => {
  ElMessage.error(msg);
});
emitter.on("message", ({ type, content }) => {
  ElMessage({
    type,
    message: content,
  });
});
