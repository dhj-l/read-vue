<template>
  <div class="w-full h-full px-30 py-5 bg-white flex flex-col items-center">
    <div class="h-full w-[1260px] py-5">
      <!-- 筛选区域 -->
      <div class="w-full h-[220px]">
        <div
          class="flex text-sm w-full h-6 mb-5"
          v-for="(group, gIdx) in filterGroups"
          :key="group.label"
        >
          <div class="w-11 text-[#00000066] mr-5 whitespace-nowrap">
            {{ group.label }}:
          </div>
          <div class="flex-1 cursor-pointer flex flex-nowrap">
            <div
              class="hover:text-[#fa6725] mr-4 p-2 flex items-center justify-center whitespace-nowrap shrink-0"
              v-for="(item, index) in group.children"
              :key="item.label"
              :class="{
                'bg-[#fa67251a] text-[#fa6725] rounded-[22px]':
                  item.value === selectedIndex[gIdx],
              }"
              @click="setGroupIndex(gIdx, item.value)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <!-- 书籍列表展示区域 -->
      <div class="w-full min-h-[500px]" v-loading="loading">
        <!-- 头部 -->
        <div
          class="w-full h-[44px] flex border-b border-[#ccc] box-border px-8"
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
        <!-- 内容 -->
        <div class="w-full">
          <div class="flex flex-wrap" v-if="workList.length > 0">
            <template v-for="item in workList" :key="item.id">
              <BookCard class="mt-10 mr-22" :work="item" />
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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "@/api/category/type";
import { computed, onMounted, ref } from "vue";
import type {
  LibraryCount,
  LibraryFilter,
  LibrarySort,
  LibraryStatus,
} from "./type";
import { CountLevel, WorkStatus } from "@/layout/works/config";
import { getCategoryListAPI } from "@/api/category/category";
import { getWorksListAPI } from "@/api/works/works";
import type { Work } from "@/api/works/type";
import BookCard from "@/components/book-card/book-card.vue";
import { SortOrder } from "@/layout/works/type";
const cateGoryConfig = ref<Category[]>([]);
const statusConfig = ref<LibraryFilter<LibraryStatus>>({
  label: "状态",
  children: [
    {
      label: "全部",
      value: WorkStatus.ALL,
    },
    {
      label: "已上架",
      value: WorkStatus.PUBLISHED,
    },
    {
      label: "连载中",
      value: WorkStatus.SERIAL,
    },
  ],
});
const countConfig = ref<LibraryFilter<LibraryCount>>({
  label: "字数",
  children: [
    {
      label: "全部",
      value: CountLevel.ALL,
    },
    {
      label: "30万以下",
      value: CountLevel.LEVEL_1,
    },
    {
      label: "30-50万字",
      value: CountLevel.LEVEL_2,
    },
    {
      label: "50-80万字",
      value: CountLevel.LEVEL_3,
    },
    {
      label: "80-120万字",
      value: CountLevel.LEVEL_4,
    },
    {
      label: "120万字以上",
      value: CountLevel.LEVEL_5,
    },
  ],
});
const loading = ref(false);

const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const hidePage = computed(() => total.value <= pageSize.value);
const categoryFilter = computed<LibraryFilter<LibraryStatus>>(() => ({
  label: "分类",
  children: [
    { label: "全部", value: -1 },
    ...cateGoryConfig.value.map((c) => ({ label: c.name, value: c.id })),
  ],
}));

const filterGroups = computed(() => [
  categoryFilter.value,
  statusConfig.value,
  countConfig.value,
]);

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
const sortIndex = ref(0);
const selectedIndex = ref<number[]>([-1, WorkStatus.ALL, CountLevel.ALL]);
const workList = ref<Work[]>([]);
const setGroupIndex = async (gIndex: number, index: number) => {
  selectedIndex.value[gIndex] = index;
  try {
    loading.value = true;
    await getWorkList();
  } finally {
    loading.value = false;
  }
};
const setSortIndex = async (index: number) => {
  sortIndex.value = index;
  try {
    loading.value = true;
    await getWorkList();
  } finally {
    loading.value = false;
  }
};

const getCategoryList = async () => {
  const res = await getCategoryListAPI({});
  cateGoryConfig.value = res.data.categories;
};
const getWorkList = async () => {
  //获取携带参数
  const params = {
    category_ids:
      selectedIndex.value[0] === 0 ? "-1" : [selectedIndex.value[0]!],
    status:
      selectedIndex.value[1] === 0
        ? WorkStatus.PUBLISHED_SERIAL_ENDED
        : selectedIndex.value[1],
    count:
      selectedIndex.value[2] === 0 ? CountLevel.ALL : selectedIndex.value[2],
    page: page.value,
    pageSize: pageSize.value,
    sort: sortConfig.value[sortIndex.value]?.value as SortOrder,
  };

  const res = await getWorksListAPI(params);
  workList.value = res.data.works;
};

const init = async () => {
  try {
    loading.value = true;
    await getCategoryList();
    await getWorkList();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  init();
});
</script>

<style scoped></style>
