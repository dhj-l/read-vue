<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">角色管理</h1>
      <p class="text-gray-600 mt-2">管理系统中的用户角色和权限</p>
    </div>
    
    <!-- 操作栏 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex justify-between items-center">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索角色名称"
          clearable
          class="max-w-md"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>
    </div>
    
    <!-- 角色列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <el-table :data="filteredRoles" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" min-width="150" />
        <el-table-column prop="description" label="角色描述" min-width="200" />
        <el-table-column prop="permissions" label="权限" min-width="300">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag
                v-for="permission in row.permissions.slice(0, 3)"
                :key="permission"
                size="small"
                type="info"
              >
                {{ permission }}
              </el-tag>
              <el-tag
                v-if="row.permissions.length > 3"
                size="small"
                type="info"
              >
                +{{ row.permissions.length - 3 }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userCount" label="用户数" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
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

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  userCount: number
  status: 'active' | 'inactive'
}

const loading = ref(false)
const searchKeyword = ref('')
const roles = ref<Role[]>([])

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限',
    permissions: ['用户管理', '内容管理', '系统设置', '权限管理'],
    userCount: 2,
    status: 'active'
  },
  {
    id: 2,
    name: '管理员',
    description: '拥有大部分管理权限',
    permissions: ['用户管理', '内容管理', '系统设置'],
    userCount: 5,
    status: 'active'
  },
  {
    id: 3,
    name: '编辑',
    description: '内容编辑权限',
    permissions: ['内容管理', '分类管理'],
    userCount: 8,
    status: 'active'
  },
  {
    id: 4,
    name: '普通用户',
    description: '基础用户权限',
    permissions: ['个人信息管理'],
    userCount: 156,
    status: 'active'
  },
  {
    id: 5,
    name: '访客',
    description: '只读权限',
    permissions: ['查看内容'],
    userCount: 23,
    status: 'inactive'
  }
]

// 过滤角色
const filteredRoles = computed(() => {
  if (!searchKeyword.value) return roles.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return roles.value.filter(role => 
    role.name.toLowerCase().includes(keyword) ||
    role.description.toLowerCase().includes(keyword)
  )
})

// 新增角色
const handleAdd = () => {
  ElMessage.success('新增角色功能开发中...')
}

// 编辑角色
const handleEdit = (row: Role) => {
  ElMessage.success(`编辑角色: ${row.name}`)
}

// 删除角色
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 模拟删除操作
    const index = roles.value.findIndex(role => role.id === row.id)
    if (index > -1) {
      roles.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

// 加载角色数据
const loadRoles = () => {
  loading.value = true
  setTimeout(() => {
    roles.value = mockRoles
    loading.value = false
  }, 500)
}

onMounted(() => {
  loadRoles()
})
</script>