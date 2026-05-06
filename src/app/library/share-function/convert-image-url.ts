import { environment } from "../../../environments/environment";

export class ConvertPhotoUrl {
  
  public static convertPublicIdToUrl(path: string): string {
    if (!path) return '';
    
        // Nếu path đã là URL tuyệt đối thì không thay đổi
        if (path.startsWith('http://') || path.startsWith('https://')) {
          return path;
        }
        
        const fullPath = environment.imagesLink + path;
        return fullPath;
  }

}