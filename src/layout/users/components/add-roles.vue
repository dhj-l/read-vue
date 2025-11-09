<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="500"
    center
    @close="closeHandler"
  >
    <el-form :model="formData" ref="formRef" label-width="90" :rules="rules">
      <el-form-item label="角色名称:" prop="name">
        <el-input v-model="formData.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色值:" prop="value">
        <el-input v-model="formData.value" placeholder="请输入角色值" />
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
import type { AddRolesEmits, AddRolesProps } from "./type";
import { ElMessage, type ElForm } from "element-plus";
import type { AddRoleRequest } from "@/api/role/type";
import { addRoleAPI, updateRoleAPI } from "@/api/role/role";
const props = withDefaults(defineProps<AddRolesProps>(), {
  type: "add",
});
const emits = defineEmits<AddRolesEmits>();
const formData = ref<AddRoleRequest>({
  name: "",
  value: "",
});
const roleId = computed(() => props.roleId);
const formRef = ref<ComponentInstance<typeof ElForm>>();
const title = computed(() => {
  return props.type === "add" ? "添加角色" : "编辑角色";
});
const open = defineModel({
  type: Boolean,
  default: false,
});

const rules = ref({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入角色值", trigger: "blur" }],
});

const closeHandler = () => {
  formRef.value?.resetFields();

  emits("close");
};

const addRoleHandler = async () => {
  await addRoleAPI(formData.value);
};
const updateRoleHandler = async () => {
  await updateRoleAPI(roleId.value!, formData.value);
};
const cancelHandler = () => {
  open.value = false;
};
const submitHandler = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  if (props.type === "add") await addRoleHandler();
  else await updateRoleHandler();
  open.value = false;
  ElMessage.success(`${title.value}成功`);
  emits("submit", formData.value);
};

watch(open, () => {
  if (open.value && props.type === "edit" && props.roleData)
    formData.value = props.roleData;
  else formData.value = { name: "", value: "" };
});
</script>
