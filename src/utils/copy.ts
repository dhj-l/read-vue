import { useClipboard } from "@vueuse/core";
import emitter from "./eventEmitter";
export const copy = (text: string) => {
  try {
    const { copy } = useClipboard();
    copy(text);
    emitter.emit("message", {
      type: "success",
      content: "复制成功",
    });
  } catch (error) {
    emitter.emit("message", {
      type: "error",
      content: "复制失败",
    });
  }
};
