import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  throwError
} from 'rxjs';

import {
  catchError,
  filter,
  finalize,
  switchMap,
  take
} from 'rxjs/operators';

import { AuthenticationService } from '../services/api/auth.service';
import { IdempotencyService } from '../services/api/idempotency-key.service';


let isRefreshing = false;

const refreshSubject = new BehaviorSubject<boolean | null>(null);


const AUTH_ENDPOINTS = [
  '/api/authentication/login',
  '/api/authentication/register',
  '/api/authentication/refresh',
  '/api/authentication/logout'
];


function isAuthEndpoint(url: string): boolean {
  return AUTH_ENDPOINTS.some(endpoint =>
    url.includes(endpoint)
  );
}


function retryRequest<T>(
  request: HttpRequest<T>,
  next: HttpHandlerFn
): Observable<HttpEvent<T>> {

  return next(
    request.clone({
      withCredentials: true
    })
  ) as Observable<HttpEvent<T>>;
}


export const refreshTokenInterceptor: HttpInterceptorFn = (
  request,
  next
) => {

  const authService = inject(AuthenticationService);
  const idempotencyService = inject(IdempotencyService);

  /*
   * Auth API không đi qua logic refresh.
   *
   * Nhưng vẫn gửi Cookie.
   */
  if (isAuthEndpoint(request.url)) {
    return next(
      request.clone({
        withCredentials: true
      })
    );
  }


  /*
   * Request bình thường.
   */
  return next(
    request.clone({
      withCredentials: true
    })
  ).pipe(

    catchError((error: HttpErrorResponse) => {

      /*
       * Không phải 401 → trả lỗi bình thường.
       */
      if (error.status !== 401) {
        return throwError(() => error);
      }


      /*
       * Đang có request khác thực hiện refresh.
       *
       * Request hiện tại chờ kết quả refresh.
       */
      if (isRefreshing) {

        return refreshSubject.pipe(

          filter(
            (result): result is boolean =>
              result !== null
          ),

          take(1),

          switchMap(isSuccess => {

            if (!isSuccess) {
              return throwError(() => error);
            }

            return retryRequest(
              request,
              next
            );
          })
        );
      }


      /*
       * Request đầu tiên bắt đầu refresh.
       */
      isRefreshing = true;

      refreshSubject.next(null);


      return authService.refreshToken().pipe(

        /*
         * Refresh thành công.
         */
        switchMap(() => {

          refreshSubject.next(true);

          idempotencyService.clearAllKeys();

          return retryRequest(
            request,
            next
          );
        }),


        /*
         * Refresh thất bại.
         */
        catchError((refreshError) => {

          refreshSubject.next(false);

          return throwError(
            () => refreshError
          );
        }),


        /*
         * Cho phép request 401 tiếp theo
         * thực hiện refresh mới.
         */
        finalize(() => {

          isRefreshing = false;

        })
      );
    })
  );
};