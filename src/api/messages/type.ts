export interface MessageItem {
  id: number;
  message: string;
  type: "question" | "answer";
  state: "finished" | "loading" | "stream";
  role: "user" | "assistant" | "system";
}
