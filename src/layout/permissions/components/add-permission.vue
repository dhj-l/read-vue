<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="500"
    center
    @close="closeHandler"
  >
    <el-form :model="formData" ref="formRef" label-width="90" :rules="rules">
      <el-form-item label="权限名称:" prop="name">
        <el-input v-model="formData.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="权限值:" prop="value">
        <el-input v-model="formData.value" placeholder="请输入权限值" />
      </el-form-item>
      <el-form-item label="权限描述:" prop="description">
        <el-input
          v-model="formData.description"
          placeholder="请输入权限描述"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelHandler">取消</el-button>
        <el-button type="primary" @click="submitHandler">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type ComponentInstance } from "vue";
import type { AddPermissionEmits, AddPermissionProps } from "./type";
import { ElMessage, type ElForm } from "element-plus";
import type {
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "@/api/permission/type";
import {
  createPermissionAPI,
  updatePermissionAPI,
} from "@/api/permission/permission";
const props = withDefaults(defineProps<AddPermissionProps>(), {
  type: "add",
});
const emits = defineEmits<AddPermissionEmits>();
const formData = ref<CreatePermissionRequest | UpdatePermissionRequest>({
  name: "",
  value: "",
  description: "",
});
const permissionId = computed(() => props.permissionId);
const formRef = ref<ComponentInstance<typeof ElForm>>();
const title = computed(() => {
  return props.type === "add" ? "添加权限" : "编辑权限";
});
const open = defineModel({
  type: Boolean,
  default: false,
});

const rules = ref({
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入权限值", trigger: "blur" }],
  description: [{ required: true, message: "请输入权限描述", trigger: "blur" }],
});

const closeHandler = () => {
  formRef.value?.resetFields();
  emits("close");
};

const addPermissionHandler = async () => {
  await createPermissionAPI(formData.value as CreatePermissionRequest);
};

const updatePermissionHandler = async () => {
  await updatePermissionAPI(
    permissionId.value!,
    formData.value as UpdatePermissionRequest
  );
};

const cancelHandler = () => {
  open.value = false;
};

const submitHandler = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  if (props.type === "add") await addPermissionHandler();
  else await updatePermissionHandler();
  open.value = false;
  ElMessage.success(`${title.value}成功`);
  emits("submit", formData.value);
};

watch(open, () => {
  if (open.value && props.type === "edit" && props.permissionData) {
    formData.value = { ...props.permissionData };
  } else {
    formData.value = {
      name: "",
      value: "",
      description: "",
    };
  }
});
</script>
