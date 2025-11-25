export const setItem = <T>(key: string, value: T) => {
  if (typeof value !== "string") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};
export const getItem = <T>(key: string, parse: boolean = true): T => {
  const raw = localStorage.getItem(key);
  if (parse) {
    return (raw ? JSON.parse(raw) : (null as any)) as T;
  }
  return (raw ?? "") as any as T;
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
