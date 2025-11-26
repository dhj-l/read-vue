import { getChapterListAPI } from "@/api/chapter/chapter";
import type { ChapterItem } from "@/api/chapter/type";
import { getChapterListMethod } from "@/api/public-api-method/chapter";
import type { Work } from "@/api/works/type";
import { getWorkDetailAPI } from "@/api/works/works";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useDetail = () => {
  const workInfo = ref<Work>();
  const chapterList = ref<ChapterItem[]>([]);
  const route = useRoute();
  const router = useRouter();
  const currentId = computed(() => {
    return Number(route.query.workId);
  });
  const getWorkInfo = async (id: number) => {
    const res = await getWorkDetailAPI(id);
    workInfo.value = res.data;
  };

  const gotoReader = (chapterId: number) => {
    // 打开新标签页
    const route = router.resolve({
      path: "/reader",
      query: {
        chapterId,
        workId: currentId.value,
      },
    });
    window.open(route.href, "_blank");
  };
  const getChapterList = async (id: number) => {
    const res = await getChapterListMethod(id);
    chapterList.value = res.data.chapters;
  };
  return {
    workInfo,
    currentId,
    chapterList,
    getWorkInfo,
    gotoReader,
    getChapterList,
  };
};
