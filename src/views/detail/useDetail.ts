import { getChapterListAPI } from "@/api/chapter/chapter";
import type { ChapterItem } from "@/api/chapter/type";
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
    return Number(route.query.id);
  });
  const getWorkInfo = async (id: number) => {
    const res = await getWorkDetailAPI(id);
    workInfo.value = res.data;
  };
  const getChapterList = async (workId: number) => {
    const res = await getChapterListAPI({ workId: workId, status: 1, all: 1 });
    chapterList.value = res.data.chapters;
  };
  const gotoReader = (chapterId: number) => {
    router.push({
      path: "/reader",
      query: {
        chapterId,
      },
    });
  };

  return {
    workInfo,
    chapterList,
    currentId,
    getWorkInfo,
    getChapterList,
    gotoReader,
  };
};
