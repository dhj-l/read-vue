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
  changeFontSize: number;
  setHtmlAttr: {
    key: string;
    value: string;
  };
  setIdxIndex: number;
  nextChapter: {
    play: boolean;
  };
  permission: void;
  permissionAdded: void;
  changeActive: string;
};

const emitter = mitt<Events>();

emitter.on("changeFontSize", (val) => {
  const html = document.querySelector("html");
  if (html) {
    html.style.fontSize = `${val}px`;
  }
});

emitter.on("setHtmlAttr", (val) => {
  const html = document.querySelector("html");
  if (html) {
    html.setAttribute(val.key, val.value);
  }
});
export default emitter;
