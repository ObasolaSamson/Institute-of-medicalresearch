import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/authAndUserManagement/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': environment.apiKey, // Store the API key in your environment file
    });

    const body = {
      userName,
      password,
      rememberMe: true,
      ipAddress: null,
      domainName: null,
      deviceName: null,
      location: null,
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem('authToken', res.token);
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(null);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    const url = `${this.baseUrl}/authAndUserManagement/forgot-password`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': environment.apiKey,
    });

    return this.http.post<any>(url, { email }, { headers });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
