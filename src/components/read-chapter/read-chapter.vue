<template>
  <div
    class="read w-[960px] min-h-full px-[80px] bg-white dark:bg-[#262626] transform transition-all duration-300"
  >
    <header
      class="sticky top-0 bg-white dark:bg-[#262626] flex justify-between items-center h-[80px] text-gray-800 dark:text-[#b3b3b3] border-b border-gray-200 dark:border-[#b3b3b329] transform transition-all duration-300"
    >
      <!-- 标题 -->
      <div
        class="text-[18px] flex min-w-[120px] h-full items-center cursor-pointer text-gray-800 hover:text-gray-900 dark:text-[#b3b3b3] dark:hover:text-white"
      >
        <ArrowLeft class="w-[20px] h-[20px] mr-[12px]" />

        <span>{{ chapter.name }}</span>
      </div>
      <!-- 用户信息展示 -->
      <div class="text-[14px] w-1/2 flex justify-end">
        <el-dropdown class="cursor-pointer">
          <span class="flex items-center text-gray-700 dark:text-[#b3b3b3]">
            {{ userInfo?.username }}
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
    <!-- 内容部分 -->
    <div class="mt-10">
      <!-- 标题 -->
      <div class="text-xl font-medium text-gray-800 dark:text-[#b3b3b3]">
        <h1>{{ chapter.name }}</h1>
        <p class="text-sm mt-2 text-gray-500 dark:text-[#b3b3b366]">
          <span class="mr-[20px]">本章字数: {{ chapter.count }}字</span>
          <span>更新时间: {{ formateTime(chapter.updateTime) }}</span>
        </p>
      </div>
      <!-- 内容部分 -->
      <div class="mt-[24px] space-y-[16px] text-gray-800 dark:text-[#b3b3b3]">
        <p
          v-for="(seg, idx) in segments"
          :key="idx"
          class="indent-[2em] leading-8"
        >
          {{ seg }}
        </p>
      </div>
    </div>
    <ListenBook :segments="segments" />
    <footer
      class="my-[80px] text-[16px] flex items-center w-full justify-center text-gray-700 dark:text-[#b3b3b3]"
    >
      <template v-for="item in btnConfig" :key="item.label">
        <button v-if="item.visible?.()" v-bind="item.props" @click="item.click">
          {{ item.label }}
        </button>
      </template>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { ChapterItem } from "@/api/chapter/type";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useReadChapter } from "./useReadChapter";
import { useUserStore } from "@/stores/modules/user/user";
import { storeToRefs } from "pinia";
import { formateTime } from "@/utils/formdate";
import { computed } from "vue";
import { segmentText } from "@/utils/text-segment";
import type { ReadChapterEmits, ReadChapterProps } from "./type";
import ListenBook from "@/components/ListenBook.vue";

//章节阅读器
const props = withDefaults(defineProps<ReadChapterProps>(), {
  chapter: () => ({} as ChapterItem),
  chapterList: () => [] as ChapterItem[],
});
const emits = defineEmits<ReadChapterEmits>();
const { dropMenuConfigs, btnConfig } = useReadChapter(props, emits);
const { userInfo } = storeToRefs(useUserStore());

const segments = computed<string[]>(() =>
  segmentText(props.chapter.content ?? "", { mode: "sentence" })
);

// dark mode handled via tailwind dark: variants inherited from reader container
</script>

<style scoped></style>
