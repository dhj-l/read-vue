<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">仪表盘</h1>
      <p class="text-gray-600 mt-2">欢迎使用管理系统，这里是系统概览</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总用户数</p>
            <p class="text-3xl font-bold text-gray-900">1,234</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <el-icon class="text-blue-600" size="24">
              <User />
            </el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm text-green-600">
          <span class="font-medium">+12%</span>
          <span class="text-gray-600 ml-1">相比上月</span>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总文章数</p>
            <p class="text-3xl font-bold text-gray-900">5,678</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <el-icon class="text-green-600" size="24">
              <Document />
            </el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm text-green-600">
          <span class="font-medium">+8%</span>
          <span class="text-gray-600 ml-1">相比上月</span>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总分类数</p>
            <p class="text-3xl font-bold text-gray-900">89</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <el-icon class="text-yellow-600" size="24">
              <Folder />
            </el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm text-red-600">
          <span class="font-medium">-2%</span>
          <span class="text-gray-600 ml-1">相比上月</span>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">系统运行天数</p>
            <p class="text-3xl font-bold text-gray-900">365</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <el-icon class="text-purple-600" size="24">
              <Clock />
            </el-icon>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-600">
          <span class="font-medium">稳定运行</span>
        </div>
      </div>
    </div>
    
    <!-- 最近活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">最近活动</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <el-avatar size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">张三发布了新文章</p>
                <p class="text-xs text-gray-500">2小时前</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <el-avatar size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">李四更新了用户信息</p>
                <p class="text-xs text-gray-500">4小时前</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <el-avatar size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">王五创建了新的分类</p>
                <p class="text-xs text-gray-500">6小时前</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">系统状态</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">服务器状态</span>
            <el-tag type="success" size="small">正常</el-tag>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">数据库连接</span>
            <el-tag type="success" size="small">正常</el-tag>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">缓存服务</span>
            <el-tag type="success" size="small">正常</el-tag>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">API服务</span>
            <el-tag type="success" size="small">正常</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Document, Folder, Clock } from '@element-plus/icons-vue'
</script>