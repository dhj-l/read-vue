<template>
  <div class="w-full h-full">
    <el-popover trigger="click" width="370px" placement="right">
      <template #reference>
        <div
          class="w-full h-full flex items-center justify-center text-[18px] font-serif font-bold text-gray-600 dark:text-[#b3b3b3] cursor-pointer"
        >
          <span>听书</span>
        </div>
      </template>
      <Listen :segments="segments || []" />
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Listen from "./components/listen.vue";
const props = withDefaults(
  defineProps<{
    segments: string[];
  }>(),
  {
    segments: () => [],
  }
);
const segments = ref<string[]>([]);
watch(
  () => props.segments,
  (newVal) => {
    segments.value = newVal;
  }
);
</script>

<style scoped></style>
