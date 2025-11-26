import emitter from "@/utils/eventEmitter";
import { getItem, setItem } from "@/utils/storage";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useReadConfigStore = defineStore("read-config", () => {
  /**
   * 阅读状态
   */
  const readStatus = computed(() => {
    const status = getItem("status");
    return status || "dark";
  });
  /**
   * 字体大小
   */
  const fontSize = ref(getItem<number>("fontSize") || 16);

  const setStatus = (status: "dark" | "light") => {
    setItem("status", status);
  };
  const setFontSize = (size: number) => {
    setItem("fontSize", size);
    emitter.emit("changeFontSize", size);
    fontSize.value = size;
  };

  const init = () => {
    emitter.emit("changeFontSize", fontSize.value);
  };

  return {
    readStatus,
    fontSize,
    setStatus,
    setFontSize,
    init,
  };
});
