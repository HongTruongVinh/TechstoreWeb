
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
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