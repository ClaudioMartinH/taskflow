import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
  private apiUrl = 'https://taskflow.martinherranzc.es/api/v1/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        map((tasks) => tasks.filter((task) => task.task_status === 'COMPLETED'))
      );
  }

  getPendingTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        map((tasks) => tasks.filter((task) => task.task_status !== 'COMPLETED'))
      );
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  getTasksByUserAndBoard(userId: string, boardId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/board/${boardId}`);
  }

  addTask(
    title: string,
    description: string,
    userId: string,
    boardId: string,
    task_status: string
  ) {
    return this.http.post<Task>(this.apiUrl, {
      title,
      description,
      user_id: userId,
      board_id: boardId,
      task_status,
    });
  }

  toggleCompletedTask(taskId: string, userId: string, boardId: string) {
    return this.http.post<Task>(`${this.apiUrl}/complete/${taskId}`, {
      user_id: userId,
      board_id: boardId,
    });
  }

  toggleAssignedTask(taskId: string, userId: string, boardId: string) {
    return this.http.post<Task>(`${this.apiUrl}/assign/${taskId}`, {
      user_id: userId,
      board_id: boardId,
    });
  }
  toggleInProgressTask(taskId: string, userId: string, boardId: string) {
    return this.http.post<Task>(`${this.apiUrl}/inprogress/${taskId}`, {
      user_id: userId,
      board_id: boardId,
    });
  }

  deleteTask(userId: string, taskId: string) {
    return this.http.delete<Task>(`${this.apiUrl}/${userId}/${taskId}`);
  }
  updateTaskStatus(taskId: string, task_status: string) {
    return this.http.put<Task>(
      `${this.apiUrl}/${taskId}/status`,
      { task_status },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
  assignTaskToUser(taskId: string, userId: string | null): Observable<any> {
    return this.http.patch(`${this.apiUrl}/assign/${taskId}/${userId}`, null);
  }
}
