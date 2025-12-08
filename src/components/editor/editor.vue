<template>
  <div class="w-full h-[calc(100vh-12rem)]">
    <EditorContent class="w-full h-full" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { onUnmounted, watch } from "vue";
const content = defineModel("content", {
  type: String,
  default: "",
});
const editor = useEditor({
  content: content.value,
  extensions: [StarterKit],
  onUpdate({ editor }) {
    content.value = editor.getHTML();
    console.log(content.value);
  },
});
watch(content, (newVal) => {
  if (editor.value && newVal == editor.value.getHTML()) return;
  editor.value?.commands.setContent(newVal);
});

onUnmounted(() => {
  editor.value?.destroy();
});
defineExpose({
  editor,
});
</script>

<style scoped>
/* 控制编辑器内容区域的容器 */
:deep(.tiptap) {
  height: 100%;
  /* 可选：添加内边距让内容不贴边 */
  padding: 1rem;
}

/* 1. 移除所有焦点状态下的边框和轮廓 */
:deep(.tiptap:focus),
:deep(.tiptap:focus-visible),
:deep(.ProseMirror-focused) {
  outline: none;
  border: none;
  box-shadow: none;
}

/* 2. 为所有段落添加首行缩进 */
:deep(.tiptap p) {
  text-indent: 2em;
  /* 同时确保段落有合适的外边距，保持可读性 */
  margin-bottom: 0.75em;
}
</style>
