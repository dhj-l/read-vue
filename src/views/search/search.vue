<template>
  <div
    class="w-[1260px] min-h-[920px] flex flex-col items-center p-10 bg-white"
  >
    <div class="w-[510px]">
      <el-input
        size="large"
        v-model="keyword"
        clearable
        placeholder="请输入书名或者作者名"
        @keyup.enter="handleSearch"
      >
        <template #suffix>
          <el-icon class="cursor-pointer" @click="handleSearch">
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div v-loading="loading" class="w-full">
      <BookList
        :sortConfig="sortConfig"
        :work-list="workList"
        card-type="detail"
        :show-total="true"
        @change="handleChange"
        v-if="workList.length > 0"
      />
      <el-empty v-else description="暂无相关书籍" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BookList from "@/components/book-list/book-list.vue";
import { computed, onMounted, ref } from "vue";
import type { LibrarySort } from "../library/type";
import { SortOrder, type WorksSearchQuery } from "@/layout/works/type";
import type { Work } from "@/api/works/type";
import { useRoute } from "vue-router";
import { getWorksListAPI } from "@/api/works/works";
import { Search } from "@element-plus/icons-vue";
import type { BookListChangeParams } from "@/components/book-list/type";
import { useRouter } from "vue-router";
import { WorkStatus } from "@/layout/works/config";

const route = useRoute();
const router = useRouter();

const sortConfig = ref<LibrarySort[]>([
  {
    label: "最热",
    value: SortOrder.HOT,
  },
  {
    label: "最新",
    value: SortOrder.NEW,
  },
  {
    label: "字数",
    value: SortOrder.COUNT,
  },
]);
const loading = ref(false);
const workList = ref<Work[]>([]);

const keyword = ref((route.query.keyword as string) || "");
const params = computed(() => {
  return {
    title: keyword.value,
    username: keyword.value,
    order: SortOrder.HOT,
    status: WorkStatus.PUBLISHED_SERIAL_ENDED,
  };
});
const getWorkList = async (data: Partial<WorksSearchQuery>) => {
  if (!keyword.value) return;
  loading.value = true;
  try {
    const res = await getWorksListAPI(data);
    workList.value = res.data.works;
  } finally {
    loading.value = false;
  }
};
const handleSearch = () => {
  getWorkList(params.value);
  router.replace({
    query: {
      keyword: keyword.value,
    },
  });
};

const handleChange = (data: BookListChangeParams) => {
  const newParams = { ...params.value, ...data };
  getWorkList(newParams);
};

onMounted(() => {
  getWorkList(params.value);
});
</script>

<style scoped></style>
