import { API_BASE_URL } from "@/config/config";
import emitter from "@/utils/eventEmitter";
import { getItem } from "@/utils/storage";
import { io } from "socket.io-client";

export const useSocket = (path: string) => {
  const getToken = () => {
    const token = getItem("token", false) || "";
    if (token) {
      return token;
    } else {
      emitter.emit("noAuth");
    }
  };
  const token = getToken();
  const socket = io(`${API_BASE_URL}${path}`, {
    auth: { token },
  });

  return {
    socket,
  };
};
