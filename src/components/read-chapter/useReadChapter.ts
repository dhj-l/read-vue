import type { ButtonConfig } from "@/layout/content/type";
import { useReadStore } from "@/stores/modules/read/read";
import { useUserStore } from "@/stores/modules/user/user";
import { storeToRefs } from "pinia";

export const useReadChapter = (
  emits: (event: string, ...args: any[]) => void
) => {
  const { logout } = useUserStore();
  const { currentIndex, chapterList } = storeToRefs(useReadStore());
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
          "w-[160px] h-[44px] rounded-[22px] mr-20 text-[#b3b3b3] bg-[#b3b3b31a] cursor-pointer hover:bg-[#b3b3b333]",
      },
      click: () => {
        emits("change", chapterList.value[currentIndex.value - 1]?.id);
      },
      visible: () => {
        //如果当前章节不是第一章节
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
        emits("change", chapterList.value[currentIndex.value + 1]?.id);
      },
      visible: () => {
        //如果当前章节不是最后一章
        return (
          currentIndex.value >= 0 &&
          currentIndex.value < chapterList.value.length - 1
        );
      },
    },
  ];
  return {
    dropMenuConfigs,
    btnConfig,
  };
};
