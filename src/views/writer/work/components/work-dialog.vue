<template>
  <el-dialog v-model="open" :title="dialogTitle" width="720px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="作品封面" prop="cover_url">
        <el-upload
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleCoverChange"
          class="avatar-uploader"
        >
          <el-image
            v-if="form.cover_url"
            :src="API_BASE_URL + form.cover_url"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="作品名称" prop="title">
        <el-input
          v-model.trim="form.title"
          placeholder="请输入作品名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="作品描述" prop="description">
        <el-input
          v-model.trim="form.description"
          placeholder="请输入作品描述"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="作品分类" prop="category_ids">
        <el-select
          v-model="form.category_ids"
          multiple
          filterable
          remote
          reserve-keyword
          :remote-method="handleCategorySearch"
          :loading="categoryLoading"
          placeholder="请选择作品分类"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { API_BASE_URL } from "@/config/config";
import { uploadFile } from "@/utils/upload";
import type { FormInstance, FormRules } from "element-plus";
import type { Work } from "@/api/works/type";
import { getCategoryListAPI } from "@/api/category/category";
import type { Category } from "@/api/category/type";
import { createWorkAPI } from "@/api/works/works";
import type { CreateWorkRequest } from "@/api/works/type";
import { WorkStatus } from "@/layout/works/config";

const open = defineModel<boolean>("open", {
  default: false,
});

const props = defineProps<{
  mode?: "create" | "edit";
  work?: Partial<Work> | null;
}>();

const emit = defineEmits<{
  (e: "submit", payload: { mode: "create" | "edit"; data: any }): void;
}>();

const dialogTitle = computed(() =>
  (props.mode ?? "create") === "create" ? "新建作品" : "编辑作品"
);

const formRef = ref<FormInstance>();
const form = ref({
  title: "",
  description: "",
  cover_url: "",
  category_ids: [] as number[],
});

const categoryOptions = ref<Category[]>([]);
const categoryLoading = ref(false);

const rules: FormRules = {
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
  cover_url: [{ required: true, message: "请上传作品封面", trigger: "change" }],
  category_ids: [
    { required: true, message: "请选择作品分类", trigger: "change" },
  ],
};

const resetForm = () => {
  form.value = {
    title: "",
    description: "",
    cover_url: "",
    category_ids: [],
  };
  formRef.value?.clearValidate();
};

watch(
  () => open.value,
  (val) => {
    if (val) {
      if (props.mode === "edit" && props.work) {
        form.value = {
          title: props.work.title ?? "",
          description: props.work.description ?? "",
          cover_url: props.work.cover_url ?? "",
          category_ids:
            props.work.categorys?.map((item) => item.id) ?? ([] as number[]),
        };
      } else {
        resetForm();
      }
      // 打开时默认加载一次分类列表
      handleCategorySearch("");
    }
  }
);

const handleCategorySearch = async (value: string) => {
  try {
    categoryLoading.value = true;
    const res = await getCategoryListAPI({
      page: 1,
      pageSize: 20,
      name: value || undefined,
    });
    categoryOptions.value = res.data.categories;
  } finally {
    categoryLoading.value = false;
  }
};

const handleCoverChange = async (file: any) => {
  if (!file) return;
  const res = await uploadFile(file.raw);
  form.value.cover_url = res.url;
};

const handleClose = () => {
  open.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();

  const mode = (props.mode ?? "create") as "create" | "edit";

  if (mode === "create") {
    const payload: CreateWorkRequest = {
      title: form.value.title,
      description: form.value.description,
      category_ids: form.value.category_ids,
      status: WorkStatus.UNPUBLISHED,
      cover_url: form.value.cover_url,
    };
    const res = await createWorkAPI(payload);
    emit("submit", {
      mode,
      data: res.data,
    });
  } else {
    // 编辑场景交由外部处理
    emit("submit", {
      mode,
      data: { ...form.value },
    });
  }
  handleClose();
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
