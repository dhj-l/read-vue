export type SegmentMode = "sentence" | "paragraph";

export interface SegmentOptions {
  mode?: SegmentMode;
}

const CLOSING_TOKENS = /[”’"'\)\]\}》】）]/;

export const segmentText = (
  input: string,
  options: SegmentOptions = {}
): string[] => {
  const mode = options.mode ?? "sentence";
  if (!input) return [];
  const s = input.replace(/\r\n/g, "\n");

  if (mode === "paragraph") {
    return s
      .split(/\n{2,}|\n/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  const res: string[] = [];
  let buf = "";
  let i = 0;
  const len = s.length;
  while (i < len) {
    const ch = s[i];
    buf += ch;

    const isBoundary = isSentenceBoundary(s, i);
    if (isBoundary) {
      let j = i + 1;
      while (j < len) {
        const cj = s[j] ?? "";
        if (!CLOSING_TOKENS.test(cj)) break;
        buf += cj;
        j++;
      }
      i = j - 1;
      const seg = buf.trim();
      if (seg) res.push(seg);
      buf = "";
    } else if (ch === "\n") {
      const seg = buf.trim();
      if (seg) res.push(seg);
      buf = "";
    }
    i++;
  }
  const tail = buf.trim();
  if (tail) res.push(tail);
  return res;
};

function isSentenceBoundary(s: string, idx: number): boolean {
  const ch = s[idx];
  if (ch === "…") {
    const next = s[idx + 1];
    return next !== "…";
  }
  if (ch === ".") {
    const prev = s[idx - 1] ?? "";
    const next = s[idx + 1] ?? "";
    if (/\d/.test(prev) && /\d/.test(next)) return false;
    const token = getTokenBeforeDot(s, idx);
    if (/^(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|e|i|U)$/i.test(token))
      return false;
    const isEllipsis =
      s.slice(idx, idx + 3) === "..." || s.slice(idx - 2, idx + 1) === "...";
    if (isEllipsis) {
      const after = s[idx + 1];
      return !(after === ".");
    }
    return true;
  }
  if (/[。！？!?；;：:]/.test(ch ?? "")) {
    const next = s[idx + 1] ?? "";
    if (/[？！!?]/.test(next)) return false;
    return true;
  }
  return false;
}

function getTokenBeforeDot(s: string, idx: number): string {
  let j = idx - 1;
  let token = "";
  while (j >= 0 && /[A-Za-z]/.test(s[j] ?? "")) {
    token = (s[j] ?? "") + token;
    j--;
    if (token.length > 5) break;
  }
  return token;
}
