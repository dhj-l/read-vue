import http from "../http";
import type {
  BookCheckListParams,
  BookCheckListResponse,
  UpdateBookCheckRequest,
  BookCheckItem,
} from "./type";

export const getBookChecksAPI = async (
  params: Partial<BookCheckListParams>
) => {
  return await http.get<BookCheckListResponse>("/book-check", { params });
};

export const getBookCheckDetailAPI = async (id: number) => {
  return await http.get<BookCheckItem>(`/book-check/${id}`);
};

export const updateBookCheckAPI = async (
  id: number,
  data: UpdateBookCheckRequest
) => {
  return await http.patch(`/book-check/${id}`, data);
};
