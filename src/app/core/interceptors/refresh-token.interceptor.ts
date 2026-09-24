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

import { Router } from '@angular/router';

import { AuthenticationService } from '../services/api/auth.service';
import { IdempotencyService } from '../services/api/idempotency-key.service';
import { AuthDialogService } from '../services/ui/AuthDialogService';
import { TokenStorageService } from '../services/ui/token-storage.service';
import { MessengerServices } from '../services/ui/messenger.service';


let isRefreshing = false;

const refreshSubject =
  new BehaviorSubject<boolean | null>(null);


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
  const router = inject(Router);
  const authDialog = inject(AuthDialogService);
  const tks = inject(TokenStorageService);
  const msgService = inject(MessengerServices);

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

            /*
             * Refresh thất bại.
             *
             * Không retry request hiện tại.
             */
            if (!isSuccess) {
              return throwError(() => error);
            }

            /*
             * Refresh thành công.
             */
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

          idempotencyService.clearRefreshTokenKey();

          return retryRequest(
            request,
            next
          );
        }),


        /*
         * Refresh thất bại.
         *
         * Trường hợp quan trọng:
         *
         * - refresh token hết hạn
         * - refresh token bị revoke
         * - refresh token không tồn tại
         * - refresh token không hợp lệ
         */
        catchError((refreshError: HttpErrorResponse) => {

          /*
           * Báo cho tất cả request đang chờ rằng
           * refresh đã thất bại.
           */
          refreshSubject.next(false);


          /*
           * Refresh token không còn hợp lệ.
           *
           * Logout chỉ nhằm yêu cầu BE xóa HttpOnly cookies.
           */
          return authService.logout().pipe(

            /*
             * Logout có thể thất bại vì network/server.
             * Không được để điều đó ngăn redirect.
             */
            catchError(() => {
              return throwError(() => refreshError);
            }),

            finalize(() => {

              /*
               * Dù logout thành công hay thất bại,
               * user vẫn phải quay về login.
               */
              // router.navigate(['/login']);
              
              msgService.warringWithMessage("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại");
              tks.signOut();
              router.navigate(['/']);
              const ref = authDialog.openLogin();
            }),

            /*
             * Giữ nguyên lỗi refresh ban đầu.
             */
            switchMap(() => {
              return throwError(() => refreshError);
            })
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