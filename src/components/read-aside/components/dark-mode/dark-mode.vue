<template>
  <div
    class="w-full h-full transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-gray-600 dark:text-[#b3b3b3]"
    @click="changeStatus"
  >
    <template v-if="readStatus === 'dark'">
      <Sunny class="w-[24px] h-[24px]" />
      <p class="text-[12px]">{{ text }}</p>
    </template>
    <template v-else>
      <Moon class="w-[24px] h-[24px]" />
      <p class="text-[12px]">{{ text }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useReadConfigStore } from "@/stores/modules/read-config/read-config";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { setStatus } = useReadConfigStore();
const { readStatus } = storeToRefs(useReadConfigStore());
const text = computed(() => (readStatus.value === "dark" ? "日间" : "夜间"));

// text color handled via tailwind dark: variant

const changeStatus = () => {
  setStatus(readStatus.value === "dark" ? "light" : "dark");
};
</script>

<style scoped></style>
