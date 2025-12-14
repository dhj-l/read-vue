<template>
  <div>
    <el-dialog
      v-model="open"
      :title="title"
      width="500"
      center
      @close="closeHandler"
    >
      <el-form
        ref="formRef"
        label-width="60px"
        class="px-5"
        label-position="top"
        :model="formData"
        :rules="rules"
      >
        <el-form-item
          v-for="item in modelOptions"
          :key="item.prop"
          v-bind="item"
        >
          <el-input v-model="formData[item.prop]" v-bind="item.childrenProps" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">取消</el-button>
          <el-button type="primary" @click="submitHandler"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type ComponentInstance } from "vue";
import type { CenterDialogProps } from "./type";
import { type ElForm } from "element-plus";
import { changePasswordAPI } from "@/api/user/user";
import emitter from "@/utils/eventEmitter";
import { useUserStore } from "@/stores/modules/user/user";
const { updateUserInfo } = useUserStore();
const open = defineModel("open", {
  type: Boolean,
  default: false,
});
const props = withDefaults(defineProps<CenterDialogProps>(), {
  model: "name",
});

const title = computed(() => {
  return props.model === "name" ? "修改用户名" : "修改密码";
});

const modelOptions = computed(() => {
  if (props.model === "name") {
    return [
      {
        label: "用户名",
        prop: "name",
        childrenProps: {
          type: "text",
          placeholder: "请输入用户名",
        },
      },
    ];
  } else {
    return [
      {
        label: "请输入原有密码",
        prop: "oldPassword",
        childrenProps: {
          type: "password",
          placeholder: "请输入原有密码",
          clearable: true,
          showPassword: true,
        },
      },
      {
        label: "请输入新密码",
        prop: "newPassword",
        childrenProps: {
          type: "password",
          placeholder: "请输入新密码",
          clearable: true,
          showPassword: true,
        },
      },
      {
        label: "确认新密码",
        prop: "confirmPassword",
        childrenProps: {
          type: "password",
          placeholder: "请确认新密码",
          clearable: true,
          showPassword: true,
        },
      },
    ];
  }
});

const formRef = ref<ComponentInstance<typeof ElForm>>();

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== formData.value.newPassword) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};

const rules = computed(() => {
  if (props.model === "name") {
    return {
      name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    };
  } else {
    return {
      oldPassword: [
        { required: true, message: "请输入原有密码", trigger: "blur" },
        { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
      ],
      newPassword: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
      ],
      confirmPassword: [
        { required: true, message: "请确认新密码", trigger: "blur" },
        { validator: validateConfirmPassword, trigger: "blur" },
      ],
    };
  }
});

const formData = ref<any>({
  name: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const submitHandler = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  if (props.model === "name") {
    // 调用修改用户名接口
    await updateUserInfo({ username: formData.value.name });
  } else {
    // 调用修改密码接口
    await changePasswordAPI(formData.value);
    setTimeout(() => {
      emitter.emit("logout");
    }, 3000);
  }
  emitter.emit("message", {
    type: "success",
    content:
      props.model === "name"
        ? "修改用户名成功"
        : "修改密码成功,3秒后将退出登录",
  });
  closeHandler();
};

const closeHandler = () => {
  formRef.value?.resetFields();
  open.value = false;
};
</script>

<style scoped></style>
