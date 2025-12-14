<template>
  <div class="w-full h-full flex justify-center bg-white">
    <div class="w-[1200px] h-full p-4 flex flex-col">
      <header class="border-b border-gray-200 pb-4 flex items-center h-[80px]">
        <h1 class="text-3xl text-gray-800 font-bold">个人中心</h1>
      </header>
      <!-- 内容部分 -->
      <div class="p-4 flex-1 mt-5">
        <div class="flex mb-5">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            :auto-upload="false"
          >
            <img
              v-if="userInfo?.avatar_url"
              :src="API_BASE_URL + userInfo?.avatar_url"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="text-2xl flex text-gray-800 ml-4">
            <span class="mr-3">{{ userInfo?.username }}</span>
            <Edit class="w-3 h-3 cursor-pointer" @click="handleEditName" />
          </div>
        </div>
        <div>
          <div
            v-for="item in userInfoConfig"
            :key="item.key"
            class="flex items-center cursor-pointer justify-between transition-all duration-300 hover:bg-[#f5f5f5] px-4"
          >
            <div class="flex items-center">
              <div class="mr-3 my-6">
                <component :is="item.icon" class="w-5 h-5 text-[#c8c8c8]" />
              </div>
              <div>
                <p class="text-gray-500">{{ item.label }}</p>
                <p>{{ item.value }}</p>
              </div>
            </div>
            <div v-if="item.editable">
              <el-button v-bind="item.props" @click="item.onClick" />
            </div>
          </div>
        </div>
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
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  border-radius: 50%;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
