<template>
  <el-drawer v-model="visible" :title="title" :size="size">
    <div class="p-4 space-y-4">
      <div v-if="imageUrl || heading || subheading || extra" class="flex items-start space-x-4">
        <el-image v-if="imageUrl" :src="imageUrl" fit="cover" style="width: 120px; height: 160px; border-radius: 6px" />
        <div class="flex-1">
          <div v-if="heading" class="text-lg font-medium">{{ heading }}</div>
          <div v-if="subheading" class="text-gray-500 mt-1">{{ subheading }}</div>
          <div v-if="extra" class="text-gray-400 mt-2">{{ extra }}</div>
        </div>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="it in items" :key="it.label" :label="it.label">{{ it.value }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="content">
        <div class="text-sm text-gray-500 mb-2">{{ contentLabel }}</div>
        <div class="p-3 border rounded whitespace-pre-line">{{ content }}</div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface DescriptionItem {
  label: string;
  value?: string | number;
}

const props = defineProps<{
  modelValue: boolean;
  title: string;
  size?: string | number;
  imageUrl?: string;
  heading?: string;
  subheading?: string;
  extra?: string;
  items: DescriptionItem[];
  content?: string;
  contentLabel?: string;
}>();

const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>();
const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});
</script>

<style scoped></style>