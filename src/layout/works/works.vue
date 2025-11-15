<template>
  <div class="w-full h-full">
    <div
      class="shadow-sm p-4 rounded-lg border border-gray-200 flex justify-between"
    >
      <div class="space-x-2">
        <component
          class="my-1"
          v-for="item in worksSearchConfig"
          :key="item.key"
          v-model="worksSearchQuery[item.key]"
          :is="componentMap.get(item.component)"
          v-bind="item.props"
        />
      </div>

      <div class="flex items-center">
        <el-button type="primary" icon="search"> 搜索 </el-button>
        <el-button icon="refresh"> 重置 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { componentMap } from "./config";
import { useWorks } from "./useWorks";

const { worksSearchConfig, worksSearchQuery } = useWorks();
</script>

<style scoped></style>
