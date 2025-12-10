<template>
  <div
    class="w-full h-screen overflow-hidden bg-[#fafaf8] flex flex-col dark:bg-[#2b2b2b]"
  >
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
        <el-button type="primary" @click="handleSave"> 保存 </el-button>
        <el-button
          type="success"
          @click="handlePublish"
          v-if="status === -1 || status === 2"
        >
          发布
        </el-button>
      </div>
    </header>
    <div class="flex-1 mt-5 px-10 h-[calc(100vh-100px-20px)] overflow-hidden">
      <el-splitter
        class="bg-white dark:bg-[#353535] w-full h-full rounded-lg shadow-md"
      >
        <el-splitter-panel
          size="10%"
          :max="300"
          :min="200"
          class="bg-[#f9fafb] h-full"
        >
          <div
            class="w-full h-full overflow-y-auto overscroll-contain scroll-thin"
          >
            <ConversationList />
          </div>
        </el-splitter-panel>
        <el-splitter-panel size="70%" :min="1000">
          <div
            class="w-full h-full flex justify-center overflow-y-auto overscroll-contain scroll-thin"
          >
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
          <div
            class="w-full h-full overflow-y-auto overscroll-contain scroll-thin"
          >
            <!-- ai对话区域 -->
            <Chat />
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
import Chat from "@/components/chat/chat.vue";
import ConversationList from "@/components/conversationList/conversationList.vue";
import type { CreateChapterRequest } from "@/api/chapter/type";
import {
  createChapterAPI,
  getChapterDetailAPI,
  publishChapterAPI,
  updateChapterAPI,
} from "@/api/chapter/chapter";
import { useRoute } from "vue-router";
import emitter from "@/utils/eventEmitter";

const route = useRoute();

const chapterNo = ref<number>(1);
const chapterTitle = ref<string>("");
const maxTitleLength = 30;
const titleCount = computed(() => chapterTitle.value.length);
const content = ref<string>("");
const editorRef = ref<typeof Editor>();
const lastTitle = ref<string>("");
const lastContent = ref<string>("");
const status = ref(-1);
const workId = computed(() => {
  return Number(route.query.workId || 0);
});
const chapterId = computed(() => {
  return Number(route.query.chapterId);
});
//创建章节
const createChapter = async (data: CreateChapterRequest) => {
  if (!workId.value) {
    emitter.emit("message", {
      type: "error",
      content: "书籍不存在",
    });
    return;
  }
  await createChapterAPI(workId.value, data);
};

//更新章节
const updateChapter = async (chapterId: number, data: CreateChapterRequest) => {
  await updateChapterAPI(chapterId, data);
};

const validateTitle = () => {
  if (!chapterTitle.value) {
    emitter.emit("message", {
      type: "error",
      content: "请输入标题",
    });
    return false;
  } else return true;
};
const validateContent = (content: string) => {
  if (!content) {
    emitter.emit("message", {
      type: "error",
      content: "请输入内容",
    });
    return false;
  } else return true;
};

const handleSave = async () => {
  const titleValid = validateTitle();
  const contentText = editorRef.value?.editor.getText() || "";
  const contentValid = validateContent(contentText);
  if (!titleValid || !contentValid) return;
  if (
    lastTitle.value === chapterTitle.value &&
    lastContent.value === contentText
  ) {
    emitter.emit("message", {
      type: "error",
      content: "内容未改变",
    });
    return;
  }
  lastTitle.value = chapterTitle.value;
  lastContent.value = contentText;
  const data: CreateChapterRequest = {
    content: contentText,
    contentHtml: content.value,
    name: `第${chapterNo.value}章: ${chapterTitle.value}`,
  };
  if (chapterId.value) {
    await updateChapter(chapterId.value, data);
  } else {
    await createChapter(data);
  }
  emitter.emit("message", {
    type: "success",
    content: "保存成功",
  });
};

//根据传入的章节名称获取章节号
const getChapterNo = (name: string) => {
  const match = name.match(/第(\d+)章/);
  return match ? Number(match[1]) : 0;
};
//根据传入的章节名称获取章节标题
const getChapterTitle = (name: string) => {
  const [, title = ""] = name.split(":");
  return title.trim();
};

const getChapterDetail = async (chapterId: number) => {
  //如果没有传递章节id就不用获取
  if (!chapterId) return;
  const res = await getChapterDetailAPI(chapterId);
  const { data } = res;
  chapterNo.value = getChapterNo(data.name || "");
  chapterTitle.value = getChapterTitle(data.name || "");
  content.value = data.contentHtml || data.content || "";
  status.value = data.status;
};

const handlePublish = async () => {
  const titleValid = validateTitle();
  const contentText = editorRef.value?.editor.getText() || "";
  const contentValid = validateContent(contentText);
  if (!titleValid || !contentValid) return;
  await handleSave();
  await publishChapterAPI(chapterId.value);
  emitter.emit("message", {
    type: "success",
    content: "发布成功，等待审核",
  });
  getChapterDetail(chapterId.value);
};

onMounted(() => {
  getChapterDetail(chapterId.value);
});
</script>

<style scoped>
.scroll-thin {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.scroll-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scroll-thin::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
}
.scroll-thin::-webkit-scrollbar-track {
  background: transparent;
}
</style>
