<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">分类管理</h1>
      <p class="text-gray-600 mt-2">管理系统中的内容分类</p>
    </div>
    
    <!-- 搜索和操作栏 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex justify-between items-center">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索分类名称"
          clearable
          class="max-w-md"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增分类
        </el-button>
      </div>
    </div>
    
    <!-- 分类列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <el-table :data="filteredCategories" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="description" label="分类描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="articleCount" label="文章数量" width="120" align="center" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button type="primary" link size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

interface Category {
  id: number
  name: string
  description: string
  articleCount: number
  sort: number
  status: 'active' | 'inactive'
  createdAt: string
}

const loading = ref(false)
const searchKeyword = ref('')
const categories = ref<Category[]>([])

// 模拟分类数据
const mockCategories: Category[] = [
  {
    id: 1,
    name: '技术文章',
    description: '包含前端、后端、数据库等技术相关文章',
    articleCount: 45,
    sort: 1,
    status: 'active',
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '产品资讯',
    description: '产品更新、功能介绍、使用指南等',
    articleCount: 23,
    sort: 2,
    status: 'active',
    createdAt: '2024-01-02 11:00:00'
  },
  {
    id: 3,
    name: '公司新闻',
    description: '公司动态、活动通知、团队介绍等',
    articleCount: 12,
    sort: 3,
    status: 'active',
    createdAt: '2024-01-03 12:00:00'
  },
  {
    id: 4,
    name: '行业动态',
    description: '行业资讯、市场分析、趋势预测等',
    articleCount: 18,
    sort: 4,
    status: 'inactive',
    createdAt: '2024-01-04 13:00:00'
  },
  {
    id: 5,
    name: '用户指南',
    description: '系统使用说明、操作指南、常见问题等',
    articleCount: 8,
    sort: 5,
    status: 'active',
    createdAt: '2024-01-05 14:00:00'
  }
]

// 过滤分类
const filteredCategories = computed(() => {
  if (!searchKeyword.value) return categories.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(keyword) ||
    category.description.toLowerCase().includes(keyword)
  )
})

// 新增分类
const handleAdd = () => {
  ElMessage.success('新增分类功能开发中...')
}

// 编辑分类
const handleEdit = (row: Category) => {
  ElMessage.success(`编辑分类: ${row.name}`)
}

// 删除分类
const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 模拟删除操作
    const index = categories.value.findIndex(category => category.id === row.id)
    if (index > -1) {
      categories.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    categories.value = mockCategories
    loading.value = false
  }, 500)
}

onMounted(() => {
  loadData()
})
</script>