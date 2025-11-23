<template>
  <footer class="bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-md bg-orange-500 mr-3"></div>
            <div class="text-base font-medium">番茄小说网</div>
          </div>
          <div class="text-sm text-gray-500">海量正版 免费阅读</div>
          <div class="flex items-center space-x-3">
            <div
              class="w-28 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-600"
            >
              iOS
            </div>
            <div
              class="w-28 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-600"
            >
              Android
            </div>
          </div>
        </div>

        <div v-for="group in linkGroups" :key="group.title" class="space-y-3">
          <div class="text-sm font-medium text-gray-700">{{ group.title }}</div>
          <ul class="space-y-2">
            <li v-for="l in group.links" :key="l.label">
              <el-link :href="l.href" target="_blank" type="primary">{{
                l.label
              }}</el-link>
            </li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="text-sm font-medium text-gray-700">关注我们</div>
          <div class="w-28 h-28 bg-gray-200 rounded"></div>
          <div class="text-xs text-gray-400">扫码关注官方账号</div>
        </div>
      </div>

      <el-divider />

      <div class="text-center text-xs text-gray-400 space-y-1">
        <div>Copyright © {{ year }} 番茄小说网</div>
        <div>ICP备案号占位 | 增值电信业务许可证占位</div>
        <div>联系方式占位：service@example.com</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
type FooterLink = { label: string; href: string };
interface LinkGroup {
  title: string;
  links: FooterLink[];
}

const linkGroups: LinkGroup[] = [
  {
    title: "关于我们",
    links: [
      { label: "公司简介", href: "#" },
      { label: "联系我们", href: "#" },
      { label: "加入我们", href: "#" },
    ],
  },
  {
    title: "服务支持",
    links: [
      { label: "作者入驻", href: "#" },
      { label: "版权合作", href: "#" },
      { label: "帮助中心", href: "#" },
    ],
  },
];

const year = new Date().getFullYear();
</script>

<style scoped></style>
