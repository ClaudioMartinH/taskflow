import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://taskflow.martinherranzc.es/api/v1/auth'; // URL del endpoint de login
  private registerUrl = 'https://taskflow.martinherranzc.es/api/v1/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: { token: string; user: { id: string; }; }) => {
         
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
   formData: FormData
  ): Observable<any> {
    const username = formData.get('username') as string;
    const fullname = formData.get('fullname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (formData.get('profilePic') as string) {
      formData.delete('profilePic');
      formData.append('profile_pic', formData.get('profilePic') as File);
    }
    return this.http.post<any>(`${this.registerUrl}/create`, {
      username,
      fullname,
      email,
      password,
    });
  }
}
