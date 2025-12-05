<template>
  <div class="w-[1440px] min-h-[500px] flex mb-25 mt-5">
    <div class="w-60 bg-white rounded-xl mr-4 p-4">
      <el-menu :default-active="active" router>
        <template v-for="item in menuRoutes" :key="item.name">
          <el-menu-item
            v-if="item.meta?.show"
            :index="item.path"
            class="flex items-center"
          >
            <div class="w-5 h-5 mr-2">
              <component :is="item.meta?.icon" />
            </div>
            <p>
              {{ item.meta?.title || item.name }}
            </p>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="w-[1200px] bg-white rounded-xl">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const menuRoutes = computed(() => {
  return (
    router.getRoutes().find((item) => item.name === "writer")?.children || []
  );
});

const active = ref("/home/writer/center");
</script>

<style scoped>
:deep(.el-menu) {
  border: none;
}
</style>
