<template>
  <div class="w-full h-full">
    <el-carousel trigger="click" height="410px">
      <el-carousel-item v-for="item in 4" :key="item" class="w-full h-full">
        <img
          src="@/assets/image/3.jpg"
          alt=""
          class="w-full h-full object-cover"
        />
      </el-carousel-item>
    </el-carousel>
    <div class="w-full h-[90px] bg-gray-50 flex justify-center space-x-40">
      <div
        class="w-[280px] h-full flex justify-between items-center cursor-pointer"
        v-for="(item, index) in noticeConfig"
        :key="index"
      >
        <div>
          <p
            class="text-base font-medium mb-2 text-gray-700 hover:text-red-600 hover:font-medium"
          >
            {{ item.title }}
          </p>
          <p class="text-sm text-gray-500">{{ item.subTitle }}</p>
        </div>
        <div>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
    <div class="w-[1380px] mx-auto">
      <div class="flex items-center justify-between mt-3">
        <h2 class="text-xl font-semibold">热门书籍</h2>
        <el-link type="primary">更多</el-link>
      </div>
      <div class="flex flex-col">
        <div class="flex flex-wrap">
          <BookCard
            v-for="work in workList"
            :key="work.id"
            :work="work"
            class="mr-4 mt-4"
          />
        </div>
        <el-empty
          v-if="workList.length === 0"
          image-style="height: 100px"
          description="暂无热门书籍"
          class="col-span-5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { noticeConfig } from "./config";
import BookCard from "@/components/book-card/book-card.vue";
import { onMounted, ref } from "vue";
import type { Work } from "@/api/works/type";
import { getWorksListAPI } from "@/api/works/works";
const workList = ref<Work[]>([]);

const getWorkList = async () => {
  const res = await getWorksListAPI({
    status: 6,
    page: 1,
    pageSize: 10,
  });
  workList.value = res.data.works || [];
};
onMounted(() => {
  getWorkList();
});
</script>

<style scoped></style>
