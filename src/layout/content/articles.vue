<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">文章管理</h1>
      <p class="text-gray-600 mt-2">管理系统中的所有文章内容</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 flex gap-4">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章标题或内容"
            clearable
            class="max-w-md"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            clearable
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
          <el-select v-model="selectedStatus" placeholder="选择状态" clearable>
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增文章
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <el-table
        :data="filteredArticles"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column
          prop="title"
          label="标题"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="views"
          label="浏览量"
          width="100"
          align="center"
        />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button
                type="primary"
                link
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button type="info" link size="small" @click="handleView(row)">
                查看
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div
        class="flex justify-between items-center p-4 border-t border-gray-200"
      >
        <div class="text-sm text-gray-600">共 {{ total }} 条记录</div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus, Download } from "@element-plus/icons-vue";

interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  status: "published" | "draft" | "archived";
  views: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

const loading = ref(false);
const searchKeyword = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const articles = ref<Article[]>([]);
const categories = ref<Category[]>([]);

// 模拟分类数据
const mockCategories: Category[] = [
  { id: 1, name: "技术文章" },
  { id: 2, name: "产品资讯" },
  { id: 3, name: "公司新闻" },
  { id: 4, name: "行业动态" },
];

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: 1,
    title: "Vue3 组合式API最佳实践",
    author: "张三",
    category: "技术文章",
    status: "published",
    views: 1234,
    createdAt: "2024-01-15 10:00:00",
  },
  {
    id: 2,
    title: "Element Plus组件库使用指南",
    author: "李四",
    category: "技术文章",
    status: "published",
    views: 856,
    createdAt: "2024-01-14 14:30:00",
  },
  {
    id: 3,
    title: "新产品发布预告",
    author: "王五",
    category: "产品资讯",
    status: "draft",
    views: 0,
    createdAt: "2024-01-13 09:15:00",
  },
  {
    id: 4,
    title: "公司年度总结报告",
    author: "赵六",
    category: "公司新闻",
    status: "published",
    views: 2341,
    createdAt: "2024-01-12 16:45:00",
  },
  {
    id: 5,
    title: "前端开发趋势分析",
    author: "钱七",
    category: "技术文章",
    status: "archived",
    views: 1567,
    createdAt: "2024-01-11 11:20:00",
  },
];

// 过滤文章
const filteredArticles = computed(() => {
  let result = articles.value;

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (article) =>
        article.title.toLowerCase().includes(keyword) ||
        article.author.toLowerCase().includes(keyword)
    );
  }

  if (selectedCategory.value) {
    const categoryName = categories.value.find(
      (c) => c.id === selectedCategory.value
    )?.name;
    result = result.filter((article) => article.category === categoryName);
  }

  if (selectedStatus.value) {
    result = result.filter(
      (article) => article.status === selectedStatus.value
    );
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;

  return result.slice(start, end);
});

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusTypes: Record<string, string> = {
    published: "success",
    draft: "warning",
    archived: "info",
  };
  return statusTypes[status] || "info";
};

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const statusLabels: Record<string, string> = {
    published: "已发布",
    draft: "草稿",
    archived: "已归档",
  };
  return statusLabels[status] || status;
};

// 新增文章
const handleAdd = () => {
  ElMessage.success("新增文章功能开发中...");
};

// 编辑文章
const handleEdit = (row: Article) => {
  ElMessage.success(`编辑文章: ${row.title}`);
};

// 查看文章
const handleView = (row: Article) => {
  ElMessage.success(`查看文章: ${row.title}`);
};

// 删除文章
const handleDelete = async (row: Article) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章 "${row.title}" 吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    // 模拟删除操作
    const index = articles.value.findIndex((article) => article.id === row.id);
    if (index > -1) {
      articles.value.splice(index, 1);
      total.value = articles.value.length;
      ElMessage.success("删除成功");
    }
  } catch {
    // 用户取消删除
  }
};

// 导出
const handleExport = () => {
  ElMessage.success("导出功能开发中...");
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// 加载数据
const loadData = () => {
  loading.value = true;
  setTimeout(() => {
    articles.value = mockArticles;
    categories.value = mockCategories;
    total.value = mockArticles.length;
    loading.value = false;
  }, 500);
};

onMounted(() => {
  loadData();
});
</script>
