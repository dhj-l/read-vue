export interface TableColumns {
  prop: string;
  label: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
  minWidth?: string | number;
}
