import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 创建应用实例
const app = createApp(App);

// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 创建Pinia实例
const pinia = createPinia();

// 使用插件
app.use(pinia).use(router).use(ElementPlus).mount("#app");
