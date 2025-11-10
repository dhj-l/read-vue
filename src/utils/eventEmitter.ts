import mitt from "mitt";

// 定义事件类型
type Events = {
  noAuth: void;
  requestError: string;
  login: void;
};

const emitter = mitt<Events>();
export default emitter;
