import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5050/api/v1/auth'; // URL del endpoint de login
  private registerUrl = 'http://localhost:5050/api/v1/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log(email, password);
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          console.log(response)
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userId', response.user.id);
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  register(
    username: string,
    fullname: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post<any>(`${this.registerUrl}/create`, {
      username,
      fullname,
      email,
      password,
    });
  }
}
