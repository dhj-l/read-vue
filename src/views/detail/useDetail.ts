import type { ChapterItem } from "@/api/chapter/type";
import { getChapterListMethod } from "@/api/public-api-method/chapter";
import type { Work } from "@/api/works/type";
import { getWorkDetailAPI } from "@/api/works/works";
import { useBookShelfStore } from "@/stores/modules/book-shelf/book-shelf";
import emitter from "@/utils/eventEmitter";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useDetail = () => {
  const { isInShelf, addToShelf } = useBookShelfStore();
  const workInfo = ref<Work>();
  const chapterList = ref<ChapterItem[]>([]);
  const route = useRoute();
  const router = useRouter();
  const bookStatusText = computed(() => {
    return isInShelf(workInfo.value!.id) ? "已存在书架中" : "加入书架";
  });
  const btnDisabled = computed(() => {
    return isInShelf(workInfo.value!.id);
  });
  const currentId = computed(() => {
    return Number(route.query.workId);
  });
  const getWorkInfo = async (id: number) => {
    const res = await getWorkDetailAPI(id);
    workInfo.value = res.data;
  };
  const addToShelfHandler = async () => {
    await addToShelf(workInfo.value!.id);
    emitter.emit("message", {
      content: "加入书架成功",
      type: "success",
    });
  };

  const gotoReader = (chapterId: number, chapterType?: string) => {
    // 打开新标签页
    const route = router.resolve({
      path: "/reader",
      query: {
        chapterId,
        workId: currentId.value,
        chapterType: chapterType || "start",
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
    bookStatusText,
    btnDisabled,
    getWorkInfo,
    gotoReader,
    getChapterList,
    addToShelfHandler,
  };
};
