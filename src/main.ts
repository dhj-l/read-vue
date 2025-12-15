import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./style/index.css";
import "./style/dark/css-vars.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "@/ui/messageHandler";
import "@/router/authHandler";
import "@/router/guards";
// 创建应用实例
const app = createApp(App);

// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 创建Pinia实例
const pinia = createPinia();

// 使用插件
app
  .use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");
