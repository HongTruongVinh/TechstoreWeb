import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { String } from '../../library/share-function/string';

interface ResLinkSetting {
  [group: string]: {
    [func: string]: string;
  };
}

@Injectable({ providedIn: 'root' })
export class LinkSettingsService {
  private resLinkSettingUrl = 'assets/document/reslink-api.json';

  constructor(private http: HttpClient) {}

  private loadResLinkSetting(): Observable<ResLinkSetting> {
    return this.http.get<ResLinkSetting>(this.resLinkSettingUrl).pipe(
      catchError((err) => {
        console.error('❌ Lỗi load reslink-api.json:', err);
        return of({});
      })
    );
  }

  /**
   * Trả về đường dẫn đã format sẵn
   * @param pGroup Nhóm API
   * @param pFunction Tên API
   * @param pParams Các tham số cần format
   */
  public getResLinkSetting(pGroup: string, pFunction: string, ...pParams: any[]): Observable<string> {
    return this.loadResLinkSetting().pipe(
      map((resLinkSetting) => {
        const linkTemplate = resLinkSetting[pGroup]?.[pFunction];
        if (!linkTemplate) {
          console.warn(`⚠️ Không tìm thấy cấu hình cho group="${pGroup}", function="${pFunction}"`);
          return '';
        }
        const url = String.Format(linkTemplate, pParams);

        return url;
      })
    );
  }
}
