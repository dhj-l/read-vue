<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">系统设置</h1>
      <p class="text-gray-600 mt-2">配置系统各项参数和选项</p>
    </div>
    
    <!-- 设置分类 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <el-tabs v-model="activeTab" class="p-4">
        <!-- 基础设置 -->
        <el-tab-pane label="基础设置" name="basic">
          <div class="space-y-6 max-w-2xl">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">系统名称</label>
              <el-input v-model="settings.basic.systemName" placeholder="请输入系统名称" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">系统Logo</label>
              <el-upload
                class="upload-demo"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
              >
                <img v-if="settings.basic.logoUrl" :src="settings.basic.logoUrl" class="w-20 h-20 object-contain border rounded" />
                <el-button v-else type="primary" plain>
                  <el-icon><Upload /></el-icon>
                  上传Logo
                </el-button>
              </el-upload>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">系统描述</label>
              <el-input
                v-model="settings.basic.systemDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入系统描述"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">备案号</label>
              <el-input v-model="settings.basic.icpNumber" placeholder="请输入备案号" />
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <div class="space-y-6 max-w-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">登录验证码</h3>
                <p class="text-sm text-gray-500">开启后登录需要输入验证码</p>
              </div>
              <el-switch v-model="settings.security.enableCaptcha" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">登录失败锁定</h3>
                <p class="text-sm text-gray-500">连续登录失败5次后锁定账户</p>
              </div>
              <el-switch v-model="settings.security.enableLock" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">密码强度要求</label>
              <el-select v-model="settings.security.passwordStrength" class="w-full">
                <el-option label="简单（6位以上）" value="simple" />
                <el-option label="中等（8位以上，包含字母和数字）" value="medium" />
                <el-option label="复杂（8位以上，包含大小写字母、数字和特殊字符）" value="complex" />
              </el-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">会话超时时间（分钟）</label>
              <el-input-number v-model="settings.security.sessionTimeout" :min="30" :max="480" class="w-full" />
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 邮件设置 -->
        <el-tab-pane label="邮件设置" name="email">
          <div class="space-y-6 max-w-2xl">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">SMTP服务器</label>
              <el-input v-model="settings.email.smtpHost" placeholder="请输入SMTP服务器地址" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">SMTP端口</label>
              <el-input-number v-model="settings.email.smtpPort" :min="1" :max="65535" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">发件人邮箱</label>
              <el-input v-model="settings.email.fromEmail" placeholder="请输入发件人邮箱" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">发件人名称</label>
              <el-input v-model="settings.email.fromName" placeholder="请输入发件人名称" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">邮箱密码</label>
              <el-input v-model="settings.email.password" type="password" placeholder="请输入邮箱密码" />
            </div>
            <div>
              <el-button type="primary" @click="testEmail">
                <el-icon><Message /></el-icon>
                测试邮件发送
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 其他设置 -->
        <el-tab-pane label="其他设置" name="other">
          <div class="space-y-6 max-w-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">开启调试模式</h3>
                <p class="text-sm text-gray-500">开启后会显示详细的错误信息</p>
              </div>
              <el-switch v-model="settings.other.debugMode" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">每页显示条数</label>
              <el-input-number v-model="settings.other.pageSize" :min="10" :max="100" :step="5" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">文件上传大小限制（MB）</label>
              <el-input-number v-model="settings.other.uploadMaxSize" :min="1" :max="100" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">允许上传的文件类型</label>
              <el-select v-model="settings.other.allowedFileTypes" multiple class="w-full">
                <el-option label="图片文件" value="image/*" />
                <el-option label="文档文件" value=".pdf,.doc,.docx" />
                <el-option label="表格文件" value=".xls,.xlsx,.csv" />
                <el-option label="文本文件" value=".txt,.md" />
              </el-select>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <!-- 保存按钮 -->
      <div class="p-4 border-t border-gray-200 flex justify-end">
        <el-button type="primary" @click="saveSettings">
          <el-icon><Check /></el-icon>
          保存设置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Message, Check } from '@element-plus/icons-vue'

const activeTab = ref('basic')

// 设置数据
const settings = reactive({
  basic: {
    systemName: '管理系统',
    logoUrl: '',
    systemDescription: '现代化的后台管理系统',
    icpNumber: ''
  },
  security: {
    enableCaptcha: true,
    enableLock: true,
    passwordStrength: 'medium',
    sessionTimeout: 120
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    fromEmail: '',
    fromName: '管理系统',
    password: ''
  },
  other: {
    debugMode: false,
    pageSize: 20,
    uploadMaxSize: 10,
    allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx']
  }
})

// Logo上传前的验证
const beforeLogoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  
  // 模拟上传成功
  settings.basic.logoUrl = URL.createObjectURL(file)
  ElMessage.success('Logo上传成功')
  return false // 阻止实际上传
}

// 测试邮件发送
const testEmail = () => {
  ElMessage.success('测试邮件发送成功')
}

// 保存设置
const saveSettings = () => {
  ElMessage.success('设置保存成功')
}
</script>