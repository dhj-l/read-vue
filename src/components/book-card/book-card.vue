<template>
  <div
    class="w-80 h-36 flex items-center justify-between shadow-sm rounded-lg p-2 hover:shadow-lg transition-shadow duration-300 bg-white"
  >
    <div
      class="w-[100px] h-full rounded-lg mr-4 cursor-pointer overflow-hidden"
      @click="goDetail(work.id)"
    >
      <img
        class="w-full h-full object-cover rounded-lg hover:scale-110 transition-all duration-300"
        :src="API_BASE_URL + work.cover_url"
        alt=""
      />
    </div>
    <div class="w-[200px] h-full flex flex-col justify-between">
      <div class="w-full" @click="goDetail(work.id)">
        <h1
          class="text-lg font-bold truncate w-full cursor-pointer hover:text-red-600"
        >
          {{ work.title }}
        </h1>
      </div>
      <div
        class="w-full flex-1 text-sm overflow-hidden text-gray-500 flex flex-col justify-between"
      >
        <p>作者: {{ work.user.username }}</p>
        <p>
          <span class="mr-3">
            {{ bookStatus }}
          </span>
          <span> {{ formateCount(work.count) }}字 </span>
        </p>
        <p class="w-full clamp-2">{{ work.description }}</p>
        <p class="mt-1">{{ formateTime(work.createTime) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Work } from "@/api/works/type";
import { API_BASE_URL } from "@/config/config";
import { workStatusMap } from "@/layout/works/config";
import { formateCount, formateTime } from "@/utils/formdate";
import { useRouter } from "vue-router";

export interface BookCardProps {
  work: Work;
}
const props = defineProps<BookCardProps>();
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
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
