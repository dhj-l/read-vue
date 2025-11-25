import { getChapterListAPI } from "@/api/chapter/chapter";
import type { ChapterItem } from "@/api/chapter/type";
import { getItem, setItem } from "@/utils/storage";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export const useReadStore = defineStore("read", () => {
  const chapterMap = new Map<number, ChapterItem>();

  const route = useRoute();
  const currentWorkId = computed(() => {
    return Number(route.query.workId);
  });
  const currentChapterId = computed(() => {
    return Number(route.query.chapterId);
  });
  const chapterList = ref<{ id: number; title: string }[]>(
    getItem(`chapterList_${currentWorkId.value}`) || []
  );
  const currentIndex = computed(() => {
    return chapterList.value.findIndex(
      (item) => item.id === currentChapterId.value
    );
  });

  const setChapterMap = (key: number, value: ChapterItem) => {
    chapterMap.set(key, value);
  };
  const getChapterMap = (key: number) => {
    return chapterMap.get(key);
  };
  const clearChapterMap = () => {
    chapterMap.clear();
  };

  const getChapterList = async (workId: number) => {
    const res = await getChapterListAPI({ workId: workId, status: 1, all: 1 });
    const list = res.data.chapters.map((item) => {
      return {
        id: item.id,
        title: item.name,
      };
    });
    chapterList.value = list;
    setItem(`chapterList_${workId}`, list);
  };

  return {
    chapterList,
    currentIndex,
    setChapterMap,
    getChapterMap,
    clearChapterMap,
    getChapterList,
  };
});
