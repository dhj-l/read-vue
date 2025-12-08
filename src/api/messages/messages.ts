import http from "../http";
import type { MessageItem } from "./type";

export const getMessageListAPI = async (id: number) => {
  return http.get<MessageItem[]>("/messages", {
    params: {
      conversationId: id,
    },
  });
};
