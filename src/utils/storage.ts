export const setItem = <T>(key: string, value: T) => {
  if (typeof value !== "string") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};
export const getItem = <T>(
  key: string,
  parse: boolean = true
): T | undefined => {
  const item = localStorage.getItem(key);
  if (item) {
    if (parse) {
      return JSON.parse(item) as T;
    } else {
      return item as T;
    }
  } else {
    return undefined;
  }
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
