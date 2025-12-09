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
import { computed, onMounted } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
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
