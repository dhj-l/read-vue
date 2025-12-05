<template>
  <div
    class="cursor-pointer hover:text-[#ff5f00] text-lg flex items-center"
    @click="router.back()"
  >
    <Back class="w-5 h-5" />
    <div>
      <slot>返回</slot>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Back } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped></style>
