<template>
  <div class="w-full h-dvh flex flex-col">
    <Header class="h-20" v-bind="headerProps" />
    <div class="flex-1 flex justify-center bg-[#f5f5f5]">
      <RouterView />
    </div>
    <Footer class="h-[348px]" />
  </div>
</template>

<script setup lang="ts">
import Header from "./header/header.vue";
import Footer from "./footer/footer.vue";
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { useBookShelfStore } from "@/stores/modules/book-shelf/book-shelf";
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
      showSearch: route.name !== "search",
    };
  }
});
console.log(headerProps.value);

const { getBookShelfList } = useBookShelfStore();
onMounted(() => {
  getBookShelfList({
    page: 1,
    pageSize: 10,
  });
});
</script>

<style scoped></style>
