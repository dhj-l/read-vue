import { nextTick, ref } from "vue";

export const useScrollHook = () => {
  const autoScroll = ref(true);
  const messageScrollRef = ref<HTMLDivElement>();
  const onScroll = () => {
    const el = messageScrollRef.value;
    if (!el) return;
    const threshold = 10;
    const isAtBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    autoScroll.value = isAtBottom;
  };

  const smoothScrollTo = (el: HTMLElement, top: number, duration = 300) => {
    const start = el.scrollTop;
    const change = top - start;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = t * (2 - t);
      el.scrollTop = start + change * eased;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const maybeScrollToBottom = async () => {
    if (!autoScroll.value) return;
    await nextTick();
    const el = messageScrollRef.value;
    if (!el) return;
    if (typeof el.scrollTo === "function") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      smoothScrollTo(el, el.scrollHeight);
    }
  };
  return {
    autoScroll,
    messageScrollRef,
    maybeScrollToBottom,
    onScroll,
  };
};
