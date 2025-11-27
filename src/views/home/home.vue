<template>
  <div class="w-full h-dvh flex flex-col">
    <Header class="h-[80px]" v-bind="headerProps" />
    <div class="flex-1 bg-[#f5f5f5]">
      <RouterView />
    </div>
    <Footer class="h-[348px]" />
  </div>
</template>

<script setup lang="ts">
import Header from "./header/header.vue";
import Footer from "./footer/footer.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
const route = useRoute();
const headerProps = computed(() => {
  if (route.path === "/home") {
    return {
      absolute: true,
    };
  } else {
    return {
      absolute: false,
      bgColor: "bg-[#f6f6f6]",
    };
  }
});
</script>

<style scoped></style>
