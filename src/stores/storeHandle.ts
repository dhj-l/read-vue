import emitter from "@/utils/eventEmitter";
import { useMessageStore } from "./modules/message/message";

emitter.on("logout", () => {
  const { removeConversation } = useMessageStore();
  removeConversation();
});
emitter.on("noAuth", () => {
  const { removeConversation } = useMessageStore();
  removeConversation();
});
