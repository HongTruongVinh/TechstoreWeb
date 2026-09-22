import { EContentType } from "../../library/enum/econtenttype";

export interface HttpOptions {
  idempotencyKey?: string;
  withCredentials?: boolean;
  guestId?: string;
  contentType?: EContentType;
}