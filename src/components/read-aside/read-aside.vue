<template>
  <div class="w-[56px] flex flex-col">
    <div
      class="w-full h-[56px] rounded-[8px] my-[8px] bg-white border border-gray-200 shadow-sm dark:bg-[#262626] dark:border-transparent dark:shadow-none"
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
import ToolBar from "./components/tool-bar/tool-bar.vue";
const componentList = [FontSize, DarkMode, ToolBar];
</script>

<style scoped></style>
