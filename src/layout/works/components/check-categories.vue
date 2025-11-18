<template>
  <div class="check-categories">
    <div class="mb-3">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
    </div>

    <div v-if="loading" class="text-center py-4">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      <span class="ml-2">加载分类中...</span>
    </div>

    <div v-else-if="error" class="text-center py-4 text-red-500">
      <el-icon><Warning /></el-icon>
      <span class="ml-2">{{ error }}</span>
    </div>

    <el-checkbox-group
      v-else
      v-model="checkedCategoryIds"
      @change="handleCheckedCategoriesChange"
      class="flex flex-wrap gap-4"
    >
      <el-checkbox v-for="item in categoryList" :key="item.id" :value="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { CheckboxValueType } from "element-plus";
import type { CheckCategoriesEmits, CheckCategoriesProps } from "../type";
import { getCategoryListAPI } from "@/api/category/category";
import type { Category } from "@/api/category/type";

const props = withDefaults(defineProps<CheckCategoriesProps>(), {
  categories: () => [],
});
const emits = defineEmits<CheckCategoriesEmits>();
const checkAll = ref(false);
const isIndeterminate = ref(true);
const checkedCategoryIds = ref<number[]>([]);
const categoryList = ref<Category[]>([]);
const loading = ref(false);
const error = ref<string>("");

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedCategoryIds.value = val
    ? categoryList.value.map((item) => item.id)
    : [];
  isIndeterminate.value = false;
  emitChange();
};

const handleCheckedCategoriesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === categoryList.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < categoryList.value.length;
  emitChange();
};

const emitChange = () => {
  const selectedCategories = categoryList.value.filter((item) =>
    checkedCategoryIds.value.includes(item.id)
  );
  emits("change", selectedCategories);
};

const getCategoryList = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await getCategoryListAPI({
      page: 1,
      pageSize: 100,
    });

    categoryList.value = data.categories;
    initCheckedCategories();
  } catch (err) {
    error.value = "获取分类列表失败";
    ElMessage.error("获取分类列表失败");
    console.error("获取分类列表失败：", err);
  } finally {
    loading.value = false;
  }
};

const initCheckedCategories = () => {
  checkedCategoryIds.value = props.categories.map((item) => item.id);
  const checkedCount = checkedCategoryIds.value.length;
  checkAll.value = checkedCount === categoryList.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < categoryList.value.length;
};

watch(
  () => props.open,
  () => {
    if (props.open) {
      initCheckedCategories();
    }
  }
);

onMounted(() => {
  getCategoryList();
});
</script>

<style scoped>
.check-categories {
  padding: 16px;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
