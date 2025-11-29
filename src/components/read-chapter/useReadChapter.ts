import type { ButtonConfig } from "@/layout/content/type";
import { useUserStore } from "@/stores/modules/user/user";
import type { ReadChapterEmits, ReadChapterProps } from "./type";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import emitter from "@/utils/eventEmitter";

export const useReadChapter = (
  props: ReadChapterProps,
  emits: ReadChapterEmits
) => {
  const { logout } = useUserStore();
  const route = useRoute();
  const currentIndex = computed(() => {
    const chapterId = route.query.chapterId;
    return props.chapterList.findIndex((item) => item.id === Number(chapterId));
  });
  const idxIndex = ref(-1);

  const dropMenuConfigs: ButtonConfig<any>[] = [
    {
      label: "退出登录",
      props: {},
      click: () => {
        logout();
      },
    },
  ];
  const btnConfig: ButtonConfig<any>[] = [
    {
      label: "上一章",
      props: {
        class:
          "w-[160px] h-[44px] rounded-[22px] mr-[80px] cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-[#b3b3b3] dark:bg-[#b3b3b31a] dark:hover:bg-[#b3b3b333]",
      },
      click: () => {
        emits("change", props.chapterList[currentIndex.value - 1]!.id);
        emitter.emit("setIdxIndex", -1);
      },
      visible: () => {
        return currentIndex.value > 0;
      },
    },
    {
      label: "下一章",
      props: {
        class:
          "w-[160px] h-[44px] rounded-[22px] cursor-pointer text-white bg-orange-500 hover:bg-orange-600 dark:text-[#b3b3b3] dark:bg-[#fa672599] dark:hover:bg-[#fa6725]",
      },
      click: () => {
        emits("change", props.chapterList[currentIndex.value + 1]!.id);
        emitter.emit("setIdxIndex", -1);
      },
      visible: () => {
        //如果当前章节不是最后一章
        return currentIndex.value < props.chapterList.length - 1;
      },
    },
  ];
  emitter.on("nextChapter", (play) => {
    if (currentIndex.value < props.chapterList.length - 1) {
      emits("change", props.chapterList[currentIndex.value + 1]!.id);
      play.play = true;
    } else {
      play.play = false;
    }
  });
  emitter.on("setIdxIndex", (val) => {
    idxIndex.value = val;
  });
  return {
    dropMenuConfigs,
    btnConfig,
    idxIndex,
  };
};
