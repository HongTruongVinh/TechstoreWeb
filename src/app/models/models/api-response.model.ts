import { EErrorType } from "../enum/etype_project.enum";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  ErrorType?: EErrorType;
}

export interface PagedResult<T> {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[];
}

export interface PagedQuery{
  page: number,
  pageSize: number,
  sortBy?: string,
  descending?: boolean
}