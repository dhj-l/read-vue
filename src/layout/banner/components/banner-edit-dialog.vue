<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑轮播图' : '添加轮播图'"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="轮播图" prop="imgUrl">
        <el-upload
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          class="avatar-uploader"
          :on-change="handleCoverChange"
        >
          <el-image
            v-if="formData.imgUrl"
            class="avatar"
            :src="API_BASE_URL + formData.imgUrl"
          />
          <el-icon class="avatar-uploader-icon" v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入轮播图标题"
          clearable
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择轮播图状态">
          <el-option label="已上架" :value="1" />
          <el-option label="已下架" :value="0" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { type Banner, BannerStatus } from "@/api/banner/type";
import { createBannerAPI, updateBannerAPI } from "@/api/banner/banner";
import { API_BASE_URL } from "@/config/config";
import emitter from "@/utils/eventEmitter";
import type { FormInstance, UploadFile } from "element-plus";
import { uploadFile } from "@/utils/upload";

const props = defineProps<{
  open: boolean;
  banner?: Banner;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  refresh: [];
}>();

const dialogVisible = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const isEdit = computed(() => !!props.banner?.id);

const formRef = ref<FormInstance>();
const formData = ref({
  imgUrl: "",
  title: "",
  status: BannerStatus.ACTIVE,
});

const formRules = ref({
  imgUrl: [{ required: true, message: "请上传轮播图", trigger: "change" }],
});

// 重置表单
const resetForm = () => {
  formData.value = {
    imgUrl: "",
    title: "",
    status: BannerStatus.ACTIVE,
  };
  // 使用 nextTick 确保 DOM 更新完成后再重置表单
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  });
};

// 监听banner变化，更新表单数据
watch(
  () => props.banner,
  (newBanner) => {
    if (newBanner) {
      formData.value = {
        imgUrl: newBanner.imgUrl || "",
        title: newBanner.title || "",
        status: newBanner.status ?? BannerStatus.ACTIVE,
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 处理图片上传
const handleCoverChange = async (file: UploadFile) => {
  if (!file.raw) return;
  const { size, type } = file.raw;
  if (size > 1024 * 1024 * 20) {
    emitter.emit("message", {
      type: "warning",
      content: "图片大小不能超过2MB",
    });
    return;
  }
  if (!type.includes("image")) {
    emitter.emit("message", {
      type: "warning",
      content: "请上传图片文件",
    });
    return;
  }
  const { url } = await uploadFile(file.raw);
  formData.value.imgUrl = url;
};

// 处理关闭对话框
const handleClose = () => {
  emit("update:open", false);
  nextTick(() => {
    resetForm();
  });
};

// 处理取消
const handleCancel = () => {
  handleClose();
};

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    if (isEdit.value && props.banner?.id) {
      // 更新轮播图
      await updateBannerAPI(props.banner.id, formData.value);
      emitter.emit("message", {
        type: "success",
        content: "轮播图更新成功",
      });
    } else {
      // 创建轮播图
      await createBannerAPI(formData.value);
      emitter.emit("message", {
        type: "success",
        content: "轮播图创建成功",
      });
    }
    emit("update:open", false);
    emit("refresh");
  } catch (error) {
    console.error("提交轮播图失败:", error);
    emitter.emit("message", { type: "error", content: "提交轮播图失败" });
  }
};
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  align-items: center;
}

.avatar {
  width: 200px;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
