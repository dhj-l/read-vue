<template>
  <div
    class="mt-[24px] p-[16px] bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#b3b3b329] rounded-[8px] shadow-sm transform transition-all duration-300"
  >
    <div class="flex items-center justify-between">
      <div
        class="flex items-center text-sm text-gray-700 dark:text-[#b3b3b3] text-[16px]"
      >
        <span
          class="w-[8px] h-[8px] rounded-[4px] mr-[8px]"
          :class="playing ? 'bg-green-500' : 'bg-gray-300'"
        ></span>
        <span>{{ playing ? "播放中" : "已暂停" }}</span>
      </div>
      <div class="text-[12px] text-gray-500 dark:text-[#b3b3b366]">
        {{ currentIndex + 1 }}/{{ segments.length }}
      </div>
    </div>

    <div
      class="mt-[12px] h-[4px] w-full bg-gray-200 dark:bg-[#b3b3b329] rounded-[4px]"
    >
      <div
        class="h-full bg-orange-500 rounded-[4px]"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>

    <div
      class="mt-[12px] flex items-center flex-wrap gap-3 text-gray-800 dark:text-[#b3b3b3]"
    >
      <el-select
        v-model="selectedVoice"
        placeholder="选择发音人"
        size="small"
        class="w-[160px]"
        :teleported="false"
      >
        <el-option
          v-for="opt in voiceOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-checkbox v-model="disableCache">禁用缓存</el-checkbox>
      <el-select
        v-model="selectedAue"
        placeholder="编码"
        size="small"
        class="w-[120px]"
        :teleported="false"
      >
        <el-option label="MP3" value="lame" />
      </el-select>
      <el-button-group>
        <el-button
          type="primary"
          size="small"
          round
          :disabled="playing || loading"
          @click="play()"
          >播放</el-button
        >
        <el-button size="small" round :disabled="!playing" @click="pause()"
          >暂停</el-button
        >
        <el-button
          size="small"
          round
          :disabled="playing || !audioReady"
          @click="resume()"
          >继续</el-button
        >
        <el-button size="small" round @click="stop()">停止</el-button>
        <el-button
          size="small"
          round
          :disabled="loading || currentIndex <= 0"
          @click="prev()"
          >上一段</el-button
        >
        <el-button
          size="small"
          round
          :disabled="loading || currentIndex >= segments.length - 1"
          @click="next()"
          >下一段</el-button
        >
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
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

const segments = ref<string[]>([]);
const currentIndex = ref(0);
const playing = ref(false);
const loading = ref(false);
const audioEl = ref<HTMLAudioElement | null>(null);
const audioReady = ref(false);
let socket: Socket | null = null;

type VoiceOption = { label: string; value: string };
const voiceOptions: VoiceOption[] = [
  { label: "小燕", value: "x4_xiaoyan" },
  { label: "小雯", value: "x4_yezi" },
  { label: "许久", value: "aisjiuxu" },
  { label: "小倩", value: "aisjinger" },
  { label: "小宝", value: "aisbabyxu" },
];
const selectedVoice = ref<string>(props.voice ?? "x4_xiaoyan");
const selectedAue = ref<"lame" | "raw">(props.aue ?? "lame");
const disableCache = ref(false);
watch(
  () => props.segments,
  (newVal) => {
    segments.value = newVal;
    if (playing.value) {
      currentIndex.value = 0;
      setTimeout(() => {
        playSegment(currentIndex.value);
      }, 0);
    }
  },
  { immediate: true }
);

const connect = () => {
  socket = io(`${API_BASE_URL}/ws`, { transports: ["websocket"] });
};

const requestTts = async (
  text: string
): Promise<{ audioBase64: string; mime: string }> => {
  return await new Promise((resolve, reject) => {
    if (!socket) {
      emitter.emit("requestError", "未连接");
      return reject(new Error("未连接"));
    }
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
          resolve({ audioBase64: res.audioBase64, mime: res.mime });
        } else {
          emitter.emit("requestError", res?.error ?? "合成失败");
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
    emitter.emit("setIdxIndex", idx);
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
    let play = {
      play: false,
    };
    emitter.emit("nextChapter", play);
    playing.value = play.play;
  }
};

const play = () => {
  if (!segments.value.length) return;
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

const progressPercent = computed(() => {
  const total = segments.value.length;
  if (!total) return 0;
  return Math.round(((currentIndex.value + 1) / total) * 100);
});

onMounted(connect);
onUnmounted(() => {
  audioEl.value?.pause();
  audioEl.value = null;
  socket?.disconnect();
});
</script>

<style scoped></style>
