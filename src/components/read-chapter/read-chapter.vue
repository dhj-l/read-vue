<template>
  <div class="w-[960px] min-h-full bg-[#262626] px-20">
    <header class="flex justify-between items-center h-[80px] text-[#b3b3b3]">
      <!-- 标题 -->
      <div
        class="text-lg flex min-w-[120px] h-full items-center cursor-pointer hover:text-white"
      >
        <ArrowLeft class="w-5 h-5 mr-3" />
        <span>标题</span>
      </div>
      <!-- 用户信息展示 -->
      <div class="text-sm w-1/2 flex justify-end">
        <el-dropdown class="cursor-pointer">
          <span class="el-dropdown-link">
            Dropdown List
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in dropMenuConfigs"
                :key="item.label"
                @click="item.click"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import type { ChapterItem } from "@/api/chapter/type";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useReadChapter } from "./useReadChapter";
//章节阅读器
const props = withDefaults(
  defineProps<{
    chapter: ChapterItem;
  }>(),
  {
    chapter: () => ({} as ChapterItem),
  }
);
const { dropMenuConfigs } = useReadChapter();
</script>

<style scoped></style>
