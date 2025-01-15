import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
  private apiUrl = 'http://localhost:5050/api/v1/tasks';

  constructor(private http: HttpClient) { }

  // Obtiene todas las tareas del servidor
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Obtiene las tareas completadas
  getCompletedTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        map((tasks) => tasks.filter((task) => task.task_status === 'COMPLETED'))
      );
  }

  // Obtiene las tareas pendientes
  getPendingTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        map((tasks) => tasks.filter((task) => task.task_status !== 'COMPLETED'))
      );
  }

  // Obtener una tarea por su ID
  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  // Obtiene tareas por usuario y tablero
  getTasksByUserAndBoard(userId: string, boardId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/board/${boardId}`);
  }

  // Añade una nueva tarea
  addTask(title: string, description: string, userId: string, boardId: string, task_status: string) {
    return this.http.post<Task>(this.apiUrl, {
      title,
      description,
      user_id: userId,
      board_id: boardId,
      task_status
    });
  }

  toggleCompletedTask(taskId: string, userId: string, boardId: string) {
    return this.http.post<Task>(`${this.apiUrl}/complete/${taskId}`, {
      user_id: userId,
      board_id: boardId
    });
  }

  toggleAssignedTask(taskId: string, userId: string, boardId: string) {
    return this.http.post<Task>(`${this.apiUrl}/assign/${taskId}`, {
      user_id: userId,
      board_id: boardId
    });
  }
  toggleInProgressTask(taskId: string, userId: string, boardId: string) {
    return this.http.post<Task>(`${this.apiUrl}/inprogress/${taskId}`, {
      user_id: userId,
      board_id: boardId
    });
  }

  deleteTask(userId: string, taskId: string) {
    return this.http.delete<Task>(`${this.apiUrl}/${userId}/${taskId}`)
  }
  updateTaskStatus(taskId: string, task_status: string) {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/status`, { task_status }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    })
  }
}
