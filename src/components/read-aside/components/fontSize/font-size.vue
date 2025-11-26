<template>
  <div class="w-full h-full">
    <el-popover effect="dark" placement="left">
      <template #reference>
        <div
          class="text-[18px] cursor-pointer text-[#b3b3b3] w-full h-full flex flex-col items-center justify-center"
        >
          <p>A</p>
          <p class="text-[12px]">字号</p>
        </div>
      </template>
      <el-slider
        @input="handleChange"
        v-model="value"
        :step="4"
        show-stops
        :min="16"
        :max="32"
      />
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { useReadConfigStore } from "@/stores/modules/read-config/read-config";
import emitter from "@/utils/eventEmitter";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
const { setFontSize, init } = useReadConfigStore();
const { fontSize } = storeToRefs(useReadConfigStore());
const value = ref(fontSize.value || 16);

const handleChange = (val: number) => {
  emitter.emit("changeFontSize", val);
  setFontSize(val);
};

onMounted(() => {
  init();
});
</script>

<style scoped></style>
