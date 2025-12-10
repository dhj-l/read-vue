<template>
  <div
    class="w-full h-full flex flex-col rounded-lg items-center p-5"
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
    <div
      class="w-full h-full flex flex-col justify-start overflow-auto"
      v-else
      ref="messageScrollRef"
      @scroll="onScroll"
    >
      <Bubble
        v-for="(item, index) in messageList"
        :key="`${item.content}-${index}`"
        :content="item.content"
        :placement="item.type === 'answer' ? 'start' : 'end'"
        :message-render="renderMarkdown"
        :loading="
          item.type === 'answer' && item.state === 'loading'
            ? bubbleLoading
            : false
        "
        class="mb-5"
        :class-names="{ footer: '' }"
      >
        <template #footer>
          <div
            v-if="item.type === 'answer' && item.state === 'finished'"
            class="flex justify-end w-full items-center ml-1"
          >
            <Tooltip title="复制">
              <CopyOutlined
                class="cursor-pointer text-base"
                @click="copy(item.content)"
              />
            </Tooltip>
          </div>
        </template>
      </Bubble>
    </div>
    <Sender
      class="mt-5"
      :class="{ 'fixed bottom-0': status }"
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
import { h, onMounted, onUnmounted, ref, watch } from "vue";
import markdownit from "markdown-it";
import { useSocket } from "@/socket/socket";
import emitter from "@/utils/eventEmitter";
import { Typography } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useMessageStore } from "@/stores/modules/message/message";
import { useScrollHook } from "@/hooks/useScroll";
import { CopyOutlined } from "@ant-design/icons-vue";
import { Tooltip } from "ant-design-vue";
import { copy } from "@/utils/copy";
const { maybeScrollToBottom, onScroll, messageScrollRef } = useScrollHook();

const { status, messageList, conversationId } = storeToRefs(useMessageStore());
const {
  setConversationId,
  pushMessage,
  getMessageList,
  updateMessageItem,
  updateMessageContent,
  getConversationList,
} = useMessageStore();
const { socket } = useSocket("/chat");
const content = ref("");
const loading = ref(false);
const bubbleLoading = ref(false);
const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps["messageRender"] = (content) =>
  h(Typography, null, {
    default: () => h("div", { innerHTML: md.render(content) }),
  });

socket.on("chat:error", (error) => {
  emitter.emit("requestError", error.message || "请求失败");
});

const sendMessage = () => {
  if (!content.value) return;
  loading.value = true;
  bubbleLoading.value = true;
  pushMessage({
    content: content.value,
    type: "question",
    state: "finished",
  });
  if (!conversationId.value) {
    socket.emit("chat:create", { content: content.value });
  } else {
    socket.emit("chat:send", {
      content: content.value,
      conversationId: conversationId.value,
    });
  }
  content.value = "";
  pushMessage({
    content: "",
    type: "answer",
    state: "loading",
  });
  maybeScrollToBottom();
};

socket.on(
  "chat:conversationCreated",
  async ({ conversationId: newConversationId }) => {
    await getConversationList();
    setConversationId(String(newConversationId));
  }
);

//流式获取回答
socket.on("chat:stream", ({ chunk, done }) => {
  bubbleLoading.value = false;
  updateMessageContent(chunk);
  updateMessageItem("state", "stream");
  maybeScrollToBottom();
  loading.value = true;
  if (done) {
    updateMessageItem("state", "finished");
    loading.value = false;
  }
});

watch(conversationId, async (newConversationId) => {
  if (newConversationId) {
    await getMessageList();
    await maybeScrollToBottom();
  }
});

onMounted(async () => {
  socket.on("chat:connected", ({ id }) => {
    console.log("连接成功", id);
  });
  await getMessageList();
  await maybeScrollToBottom();
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<style scoped></style>
