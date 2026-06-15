export interface ApiResponseModel<T> {
  partnerCode?: string | null;
  retCode: string | number | null;
  data?: T | null;
  statusCode: number;
  systemMessage?: string | null;
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