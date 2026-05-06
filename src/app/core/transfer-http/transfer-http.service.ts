import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ConfigForApp } from '../../library/share-function/config-app';
import { EContentType } from '../../library/enum/econtenttype';
import { TokenStorageService } from '../services/token-storage.service';

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
    return this.mapshare(this.http.get<T>(this.Host + url, this.jwt(contentType)));
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

  post(url: string, body: any, contentType?: EContentType) {
    

//     console.log(body);
//     this.mapshare(this.http.post(this.Host + url, body, this.jwt(contentType))).subscribe({
//   next: (res) => {
//     console.log(res);
//     if (res.retCode == 0) {
//       const data = res.data;
//       if (data) {
//         // xử lý dữ liệu
//       }
//     }
//   },
//   error: (err) => {
//     console.error('API lỗi:', err);
//   }
// });

    return this.mapshare(this.http.post(this.Host + url, body, this.jwt(contentType)));
  }

  // postUpload(url: string, body: FormData) {
  //   return (this.mapshare(this.http.post(this.Host + url, body, this.jwtUploadFile())));
  // }

  put(url: string, body: any, contentType?: EContentType) {
    return this.mapshare(this.http.put(this.Host + url, body, this.jwt(contentType)));
  }

  putUrl(url: string, contentType?: EContentType) {
    const options = this.jwt(contentType);
    return this.mapshare(this.http.put(this.Host + url, null, options));
  }

  delete(url: string, contentType?: EContentType) {
    return this.mapshare(this.http.delete(this.Host + url, this.jwt(contentType)));
  }

  private mapshare(data: Observable<any>) {
    return data.pipe(
      map(res => res),
      catchError(async (error) => this.handleAuthError(error))
    );
  }

  private handleAuthError(error: HttpErrorResponse) {
    if (!navigator.onLine) {
      Swal.fire({
        title: 'Có lỗi xảy ra?',
        text: 'Lỗi về đường truyền internet vui lòng kiểm tra lại',
        icon: 'question',
        iconColor: '#1ea6d3',
        confirmButtonColor: '#4b93ff',
        showCancelButton: true,
      });
      return throwError(() => error);
    }
    
    // handle your auth error or rethrow
    if (error.status === 401) {
      ConfigForApp.isLoadingButton = false;
      // this.notification.error('Thông báo lỗi!', 'Code 401: ' + error.statusText + '<br>' + error.error.messenger.message);
      // this.router.navigate(['/error']);
      localStorage.removeItem('currentUser');
      return throwError(() => error);
    }

    if (error.status === 400) {
      ConfigForApp.isLoadingButton = false;
      // this.notification.error('Thông báo lỗi!', 'Thông số truyền vào không có hoặc không đúng <br> Code 400: ' + error.message);
      // this.router.navigate(['/error']);
      Swal.fire({
        title: 'Có lỗi xảy ra?',
        text: `${error.message}- thông số truyền vào có vẻ không đúng`,
        icon: 'question',
        iconColor: '#1ea6d3',
        confirmButtonColor: '#4b93ff',
        showCancelButton: true,
      });
      return throwError(() => error);
    }

    if (error.status === 500) {
      ConfigForApp.isLoadingButton = false;
      if (error.error.messenger == null || undefined) {

        Swal.fire({
          title: 'Có lỗi xảy ra?',
          text: `${error.message}`,
          icon: 'question',
          iconColor: '#1ea6d3',
          confirmButtonColor: '#4b93ff',
          showCancelButton: true,
        });
        return throwError(() => error);

      } else {
        Swal.fire({
          title: 'Có lỗi xảy ra?',
          text: `${error.error.messenger.message}`,
          icon: 'question',
          iconColor: '#1ea6d3',
          confirmButtonColor: '#4b93ff',
          showCancelButton: true,
        });
        return throwError(() => error);
      }
    } else if (error.status === 0) {
      ConfigForApp.isLoadingButton = false;
      Swal.fire({
        title: 'Có lỗi xảy ra?',
        text: `${error.message}`,
        icon: 'question',
        iconColor: '#1ea6d3',
        confirmButtonColor: '#4b93ff',
        showCancelButton: true,
      });
      return throwError(() => error);
    }
    return throwError(() => error);
  }

  private jwt(contentType?: EContentType) {
    // create authorization header with jwt token
    const sContent: string = this.contentType(contentType === undefined ? EContentType.json : contentType);
    let httpHeaders = new HttpHeaders({
      'Content-Type': sContent,
    });

    // if (LocalStorageConfig.GetUser() != null) {
    //   // tslint:disable-next-line: prefer-const
    //   let currentUser = LocalStorageConfig.GetUser();
    //   const returnToken = currentUser.token;
    //   if (currentUser && returnToken) {
    //     httpHeaders = new HttpHeaders(
    //       {
    //         // tslint:disable-next-line: object-literal-key-quotes
    //         'Authorization': 'Bearer ' + returnToken,
    //         'Content-Type': sContent
    //       },
    //     );
    //   }
    // }

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
