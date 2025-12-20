<template>
  <div
    class="w-full flex justify-center bg-linear-to-br from-gray-50 to-gray-100"
  >
    <div class="w-[1200px] py-8 px-8 flex flex-col">
      <!-- 页面标题 -->
      <header class="mb-8">
        <h1 class="text-4xl text-gray-900 font-bold flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          个人中心
        </h1>
        <p class="text-gray-500 mt-2 ml-[52px]">管理您的个人信息和账户设置</p>
      </header>

      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <!-- 头像和用户名区域 -->
        <div class="flex items-center gap-6 pb-8 border-b border-gray-100">
          <div class="relative group">
            <el-upload
              class="avatar-uploader-c"
              :show-file-list="false"
              :on-change="handleAvatarChange"
              :auto-upload="false"
            >
              <div class="relative">
                <img
                  v-if="userInfo?.avatar_url"
                  :src="API_BASE_URL + userInfo?.avatar_url"
                  class="avatar"
                />
                <div v-else class="avatar-placeholder">
                  <Plus class="w-12 h-12 text-gray-400" />
                </div>
                <!-- 悬停遮罩 -->
                <div class="avatar-overlay">
                  <svg
                    class="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span class="text-white text-sm mt-2">更换头像</span>
                </div>
              </div>
            </el-upload>
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-3xl font-bold text-gray-900">
                {{ userInfo?.username }}
              </h2>
              <button
                @click="handleEditName"
                class="p-2 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <Edit
                  class="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
                />
              </button>
            </div>
            <p class="text-gray-500">欢迎回来！管理您的账户信息</p>
          </div>
        </div>

        <!-- 信息列表 -->
        <div class="mt-6 space-y-1">
          <div
            v-for="item in userInfoConfig"
            :key="item.key"
            class="flex items-center justify-between px-6 py-5 rounded-xl transition-all duration-300 hover:bg-gray-50 group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <component :is="item.icon" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">{{ item.label }}</p>
                <p class="text-base font-medium text-gray-900">
                  {{ item.value }}
                </p>
              </div>
            </div>
            <div v-if="item.editable">
              <el-button
                v-bind="item.props"
                @click="item.onClick"
                class="edit-btn"
              >
                修改
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="text-center text-sm text-gray-400">
        <p>如需帮助，请联系客服或查看帮助文档</p>
      </div>
    </div>
    <CenterDailog v-model:open="open" :model="curModel" />
  </div>
</template>

<script setup lang="ts">
import { API_BASE_URL } from "@/config/config";
import { useUserStore } from "@/stores/modules/user/user";
import { Edit, Iphone, Calendar, Plus } from "@element-plus/icons-vue";
import { formateTime } from "@/utils/formdate";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import CenterDailog from "./components/center-dailog.vue";
import type { CenterModel } from "./components/type";
import type { UploadFile } from "element-plus";
import emitter from "@/utils/eventEmitter";

import { uploadFile } from "@/utils/upload";

const open = ref(false);
const curModel = ref<CenterModel>("name");

const { userInfo } = storeToRefs(useUserStore());
const { updateUserInfo } = useUserStore();

// 用户信息配置项
const userInfoConfig = [
  {
    key: "email",
    label: "邮箱",
    icon: Iphone,
    value: computed(() => userInfo.value?.email),
    editable: false,
  },
  {
    key: "createTime",
    label: "创建时间",
    icon: Calendar,
    value: computed(() =>
      userInfo.value?.createTime ? formateTime(userInfo.value.createTime) : ""
    ),
    editable: false,
  },
  {
    key: "password",
    label: "密码",
    icon: Iphone,
    value: computed(() => "******"),
    editable: true,
    props: {
      link: true,
      icon: Edit,
      type: "primary",
    },
    onClick: () => {
      // 打开密码修改弹框
      open.value = true;
      curModel.value = "password";
    },
  },
];

const handleEditName = () => {
  // 打开用户名修改弹框
  open.value = true;
  curModel.value = "name";
};

const handleAvatarChange = async (file: UploadFile) => {
  if (!file.raw) return;
  const { size, type } = file.raw;
  if (size > 1024 * 1024 * 30) {
    emitter.emit("message", {
      type: "error",
      content: "头像大小不能超过30MB",
    });
    return;
  }
  if (!type.includes("image")) {
    emitter.emit("message", {
      type: "error",
      content: "请上传图片文件",
    });
    return;
  }
  const res = await uploadFile(file.raw);
  const { url } = res;
  updateUserInfo({ avatar_url: url });
  emitter.emit("message", {
    type: "success",
    content: "头像更改成功",
  });
};
</script>

<style scoped>
/* 头像样式 */
.avatar-uploader-c .avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-linear(135deg, #fef3c7 0%, #fde68a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-uploader-c:hover .avatar-overlay {
  opacity: 1;
}

/* 编辑按钮样式 */
:deep(.edit-btn) {
  background: linear-linear(135deg, #f97316 0%, #ea580c 100%);
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.edit-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}
</style>

<style>
.avatar-uploader-c .el-upload {
  border: 3px dashed #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
}

.avatar-uploader-c .el-upload:hover {
  border-color: #f97316;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}
</style>
