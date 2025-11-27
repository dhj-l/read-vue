export const setItem = <T>(key: string, value: T) => {
  if (typeof value !== "string") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};
export const getItem = <T>(key: string, parse: boolean = true): T => {
  if (parse) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : (item as T);
  } else {
    return localStorage.getItem(key) as T;
  }
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
