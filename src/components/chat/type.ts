export interface Message {
  content: string;
  type: "question" | "answer";
  state: "loading" | "finished" | "stream";
}
