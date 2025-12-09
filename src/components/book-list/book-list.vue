<template>
  <div class="w-full h-full">
    <!-- 书籍列表展示区域 -->
    <div class="w-full min-h-[500px]">
      <template v-if="workList.length > 0">
        <!-- 头部 -->
        <div
          class="w-full h-[44px] flex border-b border-[#ccc] box-border px-8 mb-5"
        >
          <div
            class="transition-all duration-100 whitespace-nowrap h-[44px] mr-6 flex items-center box-border text-sm cursor-pointer hover:text-[#fa6725]"
            v-for="(item, index) in sortConfig"
            :key="index"
            :class="{
              'border-b-3 border-[#fa6725] text-[#fa6725]': index === sortIndex,
            }"
            @click="setSortIndex(index)"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="w-full h-[44px] flex items-center text-sm" v-if="showTotal">
          共有 <span class="text-red-500 mx-1">{{ total }}</span> 本相关书籍
        </div>
      </template>
      <!-- 内容 -->
      <div class="w-full">
        <div class="flex flex-wrap" v-if="workList.length > 0">
          <template v-for="item in workList" :key="item.id">
            <BookCard
              v-if="props.cardType === 'plan'"
              class="mt-10 mr-22"
              :work="item"
            />
            <BookCardDetail class="mb-10" v-else :work="item" border shadow />
          </template>
        </div>
        <el-empty v-else description="暂无数据" />
      </div>
    </div>
    <!-- 分页 -->
    <div class="flex w-full justify-center">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="prev, pager, next"
        :hide-on-single-page="hidePage"
        @current-change="emits('change', params)"
        @page-size-change="emits('change', params)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { BookListEmits, BookListProps } from "./type";
import { SortOrder } from "@/layout/works/type";
import BookCardDetail from "../book-card-detail/book-card-detail.vue";

const props = withDefaults(defineProps<BookListProps>(), {
  sortConfig: () => [],
  workList: () => [],
  cardType: "plan",
  showTotal: false,
});
const emits = defineEmits<BookListEmits>();
const total = computed(() => props.workList.length);
const page = ref(1);
const pageSize = ref(10);
const hidePage = computed(() => total.value <= pageSize.value);
const sortIndex = ref(0);
const params = computed(() => {
  return {
    page: page.value,
    pageSize: pageSize.value,
    sort: (props.sortConfig[sortIndex.value]?.value ||
      SortOrder.HOT) as SortOrder,
  };
});
const setSortIndex = (index: number) => {
  sortIndex.value = index;
  emits("change", params.value);
};
</script>

<style scoped></style>
