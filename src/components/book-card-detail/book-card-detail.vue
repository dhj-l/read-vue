<template>
  <div
    class="w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    :class="{ 'border border-[#e5e5e5]': border, 'shadow-md': shadow }"
  >
    <div class="flex flex-col md:flex-row">
      <!-- 封面图片 -->
      <div
        class="w-full md:w-48 h-64 md:h-auto cursor-pointer overflow-hidden rounded-lg"
        @click="goDetail(work.id)"
      >
        <img
          class="w-full h-full object-cover hover:scale-110 transition-all duration-300"
          :src="API_BASE_URL + work.cover_url"
          alt="{{ work.title }}"
        />
      </div>

      <!-- 详细信息 -->
      <div class="w-full p-4 flex flex-col">
        <!-- 标题和作者 -->
        <div class="mb-4" @click="goDetail(work.id)">
          <h1 class="text-xl font-bold cursor-pointer hover:text-red-600">
            {{ work.title }}
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            作者: {{ work.user.username }}
          </p>
        </div>

        <!-- 分类标签 -->
        <div class="mb-4">
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="category in work.categorys"
              :key="category.id"
              effect="plain"
              size="small"
            >
              {{ category.name }}
            </el-tag>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div class="bg-gray-50 p-2 rounded">
            <p class="text-xs text-gray-500">状态</p>
            <p class="text-sm font-medium">{{ bookStatus }}</p>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <p class="text-xs text-gray-500">字数</p>
            <p class="text-sm font-medium">{{ work.count }}字</p>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <p class="text-xs text-gray-500">章节</p>
            <p class="text-sm font-medium">{{ work.chapterCount }}章</p>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <p class="text-xs text-gray-500">阅读</p>
            <p class="text-sm font-medium">{{ work.readCount }}次</p>
          </div>
        </div>

        <!-- 描述 -->
        <div class="mb-4 flex-1">
          <p class="text-sm text-gray-600 line-clamp-4">
            {{ work.description }}
          </p>
        </div>

        <!-- 时间信息 -->
        <div class="flex flex-wrap gap-4 text-xs text-gray-500">
          <p>创建时间: {{ formateTime(work.createTime) }}</p>
          <p>更新时间: {{ formateTime(work.updateTime) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Work } from "@/api/works/type";
import { API_BASE_URL } from "@/config/config";
import { workStatusMap } from "@/layout/works/config";
import { formateTime } from "@/utils/formdate";
import { useRouter } from "vue-router";

export interface BookCardDetailProps {
  work: Work;
  border: boolean;
  shadow: boolean;
}
const props = withDefaults(defineProps<BookCardDetailProps>(), {
  border: true,
  shadow: true,
});
const router = useRouter();

const bookStatus = computed(() => {
  return workStatusMap.get(props.work.status).label;
});

const goDetail = (id: number) => {
  router.push({
    path: "/home/detail",
    query: {
      workId: id,
    },
  });
};
</script>

<style scoped>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
