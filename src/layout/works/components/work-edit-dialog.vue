<template>
  <el-dialog
    v-model="open"
    title="编辑作品信息"
    @close="handleClose"
    width="800px"
  >
    <el-form
      ref="workFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <!-- 作品封面 -->
      <el-form-item label="作品封面" prop="cover_url">
        <el-upload
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          class="avatar-uploader"
          :on-change="handleCoverChange"
        >
          <el-image
            v-if="formData.cover_url"
            class="avatar"
            :src="API_BASE_URL + formData.cover_url"
          />
          <el-icon class="avatar-uploader-icon" v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 作品名称 -->
      <el-form-item label="作品名称" prop="title">
        <el-input
          v-model.trim="formData.title"
          placeholder="请输入作品名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <!-- 作品描述 -->
      <el-form-item label="作品描述" prop="description">
        <el-input
          v-model.trim="formData.description"
          placeholder="请输入作品描述"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 作品状态 -->
      <el-form-item label="作品状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择作品状态">
          <el-option
            v-for="option in options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { API_BASE_URL } from "@/config/config";
import { statusOptions, WorkStatus } from "../config";
import type { Work } from "@/api/works/type";
import { uploadFile } from "@/utils/upload";
import type { FormRules } from "element-plus";
import { updateWorkAPI } from "@/api/works/works";
import emitter from "@/utils/eventEmitter";
const emit = defineEmits(["refresh"]);
const open = defineModel("open", {
  type: Boolean,
  default: false,
});

const options = computed(() => {
  return statusOptions.filter((item) => item.value !== WorkStatus.ALL);
});

// 表单校验规则
const rules = ref<FormRules>({
  title: [
    { required: true, message: "请输入作品名称", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "作品名称长度在 2 到 50 个字符",
      trigger: "blur",
    },
  ],
  description: [
    { required: true, message: "请输入作品描述", trigger: "blur" },
    {
      min: 10,
      max: 500,
      message: "作品描述长度在 10 到 500 个字符",
      trigger: "blur",
    },
  ],
  status: [{ required: true, message: "请选择作品状态", trigger: "change" }],
  cover_url: [{ required: true, message: "请上传作品封面", trigger: "change" }],
});

// Refs
const workFormRef = ref();
const props = defineProps<{
  work: Work;
}>();

// Form data
const formData = ref<Partial<Work>>({
  cover_url: "",
  title: "",
  description: "",
  status: WorkStatus.UNPUBLISHED,
});

const handleCoverChange = async (file: any) => {
  if (file) {
    const res = await uploadFile(file.raw);
    formData.value.cover_url = res.url;
  }
};

const handleClose = () => {
  open.value = false;
  if (workFormRef.value) {
    workFormRef.value.resetFields();
  }
};

const handleSubmit = async () => {
  await workFormRef.value.validate();
  await updateWork();
  handleClose();
  emitter.emit("message", {
    type: "success",
    content: "作品信息更新成功",
  });
  emit("refresh");
};
const updateWork = async () => {
  await updateWorkAPI(formData.value.id!, formData.value);
};
watch(open, (newVal) => {
  if (newVal) {
    formData.value = { ...props.work };
  }
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/* 添加封面上传区域的校验状态样式 */
:deep(.el-form-item.is-error .avatar-uploader .el-upload) {
  border-color: var(--el-color-danger);
}

:deep(.el-form-item.is-success .avatar-uploader .el-upload) {
  border-color: var(--el-color-success);
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
