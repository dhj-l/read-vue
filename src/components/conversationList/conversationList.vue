<template>
  <div class="w-full px-2">
    <div class="flex h-18 justify-center items-center">
      <el-button
        round
        class="w-full shadow-sm"
        :icon="CirclePlus"
        @click="handleNewConversation"
        >开启新对话</el-button
      >
    </div>
    <Conversations
      :items="items"
      :menu="menuConfig"
      :active-key="String(conversationId)"
      @active-change="handleActiveChange"
      ref="conversationsRef"
    />
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from "@/stores/modules/message/message";
import { Conversations, type ConversationsProps } from "ant-design-x-vue";
import { storeToRefs } from "pinia";
import { computed, h, onMounted } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { removeConversationAPI } from "@/api/conversations/conversations";
import emitter from "@/utils/eventEmitter";
const { conversationId, conversationList } = storeToRefs(useMessageStore());
const { setConversationId, removeConversation, getConversationList } =
  useMessageStore();
const items = computed<ConversationsProps["items"]>(() => {
  const items = conversationList.value.map((item) => {
    return {
      key: String(item.id),
      label: item.title,
      ...item,
    };
  });

  return items;
});
const menuConfig: ConversationsProps["menu"] = (conversation) => ({
  items: [
    {
      label: "删除会话",
      key: conversation.key,
      icon: h(DeleteOutlined),
      danger: true,
    },
  ],
  onClick: async (menuInfo) => {
    await removeConversationItem(String(menuInfo.key));
    if (String(menuInfo.key) === conversationId.value) {
      removeConversation();
    }
    await getConversationList();
    emitter.emit("message", {
      type: "success",
      content: "删除会话成功",
    });
  },
});

const removeConversationItem = async (key: string) => {
  await removeConversationAPI(key);
};

const handleActiveChange = (key: string) => {
  setConversationId(key);
};
const handleNewConversation = () => {
  removeConversation();
};

onMounted(() => {
  getConversationList();
});
</script>

<style scoped></style>
