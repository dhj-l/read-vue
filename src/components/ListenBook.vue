<template>
  <div class="mt-6 p-4 border rounded-lg bg-white dark:bg-[#262626]">
    <div class="flex items-center flex-wrap gap-3">
      <el-select
        v-model="selectedVoice"
        placeholder="选择发音人"
        style="width: 160px"
      >
        <el-option
          v-for="opt in voiceOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-checkbox v-model="disableCache">禁用缓存</el-checkbox>
      <el-select v-model="selectedAue" placeholder="编码" style="width: 120px">
        <el-option label="MP3" value="lame" />
        <el-option label="RAW16k" value="raw" />
      </el-select>
      <el-button type="primary" :disabled="playing || loading" @click="play()"
        >播放</el-button
      >
      <el-button :disabled="!playing" @click="pause()">暂停</el-button>
      <el-button :disabled="playing || !audioReady" @click="resume()"
        >继续</el-button
      >
      <el-button @click="stop()">停止</el-button>
      <el-button :disabled="loading || currentIndex <= 0" @click="prev()"
        >上一段</el-button
      >
      <el-button
        :disabled="loading || currentIndex >= segments.length - 1"
        @click="next()"
        >下一段</el-button
      >
      <span class="text-sm text-gray-600 dark:text-[#b3b3b3]"
        >{{ currentIndex + 1 }}/{{ segments.length }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { API_BASE_URL } from "@/config/config";
import { io, type Socket } from "socket.io-client";
import emitter from "@/utils/eventEmitter";

export interface ListenBookProps {
  segments: string[];
  voice?: string;
  aue?: "lame" | "raw";
}

const props = withDefaults(defineProps<ListenBookProps>(), {
  voice: "x4_xiaoyan",
  aue: "lame",
});

const segments = computed(() => props.segments ?? []);
const currentIndex = ref(0);
const playing = ref(false);
const loading = ref(false);
const audioEl = ref<HTMLAudioElement | null>(null);
const audioReady = ref(false);
let socket: Socket | null = null;

type VoiceOption = { label: string; value: string };
const voiceOptions: VoiceOption[] = [
  { label: "讯飞小燕", value: "x4_xiaoyan" },
  { label: "讯飞小雯", value: "x4_yezi" },
  { label: "讯飞许久", value: "aisjiuxu" },
  { label: "讯飞小倩", value: "aisjinger" },
  { label: "讯飞小宝", value: "aisbabyxu" },
];
const selectedVoice = ref<string>(props.voice ?? "x4_xiaoyan");
const selectedAue = ref<"lame" | "raw">(props.aue ?? "lame");
const disableCache = ref(false);

const connect = () => {
  socket = io(`${API_BASE_URL}/ws`, { transports: ["websocket"] });
};

const requestTts = async (
  text: string
): Promise<{ audioBase64: string; mime: string }> => {
  return await new Promise((resolve, reject) => {
    if (!socket) return reject(new Error("未连接"));
    socket.emit(
      "tts:request",
      {
        text,
        voice: selectedVoice.value,
        aue: selectedAue.value,
        noCache: disableCache.value,
      },
      (res: {
        ok: boolean;
        audioBase64?: string;
        mime?: string;
        error?: string;
        voice?: string;
      }) => {
        if (res?.ok && res.audioBase64 && res.mime) {
          console.log("服务端实际发音人:", res.voice);
          resolve({ audioBase64: res.audioBase64, mime: res.mime });
        } else {
          reject(new Error(res?.error ?? "合成失败"));
        }
      }
    );
  });
};

const playSegment = async (idx: number) => {
  const seg = segments.value[idx] ?? "";
  if (!seg) return;
  loading.value = true;
  try {
    const { audioBase64, mime } = await requestTts(seg);

    audioEl.value?.pause();
    audioEl.value = new Audio(`data:${mime};base64,${audioBase64}`);
    audioEl.value.addEventListener("ended", onEnded);
    await audioEl.value.play();
    audioReady.value = true;
    playing.value = true;
  } finally {
    loading.value = false;
  }
};

const onEnded = () => {
  if (currentIndex.value < segments.value.length - 1) {
    currentIndex.value += 1;
    playSegment(currentIndex.value);
  } else {
    playing.value = false;
  }
};

const play = () => {
  currentIndex.value = Math.max(
    0,
    Math.min(currentIndex.value, segments.value.length - 1)
  );
  playSegment(currentIndex.value);
};
const pause = () => {
  audioEl.value?.pause();
  playing.value = false;
};
const resume = async () => {
  if (!audioEl.value) return;
  await audioEl.value.play();
  playing.value = true;
};
const stop = () => {
  audioEl.value?.pause();
  audioEl.value = null;
  playing.value = false;
  audioReady.value = false;
};
const prev = () => {
  if (currentIndex.value <= 0) return;
  currentIndex.value -= 1;
  playSegment(currentIndex.value);
};
const next = () => {
  if (currentIndex.value >= segments.value.length - 1) return;
  currentIndex.value += 1;
  playSegment(currentIndex.value);
};

onMounted(connect);
onUnmounted(() => {
  audioEl.value?.pause();
  audioEl.value = null;
  socket?.disconnect();
});
</script>

<style scoped></style>
