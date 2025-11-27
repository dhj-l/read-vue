<template>
  <div class="w-[56px] flex flex-col">
    <div
      class="w-full h-[56px] rounded-lg bg-[#262626] my-[8px]"
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
