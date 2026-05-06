export interface ApiResponseModel<T> {
  partnerCode?: string | null;
  retCode: string | number | null;
  data?: T | null;
  statusCode: number;
  systemMessage?: string | null;
}

export interface PageResult<T>{
  currentPage: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  firstRowOnPage: number;
  lastRowOnPage: number;
  results?: T | null;
}