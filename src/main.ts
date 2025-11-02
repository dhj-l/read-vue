import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style/index.css";

// 创建应用实例
const app = createApp(App);

// 创建Pinia实例
const pinia = createPinia();

// 使用插件
app.use(pinia).use(router).use(ElementPlus).mount("#app");
