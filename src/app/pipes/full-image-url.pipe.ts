import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'fullImageUrl',
  standalone: true // ⚠️ Quan trọng với standalone
})
export class FullImageUrlPipe implements PipeTransform {
  private baseUrl = environment.imagesLink;

  transform(path: string): string {

    if (!path) return '';

    // Nếu path đã là URL tuyệt đối thì không thay đổi
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const fullPath = this.baseUrl + path;
    return fullPath;
  }
}