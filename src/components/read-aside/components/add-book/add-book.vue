<template>
  <div
    class="w-full px-1 h-full transition-all duration-300 flex flex-col text-[16px] items-center justify-center font-serif font-bold text-gray-600 dark:text-[#b3b3b3]"
    @click="addToShelfHandler"
    :class="state ? 'cursor-not-allowed' : ' cursor-pointer'"
  >
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { useBookShelfStore } from "@/stores/modules/book-shelf/book-shelf";
import emitter from "@/utils/eventEmitter";
import { computed } from "vue";
import { useRoute } from "vue-router";

const { addToShelf, isInShelf } = useBookShelfStore();
const route = useRoute();
const workId = computed(() => Number(route.query.workId));
const state = computed(() => isInShelf(workId.value));
const addToShelfHandler = async () => {
  if (state.value) {
    return;
  }
  await addToShelf(workId.value);
  emitter.emit("message", {
    type: "success",
    content: "加入书架成功",
  });
};
const text = computed(() => {
  return isInShelf(workId.value) ? "已在书架" : "加入书架";
});
</script>

<style scoped></style>
