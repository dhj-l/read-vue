<template>
  <div class="h-full w-full relative overflow-hidden">
    <video
      autoplay
      loop
      muted
      playsinline
      disablepictureinpicture
      disableremoteplayback
      class="absolute top-0 left-0 w-full h-full object-cover -z-10"
      src="../../assets/welcome.mp4"
    ></video>
    <div class="absolute right-64 top-1/3 w-96 min-h-96 bg-white rounded-xl">
      <h1 class="mt-8 ml-3 mb-8 text-lg font-medium">用户名密码登录</h1>
      <el-form class="px-8" :model="formData" ref="formRef" :rules="rules">
        <el-form-item prop="username">
          <el-input
            class="h-12"
            placeholder="请输入用户名"
            v-model="formData.username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="h-12"
            placeholder="请输入密码"
            type="password"
            clearable
            show-password
            v-model="formData.password"
          />
        </el-form-item>
        <el-form-item prop="email" v-if="loginOrRegister === 'register'">
          <el-input
            class="h-12"
            placeholder="请输入邮箱"
            v-model="formData.email"
          />
        </el-form-item>
        <el-form-item prop="code" v-if="loginOrRegister === 'register'">
          <div class="flex items-center justify-between w-full">
            <el-input
              class="h-12 flex-7 mr-3"
              placeholder="请输入验证码"
              v-model="formData.code"
              clearable
            />
            <el-button
              class="flex-3"
              type="primary"
              size="large"
              @click="getCode"
              :loading="loadding"
              :disabled="disabled"
              >{{
                countDown > 0 ? `${countDown}秒后重新获取` : "获取验证码"
              }}</el-button
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            size="large"
            round
            class="w-full rounded-xl"
            type="primary"
            @click="handleSubmit"
            :loading="submitLoading"
            >{{ loginOrRegister === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
        <el-form-item v-if="loginOrRegister === 'login'">
          <el-button
            size="large"
            link
            round
            class="w-full"
            type="primary"
            @click="loginOrRegister = 'register'"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from "./useLogin";
const {
  loginOrRegister,
  formData,
  loadding,
  countDown,
  disabled,
  rules,
  formRef,
  submitLoading,
  getCode,
  handleSubmit,
} = useLogin();
</script>

<style scoped></style>
