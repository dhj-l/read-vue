import type { ButtonConfig } from "@/layout/content/type";
import { useUserStore } from "@/stores/modules/user/user";
import type { ReadChapterEmits, ReadChapterProps } from "./type";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

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
          "w-[160px] h-[44px] rounded-[22px] mr-[80px] text-[#b3b3b3] bg-[#b3b3b31a] cursor-pointer hover:bg-[#b3b3b333]",
      },
      click: () => {
        emits("change", props.chapterList[currentIndex.value - 1]!.id);
      },
      visible: () => {
        return currentIndex.value > 0;
      },
    },
    {
      label: "下一章",
      props: {
        class:
          "w-[160px] h-[44px] rounded-[22px] text-[#b3b3b3] bg-[#fa672599] cursor-pointer hover:bg-[#fa6725]",
      },
      click: () => {
        emits("change", props.chapterList[currentIndex.value + 1]!.id);
      },
      visible: () => {
        //如果当前章节不是最后一章
        return currentIndex.value < props.chapterList.length - 1;
      },
    },
  ];

  return {
    dropMenuConfigs,
    btnConfig,
  };
};
