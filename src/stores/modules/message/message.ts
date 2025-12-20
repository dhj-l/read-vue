import { getConversationListAPI } from "@/api/conversations/conversations";
import type { ConversationItem } from "@/api/conversations/type";
import { getMessageListAPI } from "@/api/messages/messages";
import type { Message } from "@/components/chat/type";

import { getItem, removeItem, setItem } from "@/utils/storage";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMessageStore = defineStore("message", () => {
  const messageList = ref<Message[]>([]);
  const conversationId = ref<string>(getItem("conversationId", false) || "");
  const conversationList = ref<ConversationItem[]>([]);
  const status = computed(() => {
    return messageList.value.length > 0;
  });
  const lastIndex = computed(() => {
    return messageList.value.length - 1;
  });
  const setConversationId = (id: string | number) => {
    const str = String(id);
    conversationId.value = str;
    setItem("conversationId", str);
  };

  const pushMessage = (message: Message) => {
    messageList.value.push(message);
  };

  const updateMessageContent = (chunk: string) => {
    if (messageList.value[lastIndex.value]) {
      messageList.value[lastIndex.value]!.content += chunk;
    }
  };
  const updateMessageItem: <T extends keyof Message>(
    key: T,
    value: Message[T]
  ) => void = (key, value) => {
    if (messageList.value[lastIndex.value]) {
      messageList.value[lastIndex.value]![key] = value;
    }
  };

  const getConversationList = async () => {
    const res = await getConversationListAPI();
    conversationList.value = res.data || [];
  };

  const getMessageList = async () => {
    if (!conversationId.value) return;
    const res = await getMessageListAPI(Number(conversationId.value));
    const { data } = res;
    messageList.value = (data || []).map((item) => {
      return {
        content: item.message,
        type: item.type,
        state: item.state,
      };
    });
  };
  const removeConversation = () => {
    removeItem("conversationId");
    conversationId.value = "";
    messageList.value = [];
  };

  return {
    messageList,
    conversationId,
    status,
    lastIndex,
    conversationList,
    setConversationId,
    pushMessage,
    getMessageList,
    updateMessageContent,
    updateMessageItem,
    removeConversation,
    getConversationList,
  };
});
