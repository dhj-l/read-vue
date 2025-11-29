<template>
  <div
    class="w-full min-h-full flex justify-center px-[120px] bg-gray-50 dark:bg-[#1a1a1a] transform transition-all duration-300"
  >
    <ReadChapter
      :chapter="chapter"
      @change="changeChapter"
      :chapter-list="chapterList"
      :segments="segments"
    />
    <ReadAside
      class="fixed top-1/2 right-0 sm:right-[32px] md:right-[48px] lg:left-[min(calc(50%+480px+48px),calc(100vw-56px-48px))]"
      :segments="segments"
    />
  </div>
</template>

<script setup lang="ts">
import ReadAside from "@/components/read-aside/read-aside.vue";
import ReadChapter from "@/components/read-chapter/read-chapter.vue";
import { useReadChapter } from "@/views/reader/useReadChapter";

const { chapter, chapterList, segments, changeChapter } = useReadChapter();
</script>

<style scoped></style>
