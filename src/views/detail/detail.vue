<script setup lang="ts">
import { EditPen } from "@element-plus/icons-vue";
import { ref, computed, onMounted } from "vue";
import { useDetail } from "./useDetail";
import { useRoute } from "vue-router";
import { API_BASE_URL } from "@/config/config";
import { workStatusMap } from "@/layout/works/config";
import { formateTime } from "@/utils/formdate";

const { workInfo, getWorkInfo } = useDetail();
const route = useRoute();

onMounted(() => {
  getWorkInfo(Number(route.query.id));
});

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

interface ChapterItem {
  id: number;
  title: string;
}
interface Volume {
  title: string;
  count: number;
  chapters: ChapterItem[];
}

const volumes: Volume[] = [
  {
    title: "第一卷：戏中人",
    count: 320,
    chapters: Array.from({ length: 40 }).map((_, i) => ({
      id: i + 1,
      title: `第${i + 1}章 标题占位`,
    })),
  },
  {
    title: "第二卷：破局",
    count: 280,
    chapters: Array.from({ length: 40 }).map((_, i) => ({
      id: i + 100,
      title: `第${i + 1}章 标题占位`,
    })),
  },
];

const volumeIndex = ref<number>(0);
const EMPTY_VOLUME: Volume = { title: "", count: 0, chapters: [] };
const currentVolume = computed<Volume>(
  () => volumes[volumeIndex.value] ?? EMPTY_VOLUME
);
const totalChapters = computed(() =>
  volumes.reduce((acc, v) => acc + v.count, 0)
);

const statusLabel = computed(() =>
  workInfo.value ? workStatusMap.get(workInfo.value.status)?.label ?? "" : ""
);
const statusType = computed(() =>
  workInfo.value
    ? workStatusMap.get(workInfo.value.status)?.type ?? "info"
    : "info"
);
const wordCount = computed(() => {
  const c = Number(workInfo.value?.count ?? 0);
  return (c / 10000).toFixed(1);
});
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
                <span class="text-2xl text-[#333] mr-1">{{ wordCount }}</span>
                <span class="text-[12px] opacity-40">万字</span>
              </div>
              <div>
                <span class="text-sm"
                  >最近更新：{{ formateTime(workInfo.updateTime) }}</span
                >
              </div>
              <div>
                <el-button class="w-[150px]" round type="success"
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
                author.name
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
          赤色流星划过天际后，人类文明陷入停滞。从那天起，人们再也无法制造一枚火箭、一颗核弹、一架飞机、一台汽车……近代科学推倒而成的文明金字塔轰然坍塌，而这时，远不止此。灰色的世界蔓延在高楼间，侵蚀着随后的鬼魅倒影，就要把世界一点点拖入无尽的深渊。在这个时代，人人跋涉生存；在这个时代，人类以书为最后。某一天，有人从一戏子之双目魔迹之上，红啸似血，时笑时哭，时代的骨骸在他身后缓缓打开，他跃开灰幕，...
        </p>
      </section>

      <!-- 目录 -->
      <section class="px-8 py-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">目录 · {{ totalChapters }}章</h2>
        </div>

        <div class="mt-6 flex flex-wrap">
          <div
            v-for="ch in currentVolume.chapters"
            :key="ch.id"
            class="flex items-center space-x-2 w-[33%] h-[20px] mt-5"
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
