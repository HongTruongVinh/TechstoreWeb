import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ConfigForApp } from '../../library/share-function/config-app';
import { EContentType } from '../../library/enum/econtenttype';
import { TokenStorageService } from '../services/ui/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TransferHttpService {

  private readonly Host: string;
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private router: Router,) {
    this.Host = this.baseUrl;
  }

  get<T>(url: string, contentType?: EContentType) {
    return this.mapshare(this.http.get<T>(this.Host + url, this.buildHeader(undefined, contentType)));
  }

  // getFile(url: string, contentType?: EContentType) {
  //   // tslint:disable-next-line: prefer-const
  //   let sContent: string = this.contentType(contentType === undefined ? EContentType.json : contentType);
  //   let httpHeaders = new HttpHeaders({
  //     'Content-Type': sContent
  //   });

  //   if (LocalStorageConfig.GetUser() != null) {
  //     // tslint:disable-next-line: prefer-const
  //     let currentUser = LocalStorageConfig.GetUser();
  //     const returnToken = currentUser.Data;
  //     if (currentUser && returnToken.Token) {
  //       httpHeaders = new HttpHeaders(
  //         {
  //           // tslint:disable-next-line: object-literal-key-quotes
  //           'Authorization': 'Bearer ' + returnToken.Token,
  //           'Content-Type': sContent
  //         },
  //       );
  //     }
  //   }
  //   // return this.mapshare(this.http.get(this.Host + url, { observe:'response', responseType: 'blob' }));
  //   return this.http.get(this.Host + url, { headers: httpHeaders, observe: 'response', responseType: 'blob' })
  //     .pipe(map((res: any) => res));
  // }

  post(url: string, body: any, idempotencyKey?: string, contentType?: EContentType) {
    return this.mapshare(this.http.post(this.Host + url, body, this.buildHeader(idempotencyKey, contentType)));
  }

  // postUpload(url: string, body: FormData) {
  //   return (this.mapshare(this.http.post(this.Host + url, body, this.jwtUploadFile())));
  // }

  put(url: string, body: any, idempotencyKey?: string, contentType?: EContentType) {
    return this.mapshare(this.http.put(this.Host + url, body, this.buildHeader(idempotencyKey, contentType)));
  }

  putUrl(url: string, idempotencyKey?: string, contentType?: EContentType) {
    const options = this.buildHeader(idempotencyKey, contentType);
    return this.mapshare(this.http.put(this.Host + url, null, options));
  }

  delete(url: string, idempotencyKey?: string, contentType?: EContentType) {
    return this.mapshare(this.http.delete(this.Host + url, this.buildHeader(idempotencyKey, contentType)));
  }

  private mapshare(data: Observable<any>) {
    return data.pipe(
      catchError((error: HttpErrorResponse) =>
        this.handleAuthError(error)
      )
    );
  }

  private handleAuthError(error: HttpErrorResponse) {
    ConfigForApp.isLoadingButton = false;

    // Không có mạng
    if (!navigator.onLine || error.status === 0) {
      this.showError(
        'Không thể kết nối đến máy chủ',
        'Vui lòng kiểm tra kết nối Internet và thử lại.'
      );

      return throwError(() => error);
    }

    switch (error.status) {
      case 400:
        // Bad Request
        // Không nên Swal ở interceptor.
        // Để component/service xử lý error.error.message.
        return throwError(() => error);

      case 401:
        // Unauthorized
        localStorage.removeItem('currentUser');

        return throwError(() => error);

      case 403:
        // Forbidden
        this.showError(
          'Không có quyền truy cập',
          this.getServerMessage(error) ||
          'Bạn không có quyền thực hiện thao tác này.'
        );

        return throwError(() => error);

      case 404:
        // Not Found
        // Để component xử lý nếu đây là lỗi nghiệp vụ.
        return throwError(() => error);

      case 409:
        // Conflict
        // Ví dụ voucher hết lượt, sản phẩm đã thay đổi...
        // Để component xử lý message từ server.
        return throwError(() => error);

      case 422:
        // Unprocessable Entity
        return throwError(() => error);

      case 429:
        // Too Many Requests
        this.showError(
          'Thao tác quá nhanh',
          'Vui lòng chờ một chút rồi thử lại.'
        );

        return throwError(() => error);

      default:
        if (error.status >= 500) {
          this.showError(
            'Có lỗi xảy ra',
            this.getServerMessage(error) ||
            'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.'
          );
        }

        return throwError(() => error);
    }
  }

  private showError(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'error',
      iconColor: '#d31e1e',
      confirmButtonColor: '#e76767',
      showCancelButton: true,
    });
  }

  private getServerMessage(error: HttpErrorResponse): string | null {
    return error.error?.message
      ?? error.error?.messenger?.message
      ?? error.message
      ?? null;
  }

  private buildHeader(idempotencyKey?: string, contentType?: EContentType) {
    // create authorization header with jwt token
    const sContent: string = this.contentType(contentType === undefined ? EContentType.json : contentType);
    let httpHeaders = new HttpHeaders({
      'Content-Type': sContent,
    });

    if (this.tokenStorageService.getUser() != null) {
      const currentUser = this.tokenStorageService.getUser();
      const returnToken = this.tokenStorageService.getToken();
      if (currentUser && returnToken) {
        httpHeaders = new HttpHeaders(
          {
            // tslint:disable-next-line: object-literal-key-quotes
            'Authorization': 'Bearer ' + returnToken,
            'Content-Type': sContent
          },
        );
      }
    }

    if (idempotencyKey) {
      httpHeaders = httpHeaders.set('Idempotency-Key', idempotencyKey);
    }

    return { headers: httpHeaders };
  }


  // private jwtUploadFile() {
  //   // create authorization header with jwt token

  //   let httpHeaders = new HttpHeaders();
  //   const sContent = this.contentType(EContentType.formdata);

  //   if (LocalStorageConfig.GetUser() != null) {
  //     // tslint:disable-next-line: prefer-const
  //     let currentUser = LocalStorageConfig.GetUser();
  //     const returnToken = currentUser.token;
  //     if (currentUser && returnToken) {
  //       httpHeaders = new HttpHeaders(
  //         {
  //           // tslint:disable-next-line: object-literal-key-quotes
  //           'Authorization': 'Bearer ' + returnToken,
  //         },
  //       );
  //     }
  //   }
  //   return { headers: httpHeaders };
  // }

  private contentType(typeValue: EContentType) {
    // tslint:disable-next-line: prefer-const
    let result = 'application/json; charset=utf-8';
    switch (typeValue) {
      case EContentType.json:
        return result;
      case EContentType.urlencoded:
        return 'application/x-www-form-urlencoded; charset=utf-8';
      case EContentType.formdata:
        return 'multipart/form-data';
      default:
        return result;
    }
  }
}
