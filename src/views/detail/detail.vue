<script setup lang="ts">
import { EditPen } from "@element-plus/icons-vue";
import { computed, onMounted } from "vue";
import { useDetail } from "./useDetail";

import { API_BASE_URL } from "@/config/config";
import { workStatusMap } from "@/layout/works/config";
import { formateCount, formateTime } from "@/utils/formdate";
import { useReadStore } from "@/stores/modules/read/read";
import { storeToRefs } from "pinia";
const { getChapterList } = useReadStore();
const { chapterList } = storeToRefs(useReadStore());
const { workInfo, getWorkInfo, currentId, gotoReader } = useDetail();

onMounted(() => {
  getWorkInfo(currentId.value);

  getChapterList(currentId.value);
});

//TODO：后期需要删除
interface AuthorInfo {
  name: string;
  avatar: string;
  bio: string;
}

const author: AuthorInfo = {
  name: "三九音域",
  avatar: "https://avatars.githubusercontent.com/u/9919?s=64&v=4",
  bio: "用心写出不一样的故事",
};

const statusLabel = computed(() =>
  workInfo.value ? workStatusMap.get(workInfo.value.status)?.label ?? "" : ""
);
const statusType = computed(() =>
  workInfo.value
    ? workStatusMap.get(workInfo.value.status)?.type ?? "info"
    : "info"
);
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-[362px] bg-white">
      <div class="w-[1240px] h-full mx-auto flex items-center">
        <div class="h-[224px] w-[70%] flex space-x-4 border-r border-[#e5e5e5]">
          <template v-if="workInfo">
            <div class="h-full">
              <img
                class="w-[180px] h-full object-cover rounded-lg"
                :src="API_BASE_URL + (workInfo.cover_url || '')"
                alt=""
              />
            </div>
            <div class="h-full flex flex-col justify-around">
              <h1 class="text-2xl font-bold">{{ workInfo.title }}</h1>
              <div class="flex items-center">
                <el-tag
                  :type="statusType"
                  effect="plain"
                  size="small"
                  class="mr-2"
                >
                  {{ statusLabel }}
                </el-tag>
                <el-tag
                  v-for="item in workInfo.categorys"
                  :key="item.id"
                  type="info"
                  effect="plain"
                  size="small"
                  class="mr-2"
                  >{{ item.name }}</el-tag
                >
              </div>
              <div>
                <span class="text-2xl text-[#333] mr-1">{{
                  formateCount(workInfo.count)
                }}</span>
                <span class="text-[12px] opacity-40">字</span>
              </div>
              <div>
                <span class="text-sm"
                  >最近更新：{{ formateTime(workInfo.updateTime) }}</span
                >
              </div>
              <div>
                <el-button
                  v-if="chapterList.length > 0"
                  class="w-[150px]"
                  round
                  type="success"
                  @click="gotoReader(chapterList[0]!.id)"
                  >开始阅读</el-button
                >
                <el-button class="w-[150px]" round>加入书架</el-button>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="w-full h-full flex items-center justify-center text-gray-400"
            >
              加载中...
            </div>
          </template>
        </div>
        <div class="h-[224px] w-[30%] flex items-center justify-center">
          <div class="flex flex-col items-center">
            <el-avatar :size="72" :src="author.avatar" />
            <div class="mt-3 flex items-center">
              <el-tag type="warning" size="small" effect="light" class="mr-2">
                <el-icon class="mr-1"><EditPen /></el-icon>
                作者
              </el-tag>
              <span class="text-xl font-semibold text-gray-900">{{
                workInfo?.user.username || "无名氏"
              }}</span>
            </div>
            <div class="mt-2 text-sm text-gray-500">{{ author.bio }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-[1200px] bg-white min-h-[800px] mx-auto my-10 shadow rounded-lg px-4"
    >
      <!-- 作品简介 -->
      <section class="px-8 py-6 border-b border-[#e5e5e5]">
        <h2 class="text-xl font-semibold mb-4">作品简介</h2>
        <p class="text-gray-700 leading-7">
          {{ workInfo?.description }}
        </p>
      </section>

      <!-- 目录 -->
      <section class="px-8 py-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            目录 · {{ workInfo?.chapterCount }}章
          </h2>
        </div>

        <div class="mt-6 flex flex-wrap">
          <div
            v-for="ch in chapterList"
            :key="ch.id"
            class="flex items-center space-x-2 w-[33%] h-[20px] mt-5"
            @click="gotoReader(ch.id)"
          >
            <span
              class="truncate text-[#333] opacity-80 text-base cursor-pointer hover:text-red-500"
              >{{ ch.title }}</span
            >
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
