import { Injectable, signal } from '@angular/core';
import { User } from '../../../models/models/user/user.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'currentUser';
const GUEST_KEY = 'currentGuest';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  isLoggedIn = signal(false);

  constructor() {
    if (this.getUser() != null) {
      this.isLoggedIn.set(true);
    }
  }

  signOut(): void {
    localStorage.clear();
    this.isLoggedIn.set(false);
  }

  public saveToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
    this.isLoggedIn.set(true);
  }

  public getToken(): string | null {
    //return localStorage.getItem('token');
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: User): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
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

  public saveGuestId(guest: string): void {
    localStorage.removeItem(GUEST_KEY);
    localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
  }

  public getGuestId(): string | null {
    const guestJson = localStorage.getItem(GUEST_KEY);
    if (guestJson) {
      try {
        return JSON.parse(guestJson) as string;
      } catch (e) {
        console.error('Lỗi khi parse guestId từ sessionStorage:', e);
        return null;
      }
    }
    return null;
  }
}
