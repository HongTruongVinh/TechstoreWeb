import { Injectable } from '@angular/core';
import { User } from '../../models/models/user/user.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    sessionStorage.clear();
  }

  public saveToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    //return localStorage.getItem('token');
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User | null {
  const userJson = sessionStorage.getItem(USER_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Lỗi khi parse user từ sessionStorage:', e);
      return null;
    }
  }
  return null;
}
}
