<template>
  <div class="w-[56px] flex flex-col">
    <div
      class="w-full h-[56px] rounded-lg my-[8px] bg-white border border-gray-200 shadow-sm dark:bg-[#262626] dark:border-transparent dark:shadow-none"
      v-for="(item, index) in componentList"
      :key="index"
    >
      <component :is="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DarkMode from "./components/dark-mode/dark-mode.vue";
import FontSize from "./components/fontSize/font-size.vue";
const componentList = [FontSize, DarkMode];
</script>

<style scoped></style>
