<template>
  <div class="w-full h-full bg-[#fafaf8] flex flex-col dark:bg-[#2b2b2b]">
    <header
      class="p-5 h-[100px] w-full bg-white dark:bg-[#353535] flex items-center justify-between"
    >
      <Back class="w-[100px]" />
      <div class="flex-1 h-[80px] flex items-center justify-between">
        <div class="flex items-baseline space-x-6 flex-1">
          <span class="text-2xl">第</span>
          <input
            type="number"
            min="1"
            v-model.number="chapterNo"
            class="w-16 text-2xl bg-transparent border-b border-black outline-none text-center"
          />
          <span class="text-2xl">章</span>
          <input
            type="text"
            v-model.trim="chapterTitle"
            :maxlength="maxTitleLength"
            placeholder="请输入标题"
            class="flex-1 text-2xl bg-transparent outline-none placeholder:text-[#b0b4ba]"
          />
        </div>
        <div class="text-[#fa6725] text-sm w-[40px]">
          {{ titleCount }}/{{ maxTitleLength }}
        </div>
      </div>
      <div class="w-[220px] flex justify-end">
        <el-button type="primary"> 保存 </el-button>
      </div>
    </header>
    <div class="flex-1 mt-5 px-10">
      <el-splitter
        class="bg-white dark:bg-[#353535] w-full h-full rounded-lg shadow-md"
      >
        <el-splitter-panel size="80%" :min="1000">
          <div class="w-full h-full flex justify-center">
            <div class="w-[980px] min-h-[1000px]">
              <!-- 文本编辑器部分 -->
              <Editor
                class="w-full min-h-[800px]"
                ref="editorRef"
                v-model:content="content"
              />
            </div>
          </div>
        </el-splitter-panel>
        <el-splitter-panel size="20%" :min="400">
          <div class="demo-panel">
            <!-- ai对话区域 -->
          </div>
        </el-splitter-panel>
      </el-splitter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Back from "@/components/back/back.vue";
import Editor from "@/components/editor/editor.vue";

const chapterNo = ref<number>(1);
const chapterTitle = ref<string>("");
const maxTitleLength = 30;
const titleCount = computed(() => chapterTitle.value.length);
const content = ref<string>("");
const editorRef = ref<typeof Editor>();

onMounted(() => {});
</script>

<style scoped></style>
