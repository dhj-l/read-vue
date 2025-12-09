import http from "../http";
import type { ConversationItem } from "./type";

export const getConversationListAPI = async () => {
  return http.get<ConversationItem[]>("/conversations");
};
