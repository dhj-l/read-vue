<template>
  <div :class="[props.bgColor, className]">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[80px] flex items-center"
    >
      <!-- 左侧 Logo + 站点名 -->
      <div class="flex items-center group cursor-pointer">
        <div
          class="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 mr-3 flex items-center justify-center shadow-md shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105"
        >
          <svg
            class="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.5c1.84 0 3.48.96 4.34 2.5H7.66c.86-1.54 2.5-2.5 4.34-2.5z"
            />
          </svg>
        </div>
        <div
          class="text-lg font-bold whitespace-nowrap text-gray-900"
          @click="handleClick"
        >
          星阅小说网
        </div>
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
              'text-sm relative pb-1 transition-all duration-300',
              activeKey === item.key
                ? 'text-orange-600 font-bold'
                : 'text-gray-700 hover:text-orange-500',
            ]"
            class="whitespace-nowrap cursor-pointer"
          >
            {{ item.label }}
            <span
              v-if="activeKey === item.key"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"
            ></span>
          </button>
        </nav>
      </div>

      <!-- 右侧搜索 + 用户 -->
      <div class="ml-auto flex items-center space-x-4">
        <template v-if="props.showSearch">
          <el-input
            v-model="keyword"
            placeholder="请输入书名或作者名"
            class="w-72 rounded-lg search-input"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon
                class="cursor-pointer text-gray-400 hover:text-orange-500 transition-colors duration-300"
                @click="handleSearch"
              >
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-divider direction="vertical" />
        </template>

        <el-dropdown trigger="click">
          <div class="flex items-center cursor-pointer group">
            <!-- 头像：有头像显示图片，没有显示首字母 -->
            <div
              v-if="userInfo?.avatar_url"
              class="w-8 h-8 rounded-full mr-2 overflow-hidden shadow-sm"
            >
              <img
                :src="API_BASE_URL + userInfo.avatar_url"
                :alt="userInfo.username"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm mr-2"
            >
              {{ userInfo?.username?.charAt(0)?.toUpperCase() }}
            </div>
            <span
              class="text-gray-700 text-sm max-w-[80px] truncate group-hover:text-orange-600 transition-colors duration-300"
              >{{ userInfo?.username }}</span
            >
            <el-icon
              class="ml-1 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-all duration-300 group-hover:translate-y-0.5"
            >
              <ArrowDown />
            </el-icon>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in btnConfig"
                :key="item.label"
                @click="item.click"
              >
                {{ item.label }}
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Search, ArrowDown } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user/user";
import { storeToRefs } from "pinia";
import emitter from "@/utils/eventEmitter";
import type { ButtonConfig } from "@/layout/content/type";
import { API_BASE_URL } from "@/config/config";

type NavKey =
  | "home"
  | "library"
  | "shelf"
  | "rank"
  | "writer-work"
  | "copyright";
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
  showSearch: {
    type: Boolean,
    default: true,
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
  { key: "writer-work", label: "作家专区", path: "/home/writer" },
];
const router = useRouter();
const route = useRoute();
const activeKey = ref<NavKey>((route.name as NavKey) || "home");
const keyword = ref<string>("");

const { userInfo } = storeToRefs(useUserStore());

const onSelect = (item: NavItem) => {
  activeKey.value = item.key;
  router.push(item.path);
};

const handleSearch = () => {
  if (keyword.value.trim().length === 0) return;
  router.push({
    path: "/home/search",
    query: {
      keyword: keyword.value,
    },
  });
};
const handleClick = () => {
  router.push({
    path: "/home",
  });
  activeKey.value = "home";
};

const handleLogout = () => {
  emitter.emit("logout");
};

const handleCenter = () => {
  router.push({
    path: "/home/center",
  });
};

const handleConsole = () => {
  router.push({
    path: "/layout",
  });
};

emitter.on("changeActive", (key) => {
  activeKey.value = key as NavKey;
});

const btnConfig = ref<ButtonConfig[]>([
  {
    label: "个人中心",
    click: handleCenter,
    props: {},
  },
]);
onMounted(() => {
  console.log(123);
  console.log(userInfo.value);

  if (userInfo.value?.permissions && userInfo.value.permissions.length > 0) {
    btnConfig.value.push({
      label: "控制台",
      click: handleConsole,
      props: {},
    });
  }
});
</script>

<style scoped>
/* 搜索框样式优化 */
:deep(.search-input .el-input__wrapper) {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

:deep(.search-input .el-input__wrapper:hover) {
  box-shadow: 0 2px 8px rgba(251, 146, 60, 0.1);
}

:deep(.search-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
}

/* 下拉菜单样式优化 */
:deep(.el-dropdown-menu__item:hover) {
  background-color: #fff7ed;
  color: #ea580c;
}
</style>
