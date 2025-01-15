import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskServiceService } from '../services/task-service.service';
import { BoardServiceService } from '../services/board-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models/models';
import { UserService } from '../services/users.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  imports: [FormsModule, CommonModule, DragDropModule],
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  connectedUsers: any[] = [];
  disconnectedUsers: any[] = [];
  showBoardForm: boolean = false;
  token: string = '';
  user: User | null = null;
  tasks: any[] = [];
  boards: any[] = [];
  selectedBoardId: string | null = null; // ID del tablero seleccionado
  newTask = {
    title: '',
    description: '',
    board_id: '',
    task_status: '',
    completed: false,
  };
  newBoard = {
    name: '',
    user_id: '',
  };
  showTaskFormNew: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private taskService: TaskServiceService,
    private boardService: BoardServiceService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {

    this.getUserFromSessionStorage().then((user) => {
      if (!user) {
        console.error('User not found. Redirecting to login...');
        this.router.navigate(['login']);
      } else {
        this.user = user;
        this.loadBoards();
        this.loadTasks();

        this.socketService.onEvent('userConnected', (userConnected: any) => {
          this.connectedUsers.push(userConnected);

          setTimeout(() => {
            this.connectedUsers = this.connectedUsers.filter(
              (u) => u.username !== userConnected.username
            );
          }, 3000);
        });

        this.socketService.onEvent(
          'userDisconnected',
          (disconnectedUsers: any) => {
            this.connectedUsers.push(disconnectedUsers);

            setTimeout(() => {
              this.disconnectedUsers = this.disconnectedUsers.filter(
                (u) => u.username !== disconnectedUsers.username
              );
            }, 3000);
          }
        );

        this.socketService.onEvent('taskUpdated', (updatedTask: any) => {
          this.updateTaskLocally(updatedTask.id, updatedTask);
        });
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log('Previous container:', event.previousContainer);
    console.log('Current container:', event.container);
    console.log('Previous index:', event.previousIndex);
    console.log('Current index:', event.currentIndex);

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      console.log('Updated task:', task);

      // Asignamos el nuevo estado basado en el contenedor
      task.task_status = this.getStatusFromColumn(event.container.id);

      // Actualizamos el estado de la tarea en el servidor y localmente
      this.updateTaskStatus(task.id, task.task_status);
    }
  }

  updateTaskStatus(taskId: string, task_status: string) {
    const userId = this.user?.id || '';
    const boardId = this.selectedBoardId;

    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }

    // Realiza la actualización del estado de la tarea en el servidor
    if (task_status === 'IN_PROGRESS') {
      this.taskService.toggleInProgressTask(taskId, userId, boardId).subscribe({
        next: (data) => {
          console.log('Task status updated:', data);
          // Actualiza la tarea localmente después de la respuesta
          this.updateTaskLocally(taskId, data);
        },
        error: (err) => console.error('Error updating task status:', err),
      });
    } else if (task_status === 'ASSIGNED') {
      this.taskService.toggleAssignedTask(taskId, userId, boardId).subscribe({
        next: (data) => {
          console.log('Task assigned:', data);
          // Actualiza la tarea localmente después de la respuesta
          this.updateTaskLocally(taskId, data);
        },
        error: (err) => console.error('Error updating task status:', err),
      });
    } else if (task_status === 'COMPLETED') {
      this.taskService.toggleCompletedTask(taskId, userId, boardId).subscribe({
        next: (data) => {
          console.log('Task completed:', data);
          // Actualiza la tarea localmente después de la respuesta
          this.updateTaskLocally(taskId, data);
        },
        error: (err) => console.error('Error updating task status:', err),
      });
  }
  }

  // Método para actualizar la tarea en la lista local después de la respuesta del servidor
  updateTaskLocally(taskId: string, updatedTaskData: any) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = updatedTaskData;
      console.log('Task updated locally:', updatedTaskData);
    } else {
      console.error('Task not found in the local list.');
    }
  }

  getTasksByStatus(status: string): any[] {
    return this.tasks.filter((task) => task.task_status === status);
  }
  // Obtén el usuario desde el sessionStorage
  getUserFromSessionStorage(): Promise<User | null> {
    const userId = sessionStorage.getItem('userId');

    if (userId) {
      return new Promise((resolve) => {
        this.userService.getUserById(userId).subscribe({
          next: (user) => {
            const userData: User = {
              id: user.id,
              username: user.username,
              fullname: user.fullname || '',
              email: user.email || '',
              password: '',
              profile_pic: '',
            };
            resolve(userData);
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('fullname', user.fullname);
          },
          error: () => resolve(null),
        });
      });
    }
    return Promise.resolve(null);
  }

  // Carga las tareas desde el servicio
  loadTasks(): void {
    const boardId = this.selectedBoardId;
    if (this.user && boardId) {
      this.taskService.getTasksByUserAndBoard(this.user.id, boardId).subscribe({
        next: (tasks) => {
          this.tasks = tasks; // Asigna las tareas al array tasks
          console.log('Tareas cargadas:', this.tasks);
        },
        error: (err) => console.error('Error al cargar tareas:', err),
      });
    }
  }

  // Carga los tableros del usuario
  loadBoards(): void {
    if (this.user) {
      this.boardService.getBoards(this.user.id).subscribe({
        next: (data) => {
          this.boards = data;
        if (this.boards.length > 0) {
            const savedBoardId = sessionStorage.getItem('boardId');
            this.selectedBoardId = savedBoardId || this.boards[0].id; // Selecciona el primer tablero si no hay uno guardado
            sessionStorage.setItem('boardId', this.selectedBoardId || '');
            this.loadTasks(); // Carga las tareas del tablero seleccionado
          } else {
            console.warn('No boards found for this user.');
          }
        },
        error: (err) => console.error('Error loading boards:', err),
      });
    }
  }

  // Maneja la selección del board
    selectBoard(event: Event): void {
      const boardId = (event.target as HTMLSelectElement).value;
      this.selectedBoardId = boardId;
      sessionStorage.setItem('boardId', boardId);
      this.loadTasks(); // Recarga las tareas del board seleccionado
  // Agrega una nueva tarea al board seleccionado
    }

  addTask(): void {
    const userId = sessionStorage.getItem('userId');
    const boardId = this.selectedBoardId;

    if (!userId || !boardId || userId === undefined) {
      alert('No user id found');
      console.error('User ID or Board ID not found.');
      return;
    }

    console.log('Adding task to board:', boardId); // Depuración

    this.newTask.board_id = boardId; // Asignar el ID del tablero seleccionado
    this.newTask.task_status = 'NEW';

    if (this.newTask.title && this.newTask.description) {
    this.taskService
        .addTask(
        this.newTask.title,
        this.newTask.description,
          userId,
          boardId,
        this.newTask.task_status
      )
        .subscribe({
          next: () => {
            this.tasks.push(this.newTask);
            this.loadTasks(); // Recarga las tareas del tablero actual
        this.newTask = {
          title: '',
          description: '',
          board_id: '',
              task_status: '',
          completed: false,
        };
        this.showTaskFormNew = false;
          },
          error: (err) => console.error('Error adding task:', err),
      });

    }
  }

  createBoard(): void {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        if (this.newBoard.name && user) {
          this.boardService.createBoard(this.newBoard.name, user).subscribe({
            next: (board) => {
              this.boards.push(board); // Agrega el nuevo tablero al array boards
              this.newBoard = {
                name: '',
                user_id: '',
              };
        this.showBoardForm = false;
              console.log('Tablero creado:', board);
            },
            error: (err) => console.error('Error creating board:', err),
          });
        }
      },
      error: (err) => console.error('Error fetching user:', err),
      });
  }

  toggleBoardForm() {
    this.showBoardForm = !this.showBoardForm;
  }

  checkToken(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.token = token;
    } else {
      console.error('Token not found. Redirecting to login...');
      this.router.navigate(['login']);
    }
  }

  toggleCompletedTask(taskId: string): void {
    const userId = this.user?.id || ''; // Asegúrate de que el usuario esté definido
    const boardId = this.selectedBoardId;

    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }

    this.taskService.toggleCompletedTask(taskId, userId, boardId).subscribe({
      next: (updatedTask) => {
        // Actualiza la tarea en el array de tareas
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
          console.log('Task updated successfully:', updatedTask);
        }
      },
      error: (err) => console.error('Error updating task status:', err),
    });
    this.loadTasks();
  }

  toggleInProgressTask(taskId: string): void {
    const userId = this.user?.id || ''; // Asegúrate de que el usuario esté definido
    const boardId = this.selectedBoardId;
    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }
    this.taskService.toggleInProgressTask(taskId, userId, boardId).subscribe({
      next: (updatedTask) => {
        // Actualiza la tarea en el array de tareas
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
          console.log('Task updated successfully:', updatedTask);
        }
      },
      error: (err) => console.error('Error updating task status:', err),
    });
    this.loadTasks();
  }
  toggleAssignedTask(taskId: string): void {
    const userId = this.user?.id || ''; // Asegúrate de que el usuario esté definido
    const boardId = this.selectedBoardId;
    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }
    this.taskService.toggleAssignedTask(taskId, userId, boardId).subscribe({
      next: (updatedTask) => {
        // Actualiza la tarea en el array de tareas
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
          console.log('Task updated successfully:', updatedTask);
        }
      },
      error: (err) => console.error('Error updating task status:', err),
    });
    this.loadTasks();
  }

  getStatusFromColumn(columnId: string): string {
    switch (columnId) {
      case 'new':
        return 'NEW';
      case 'assigned':
        return 'ASSIGNED';
      case 'inProgress':
        return 'IN_PROGRESS';
      case 'completed':
        return 'COMPLETED';
      default:
        return '';
    }
  }

  deleteTask(userId: string, taskId: string): void {
    this.taskService.deleteTask(userId, taskId).subscribe({
      next: (deletedTask) => {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = deletedTask;
          console.log('Task deleted successfully:', deletedTask);
        }
      },
      error: (err) => console.error('Error while deleting task:', err),
    });
    this.loadTasks();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
