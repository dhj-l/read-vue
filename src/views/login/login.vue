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
    <div class="absolute right-64 top-1/3 w-96 h-96 bg-white rounded-xl">
      <h1 class="mt-8 ml-3 mb-8 text-lg font-medium">用户名密码登录</h1>
      <el-form class="px-8">
        <el-form-item>
          <el-input class="h-12" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            class="h-12"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="large" round class="w-full rounded-xl" type="primary"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button size="large" link round class="w-full" type="primary"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElInput } from "element-plus";
</script>

<style scoped></style>
