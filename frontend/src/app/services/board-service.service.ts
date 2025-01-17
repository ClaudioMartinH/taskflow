import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task, User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class BoardServiceService {
  private apiUrl = 'http://localhost:5050/api/v1/boards'; // URL del endpoint de login

  constructor(private http: HttpClient) {}

  getBoards(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  getBoard(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBoard(
    name: string,
    user: User,
    parentBoardId?: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, {
      name,
      user_id: user.id, 
      parent_board_id: parentBoardId ?? null,
    });
  }

  getTasksByBoard(userId: string, boardId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${userId}/board/${boardId}`
    );
  }
}
