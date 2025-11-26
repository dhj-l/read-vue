<template>
  <div class="w-full min-h-full bg-[#1a1a1a] flex justify-center">
    <ReadChapter
      :chapter="chapter"
      @change="changeChapter"
      :chapter-list="chapterList"
    />
  </div>
</template>

<script setup lang="ts">
import ReadChapter from "@/components/read-chapter/read-chapter.vue";
import { useReadChapter } from "@/views/reader/useReadChapter";

const { chapter, chapterList, changeChapter } = useReadChapter();
</script>

<style scoped></style>
