import emitter from "@/utils/eventEmitter";
import { getItem, setItem } from "@/utils/storage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useReadConfigStore = defineStore("read-config", () => {
  /**
   * 阅读状态
   */
  const readStatus = ref<"dark" | "light">(getItem("status", false) || "dark");
  /**
   * 字体大小
   */
  const fontSize = ref(Number(getItem("fontSize", false)) || 16);

  const setStatus = (status: "dark" | "light") => {
    setItem("status", status);
    readStatus.value = status;
    emitter.emit("setHtmlAttr", { key: "data-theme", value: status });
  };
  const setFontSize = (size: number) => {
    setItem("fontSize", size);
    emitter.emit("changeFontSize", size);
    fontSize.value = Number(size);
  };

  const init = () => {
    emitter.emit("changeFontSize", fontSize.value);
    emitter.emit("setHtmlAttr", { key: "data-theme", value: readStatus.value });
  };

  return {
    readStatus,
    fontSize,
    setStatus,
    setFontSize,
    init,
  };
});
