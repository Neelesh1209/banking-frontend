import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { AuthUser } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8083/auth';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // REGISTRATION OTP
  sendOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/send-otp`,
      { email },
      { responseType: 'text' as 'json' }
    );
  }

  verifyAndRegister(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/verify-register`,
      data
    );
  }

  // LOGIN OTP
  sendLoginOtp(credentials: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/send-login-otp`,
      credentials,
      { responseType: 'text' as 'json' }
    );
  }

  verifyLogin(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/verify-login`,
      data
    );
  }

  // NORMAL LOGIN
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      credentials
    );
  }

  // USER DETAILS
  getUserByEmail(email: string): Observable<AuthUser> {
    return this.http.get<AuthUser>(
      `${this.baseUrl}/user/${email}`
    );
  }

  // TOKEN STORAGE
  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getLoggedInEmail(): string | null {
    const token = this.getToken();

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
}