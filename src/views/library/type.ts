export interface LibraryStatus {
  label: string;
  value: number;
}

export interface LibraryCount {
  label: string;
  value: number;
}

export interface LibraryFilter<T = any> {
  label: string;
  children: T[];
}

export interface LibrarySort {
  label: string;
  value: string;
}
