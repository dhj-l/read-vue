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
};

const emitter = mitt<Events>();
export default emitter;
