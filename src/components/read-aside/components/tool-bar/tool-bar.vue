<template>
  <div
    class="w-full h-full transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-gray-600 dark:text-[#b3b3b3]"
    @click="handleClick"
  >
    <Tickets class="w-[24px] h-[24px]" />
    <p class="text-[12px]">目录</p>

    <el-drawer v-model="open" :size="500" :with-header="false">
      <div class="p-[24px] bg-white dark:bg-[#262626] min-h-full">
        <div class="flex items-center">
          <el-image
            :src="API_BASE_URL + (workDetail.cover_url ?? '')"
            fit="cover"
            class="w-[64px] h-[88px] rounded-[6px]"
          >
            <template #error>
              <div
                class="w-[64px] h-[88px] rounded-[6px] bg-gray-100 dark:bg-[#2b2b2b] flex items-center justify-center text-gray-400"
              >
                暂无封面
              </div>
            </template>
          </el-image>
          <div class="ml-[16px]">
            <div
              class="text-[16px] font-medium text-gray-800 dark:text-[#b3b3b3]"
            >
              {{ workDetail.title }}
            </div>
            <div class="mt-[4px] flex items-center">
              <el-tag size="small" class="mr-[8px]" :type="statusType">
                {{ statusLabel }}
              </el-tag>
              <span class="text-[12px] text-gray-600 dark:text-[#b3b3b3]">
                {{ workDetail.user?.username || "无名氏" }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-[24px] flex items-center justify-between">
          <div class="text-[18px] text-gray-700 dark:text-[#b3b3b3]">
            目录 · {{ workDetail.chapterCount ?? list.length }}
          </div>
          <div class="text-[14px] flex items-center">
            <span
              class="ml-[16px] cursor-pointer text-gray-600 dark:text-[#b3b3b3]"
              @click="toggleOrder"
            >
              {{ reverse ? "正序" : "倒序" }}
            </span>
          </div>
        </div>

        <div class="mt-[16px]">
          <ul class="divide-y divide-gray-200 dark:divide-[#b3b3b329]">
            <li
              v-for="chap in orderedList"
              :key="chap.id"
              @click="gotoChapter(chap.id)"
              class="px-[16px] h-[48px] text-[16px] flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#ffffff0a]"
            >
              <div class="flex items-center">
                <span
                  v-if="chap.id === activeChapterId"
                  class="w-[8px] h-[8px] bg-orange-500 rounded-full mr-[8px]"
                ></span>
                <span
                  :class="
                    chap.id === activeChapterId
                      ? 'text-orange-500'
                      : 'text-gray-800 dark:text-[#b3b3b3]'
                  "
                >
                  {{ chap.name }}
                </span>
              </div>
              <div class="text-[12px] text-gray-500 dark:text-[#b3b3b366]">
                {{ chap.count }}字
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import type { ChapterItem } from "@/api/chapter/type";
import { getChapterListMethod } from "@/api/public-api-method/chapter";
import type { Work } from "@/api/works/type";
import { getWorkDetailAPI } from "@/api/works/works";
import emitter from "@/utils/eventEmitter";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API_BASE_URL } from "@/config/config";
import { workStatusMap } from "@/layout/works/config";
const route = useRoute();
const router = useRouter();
const open = ref(false);
const workDetail = ref<Work>({} as Work);
const list = ref<ChapterItem[]>([]);
const workId = computed(() => {
  return Number(route.query.workId) || 0;
});
const statusLabel = computed<string>(() => {
  return (workStatusMap.get(workDetail.value.status)?.label as string) ?? "";
});
const statusType = computed<string>(() => {
  const t = workStatusMap.get(workDetail.value.status)?.type as
    | string
    | undefined;
  return ["success", "info", "warning", "danger"].includes(t ?? "")
    ? (t as string)
    : "info";
});
const reverse = ref<boolean>(false);
const orderedList = computed<ChapterItem[]>(() => {
  return reverse.value ? [...list.value].reverse() : list.value;
});
const activeChapterId = computed<number>(
  () => Number(route.query.chapterId) || 0
);
const handleClick = () => {
  open.value = true;
  getWorkDetail();
};

const getWorkDetail = async () => {
  if (!workId.value) {
    emitter.emit("message", {
      type: "error",
      content: "请先选择作品",
    });
    return;
  }
  const work = await getWorkDetailAPI(workId.value);
  const chapterList = await getChapterListMethod(workId.value);
  workDetail.value = work.data;
  list.value = chapterList.data.chapters || [];
};

const gotoChapter = (id: number) => {
  router.push({
    path: "/reader",
    query: { workId: workId.value, chapterId: id },
  });
  open.value = false;
};
const toggleOrder = () => {
  reverse.value = !reverse.value;
};
</script>

<style scoped></style>
