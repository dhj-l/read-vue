export const setItem = <T>(key: string, value: T) => {
  if (typeof value !== "string") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};
export const getItem = <T>(key: string, parse: boolean = true): T => {
  return parse
    ? JSON.parse(localStorage.getItem(key) || "{}")
    : ((localStorage.getItem(key) || "") as T);
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
