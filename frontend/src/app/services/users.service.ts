import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root', // Hace que este servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = 'http://localhost:5050/api/v1/users'; // Ajusta al endpoint de tu backend

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/search/${userId}`);
  }
  updateUser(
    id: string,
    username: string,
    fullname: string,
    email: string,
    password: string,
  ): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, {
      id,
      username,
      fullname,
      email,
      password,
    });
  }
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
  updateProfilePicture(userId: string, profile_pic: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile-pic/${userId}`, {
      profile_pic,
    });
  }
}
