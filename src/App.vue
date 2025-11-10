<template>
  <div class="h-dvh">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import emitter from "@/utils/eventEmitter";
import { ElMessage } from "element-plus";
import { onMounted } from "vue";
onMounted(() => {
  emitter.on("noAuth", () => {
    localStorage.removeItem("token");
    ElMessage.error("登录过期，请重新登录");
  });
  emitter.on("requestError", (msg: string) => {
    ElMessage.error(msg);
  });
});
</script>

<style scoped></style>
