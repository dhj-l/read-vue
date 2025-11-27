<template>
  <div
    class="w-full min-h-full flex justify-center px-[120px] bg-gray-50 dark:bg-[#1a1a1a] transform transition-all duration-300"
    :class="{ dark: readStatus === 'dark' }"
  >
    <ReadChapter
      :chapter="chapter"
      @change="changeChapter"
      :chapter-list="chapterList"
    />
    <ReadAside
      class="fixed top-1/2 right-0 sm:right-8 md:right-12 lg:left-[min(calc(50%+480px+48px),calc(100vw-56px-48px))]"
    />
  </div>
</template>

<script setup lang="ts">
import ReadAside from "@/components/read-aside/read-aside.vue";
import ReadChapter from "@/components/read-chapter/read-chapter.vue";
import { useReadChapter } from "@/views/reader/useReadChapter";
import { useReadConfigStore } from "@/stores/modules/read-config/read-config";
import { storeToRefs } from "pinia";
// no need for computed classes; use tailwind dark variant

const { chapter, chapterList, changeChapter } = useReadChapter();

const { readStatus } = storeToRefs(useReadConfigStore());
// toggling 'dark' class via binding enables dark: utilities
</script>

<style scoped></style>
