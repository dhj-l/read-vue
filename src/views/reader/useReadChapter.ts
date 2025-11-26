import { getChapterDetailAPI } from "@/api/chapter/chapter";
import type { ChapterItem } from "@/api/chapter/type";
import { useReadStore } from "@/stores/modules/read/read";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { getItem, setItem } from "@/utils/storage";
import { getRecordAPI } from "@/api/record/record";

export const useReadChapter = () => {
  const chapter = ref<ChapterItem>({} as ChapterItem);
  const route = useRoute();
  const router = useRouter();
  const readStore = useReadStore();
  const { getChapterMap, setChapterMap, clearChapterMap, getChapterList } =
    readStore;
  const { chapterList } = storeToRefs(readStore);
  const chapterId = computed(() => Number(route.query.chapterId));
  const workId = computed(() => Number(route.query.workId));
  const getChapterDetail = async (id: number) => {
    if (getChapterMap(id)) {
      chapter.value = getChapterMap(id) as ChapterItem;
    } else {
      const res = await getChapterDetailAPI(id);
      if (res.data) {
        chapter.value = res.data;
        setChapterMap(id, res.data);
      }
    }
  };
  const changeChapter = async (id: number) => {
    if (!id || !Number.isFinite(id)) return;
    await getChapterDetail(id);
    router.push({
      path: "/reader",
      query: {
        chapterId: id,
        workId: route.query.workId,
      },
    });
    const wId = workId.value;
    if (Number.isFinite(wId)) {
      setItem(`lastRead_${wId}`, id);
    }
  };
  onMounted(async () => {
    const wId = workId.value;
    const cId = chapterId.value;
    if (chapterList.value.length === 0 && Number.isFinite(wId)) {
      await getChapterList(wId);
    }
    let serverLastId: number | undefined;
    if (Number.isFinite(wId)) {
      try {
        const res = await getRecordAPI(wId);
        serverLastId = (res as any)?.data?.chapter?.id;
      } catch {}
    }
    const localLastId = Number.isFinite(wId)
      ? getLastReadChapterIdLocal(wId)
      : undefined;
    const effectiveId =
      Number.isFinite(cId) && cId > 0
        ? cId
        : localLastId ?? chapterList.value[0]?.id;
    const finalId = serverLastId ?? effectiveId;
    if (finalId) {
      await getChapterDetail(finalId);
    }
  });
  onUnmounted(() => {
    clearChapterMap();
  });
  return {
    chapter,
    getChapterDetail,
    changeChapter,
  };
};
const getLastReadChapterIdLocal = (wid: number): number | undefined => {
  const val = getItem<number>(`lastRead_${wid}`);
  return typeof val === "number" && Number.isFinite(val) ? val : undefined;
};
