<template>
  <div :class="[props.bgColor, className]">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[80px] flex items-center"
    >
      <!-- 左侧 Logo + 站点名 -->
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-md bg-orange-500 mr-3"></div>
        <div class="text-base font-medium whitespace-nowrap">番茄小说网</div>
      </div>

      <!-- 中部导航 -->
      <div class="ml-8 flex-1">
        <nav class="flex items-center space-x-6">
          <button
            v-for="item in nav"
            :key="item.key"
            type="button"
            @click="onSelect(item)"
            :class="[
              'text-sm',
              activeKey === item.key ? 'text-black font-bold' : 'text-gray-700',
            ]"
            class="whitespace-nowrap hover:border-b hover:border-black transition-all cursor-pointer"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>

      <!-- 右侧搜索 + 用户 -->
      <div class="ml-auto flex items-center space-x-4">
        <el-input
          v-model="keyword"
          placeholder="请输入书名或作者名"
          class="w-72 rounded-lg"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-divider direction="vertical" />
        <el-dropdown>
          <span class="el-dropdown-link flex items-center">
            <el-avatar :size="32" class="mr-2" />
            <span class="text-gray-700">昵称占位</span>
            <el-icon class="ml-1"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Search, ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

type NavKey = "home" | "library" | "shelf" | "rank" | "authors" | "copyright";
interface NavItem {
  key: NavKey;
  label: string;
  path: string;
}
const props = defineProps({
  bgColor: {
    type: String,
    default: "",
  },
  absolute: {
    type: Boolean,
    default: false,
  },
});
const styleMap = {
  absolute: "absolute top-0 left-0 w-full z-10",
  relative: "relative",
};
const className = computed(() => {
  return styleMap[props.absolute ? "absolute" : "relative"];
});

const nav: NavItem[] = [
  { key: "home", label: "首页", path: "/home" },
  { key: "library", label: "书库", path: "/home/library" },
  { key: "shelf", label: "书架", path: "/home/shelf" },
  { key: "rank", label: "原创榜", path: "/home/rank" },
  { key: "authors", label: "作家专区", path: "/home/authors" },
  { key: "copyright", label: "版权专区", path: "/home/copyright" },
];

const activeKey = ref<NavKey>("home");
const keyword = ref<string>("");
const router = useRouter();
const onSelect = (item: NavItem) => {
  activeKey.value = item.key;
  router.push(item.path);
};
</script>

<style scoped></style>
