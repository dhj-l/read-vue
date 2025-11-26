<template>
  <div class="w-[960px] min-h-full bg-[#262626] px-20">
    <header
      class="flex justify-between items-center h-[80px] text-[#b3b3b3] border-b border-[#b3b3b329]"
    >
      <!-- 标题 -->
      <div
        class="text-lg flex min-w-[120px] h-full items-center cursor-pointer hover:text-white"
      >
        <ArrowLeft class="w-5 h-5 mr-3" />

        <span>{{ chapter.name }}</span>
      </div>
      <!-- 用户信息展示 -->
      <div class="text-sm w-1/2 flex justify-end">
        <el-dropdown class="cursor-pointer">
          <span class="text-[#b3b3b3] flex items-center">
            {{ userInfo.username }}
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
      <div class="text-xl font-medium text-[#b3b3b3]">
        <h1>{{ chapter.name }}</h1>
        <p class="text-sm text-[#b3b3b366] mt-2">
          <span class="mr-5">本章字数: {{ chapter.count }}字</span>
          <span>更新时间: {{ formateTime(chapter.updateTime) }}</span>
        </p>
      </div>
      <!-- 内容部分 -->
      <div class="mt-6 space-y-4 leading-8 text-[#b3b3b3]">
        <p v-for="(seg, idx) in segments" :key="idx">{{ seg }}</p>
      </div>
    </div>
    <footer class="my-20 flex items-center w-full justify-center">
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
</script>

<style scoped></style>
