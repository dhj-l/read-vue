<template>
  <div
    class="w-full h-full flex flex-col items-center px-5 py-10"
    :class="{ 'justify-end': status, 'justify-center': !status }"
  >
    <div class="w-full" v-if="!status">
      <Welcome
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
      />
      <Prompts
        class="mt-5"
        title="✨ Inspirational Sparks and Marvelous Tips666"
        :items="items"
        wrap
        :styles="{
          item: {
            flex: 'none',
            width: 'calc(50% - 6px)',
          },
        }"
      />
    </div>
    <div class="w-full h-full" v-else>
      <Bubble
        v-for="item in messageList"
        :key="item.content"
        :content="item.content"
        :placement="item.type === 'answer' ? 'start' : 'end'"
        :message-render="renderMarkdown"
        class="mb-5"
      />
    </div>
    <Sender
      class="mt-5"
      v-model:value="content"
      submit-type="shiftEnter"
      :auto-size="{ minRows: 2, maxRows: 6 }"
      placeholder="Press Shift + Enter to send message"
      @submit="sendMessage"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Prompts,
  Sender,
  Welcome,
  Bubble,
  type BubbleProps,
} from "ant-design-x-vue";
import { items } from "./config";
import { computed, h, onMounted, onUnmounted, ref } from "vue";
import markdownit from "markdown-it";
import { useSocket } from "@/socket/socket";
import emitter from "@/utils/eventEmitter";
import type { Message } from "./type";
import { Typography } from "ant-design-vue";
const { socket } = useSocket("/chat");
const content = ref("");
const loading = ref(false);

const messageList = ref<Message[]>([]);
const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps["messageRender"] = (content) =>
  h(Typography, null, {
    default: () => h("div", { innerHTML: md.render(content) }),
  });
const status = computed(() => {
  return messageList.value.length > 0;
});
socket.on("chat:error", (error) => {
  emitter.emit("noAuth");
});

const sendMessage = () => {
  if (!content.value) return;
  loading.value = true;
  messageList.value.push({
    content: content.value,
    type: "question",
    state: "finished",
  });
  socket.emit("chat:create", { content: content.value });
  content.value = "";
  messageList.value.push({
    content: "",
    type: "answer",
    state: "loading",
  });
};

//流式获取回答
socket.on("chat:stream", ({ chunk, done }) => {
  messageList.value[messageList.value.length - 1]!.content += chunk;
});

onMounted(() => {
  socket.on("chat:connected", ({ id }) => {
    console.log("连接成功", id);
  });
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<style scoped></style>
