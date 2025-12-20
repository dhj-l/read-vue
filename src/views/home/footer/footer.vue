<template>
  <footer class="bg-[rgb(241,241,241)]">
    <div class="max-w-7xl mx-auto px-6 py-16">
      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <!-- 品牌区域 -->
        <div class="flex flex-col gap-5">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30"
            >
              <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.5c1.84 0 3.48.96 4.34 2.5H7.66c.86-1.54 2.5-2.5 4.34-2.5z"
                />
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-900 tracking-wide"
              >星阅小说网</span
            >
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">
            海量正版小说 · 免费畅快阅读
          </p>
          <div class="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="#"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-orange-500/10"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                />
              </svg>
              <span>iOS 下载</span>
            </a>
            <a
              href="#"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-orange-500/10"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.8 10.92 3.5 12.62 3.11 14.5h17.78c-.39-1.88-1.69-3.58-3.29-5.02zM10 12.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm4 0c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"
                />
              </svg>
              <span>Android 下载</span>
            </a>
          </div>
        </div>

        <!-- 链接组 -->
        <div
          v-for="group in linkGroups"
          :key="group.title"
          class="flex flex-col gap-4"
        >
          <h3 class="text-base font-semibold text-gray-900 tracking-wide">
            {{ group.title }}
          </h3>
          <ul class="flex flex-col gap-3">
            <li v-for="link in group.links" :key="link.label">
              <a
                :href="link.href"
                class="text-sm text-gray-600 hover:text-orange-500 transition-all duration-300 inline-block hover:translate-x-1 relative group"
              >
                {{ link.label }}
                <span
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"
                ></span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 关注我们 -->
        <div class="flex flex-col gap-4">
          <h3 class="text-base font-semibold text-gray-900 tracking-wide">
            关注我们
          </h3>
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-32 h-32 bg-white rounded-xl flex items-center justify-center shadow-md border-2 border-gray-100"
            >
              <svg
                class="w-20 h-20 text-orange-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"
                />
              </svg>
            </div>
            <p class="text-xs text-gray-500 text-center">扫码关注官方账号</p>
          </div>
        </div>
      </div>

      <!-- 分割线 -->
      <div
        class="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent mb-8"
      ></div>

      <!-- 底部信息 -->
      <div class="flex flex-col items-center gap-3 text-sm text-gray-500">
        <p class="font-medium text-gray-600">© {{ year }} 小说网 版权所有</p>
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <span>ICP备案号占位</span>
          <span class="hidden sm:inline text-gray-400">|</span>
          <span>增值电信业务许可证占位</span>
        </div>
        <p>联系方式：service@example.com</p>
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
