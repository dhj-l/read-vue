import mitt from "mitt";

// 定义事件类型
type Events = {
  noAuth: void;
  requestError: string;
  login: void;
  message: {
    type: "success" | "error" | "warning" | "info";
    content: string;
  };
  logout: void;
};

const emitter = mitt<Events>();
export default emitter;
