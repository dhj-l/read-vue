import { getChapterDetailAPI } from "@/api/chapter/chapter";
import type { ChapterItem } from "@/api/chapter/type";
import { getChapterListMethod } from "@/api/public-api-method/chapter";
import { getRecordAPI } from "@/api/record/record";
import type { RecordItem } from "@/api/record/type";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useReadChapter = () => {
  const chapter = ref<ChapterItem>({} as ChapterItem);
  const route = useRoute();
  const router = useRouter();
  const chapterId = computed(() => {
    return Number(route.query.chapterId);
  });
  const workId = computed(() => {
    return Number(route.query.workId);
  });
  const chapterList = ref<ChapterItem[]>([]);

  const record = ref<RecordItem>({} as RecordItem);

  const getChapterDetail = async (id: number) => {
    const res = await getChapterDetailAPI(id);
    if (res.data) {
      chapter.value = res.data;
    }
  };
  const changeChapter = async (id: number) => {
    router.push({
      path: "/reader",
      query: {
        chapterId: id,
        workId: route.query.workId,
      },
    });
    getChapterDetail(id);
  };

  const getRecord = async (workId: number) => {
    const res = await getRecordAPI(workId);
    if (res.data) {
      record.value = res.data;
    }
  };
  const getChapterList = async (id: number) => {
    const res = await getChapterListMethod(id);
    if (res.data) {
      chapterList.value = res.data.chapters;
    }
  };

  const initReader = async () => {
    //第一步： 根据workId获取书籍阅读记录
    await getRecord(workId.value);
    //第二步：如果返回的章节id与当前章节id不一致，则跳转到该章节
    if (record.value.chapter.id !== chapterId.value) {
      changeChapter(record.value.chapter.id);
    } else {
      //第三步：如果返回的章节id与当前章节id一致，则获取当前章节详情
      getChapterDetail(chapterId.value);
    }
    //第四步: 防止以外情况，在这里再次获取章节列表
    await getChapterList(workId.value);
  };

  onMounted(() => {
    initReader();
  });

  return {
    chapter,
    chapterList,
    getChapterDetail,
    changeChapter,
  };
};
