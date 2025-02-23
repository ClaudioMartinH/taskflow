import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';
import { BoardServiceService } from '../../services/board-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/models';
import { UserService } from '../../services/users.service';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
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
  dropdownOpen = false;
  selectedUser: string = '';
  selectedUserId: string | null = null;
  connectedUsers: any[] = [];
  disconnectedUsers: any[] = [];
  showBoardForm: boolean = false;
  token: string = '';
  users: User[] | null = [];
  user: User | null = null;
  tasks: any[] = [];
  boards: any[] = [];
  selectedBoardId: string | null = null;
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
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserFromSessionStorage().then((user) => {
      if (!user) {
        console.error('User not found. Redirecting to login...');
        this.router.navigate(['login']);
      } else {
        this.user = user;
        console.log('🔍 Profile Picture URL:', this.user?.profile_pic);

        this.loadBoards();
        this.loadTasks();
        this.loadUsers();

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
      if (event.container.id === 'new') {
        task.assigned_user_id = null;
        task.assigned_username = 'Unassigned';
        this.taskService.assignTaskToUser(task.id, null).subscribe({
          next: (updatedTask) => {},
          error: (err) => console.error('Error unassigning task:', err),
        });
      }
      task.task_status = this.getStatusFromColumn(event.container.id);
      this.updateTaskStatus(task.id, task.task_status);
    }
  }

  trackByTaskId(index: number, task: any): string {
    return task.id;
  }

  updateTaskStatus(taskId: string, task_status: string) {
    const userId = this.user?.id || '';
    const boardId = this.selectedBoardId;

    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }

    if (task_status === 'IN_PROGRESS') {
      this.taskService.toggleInProgressTask(taskId, userId, boardId).subscribe({
        next: (data) => {
          this.updateTaskLocally(taskId, data);
        },
        error: (err) => console.error('Error updating task status:', err),
      });
    } else if (task_status === 'ASSIGNED') {
      this.taskService.toggleAssignedTask(taskId, userId, boardId).subscribe({
        next: (data) => {
          this.updateTaskLocally(taskId, data);
        },
        error: (err) => console.error('Error updating task status:', err),
      });
    } else if (task_status === 'COMPLETED') {
      this.taskService.toggleCompletedTask(taskId, userId, boardId).subscribe({
        next: (data) => {
          this.updateTaskLocally(taskId, data);
        },
        error: (err) => console.error('Error updating task status:', err),
      });
    }
  }

  updateTaskLocally(taskId: string, updatedTaskData: any) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex], // 🔥 Mantén los datos previos
        ...updatedTaskData, // 🔥 Aplica los cambios del backend
        assigned_username: this.getUsernameById(
          updatedTaskData.assigned_user_id
        ),
      };
      this.cdr.detectChanges(); // 🔥 Forzamos Angular a detectar el cambio
    } else {
      console.error('Task not found in the local list.');
    }
  }

  getTasksByStatus(status: string): any[] {
    return this.tasks.filter((task) => task.task_status === status);
  }
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
              profile_pic: user.profile_pic || '/img/default2.jpg', // 👈 Asigna la imagen correctamente
            };
            resolve(userData);

            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('fullname', user.fullname);
            sessionStorage.setItem('profilePic', userData.profile_pic); // 👈 Guarda la imagen en sessionStorage también
          },
          error: () => resolve(null),
        });
      });
    }
    return Promise.resolve(null);
  }

  loadTasks(): void {
    const boardId = this.selectedBoardId;
    if (this.user && boardId) {
      this.taskService.getTasksByUserAndBoard(this.user.id, boardId).subscribe({
        next: (tasks) => {
          if (!this.users || this.users.length === 0) {
            this.loadUsers();
          }
          this.tasks = tasks.map((task) => {
            const assignedUser = this.users?.find(
              (user) => user.id === task.assigned_user_id
            );
            return {
              ...task,
              assigned_username: assignedUser
                ? assignedUser.username
                : 'Unassigned',
            };
          });
        },
        error: (err) => console.error('Error al cargar tareas:', err),
      });
    }
  }

  loadBoards(): void {
    if (this.user) {
      this.boardService.getBoards(this.user.id).subscribe({
        next: (data) => {
          this.boards = data;
          if (this.boards.length > 0) {
            const savedBoardId = sessionStorage.getItem('boardId');
            this.selectedBoardId = savedBoardId || this.boards[0].id;
            sessionStorage.setItem('boardId', this.selectedBoardId || '');
            this.loadTasks();
          } else {
            console.warn('No boards found for this user.');
          }
        },
        error: (err) => console.error('Error loading boards:', err),
      });
    }
  }

  selectBoard(event: Event): void {
    const boardId = (event.target as HTMLSelectElement).value;
    this.selectedBoardId = boardId;
    sessionStorage.setItem('boardId', boardId);
    this.loadTasks();
  }

  addTask(): void {
    const userId = sessionStorage.getItem('userId');
    const boardId = this.selectedBoardId;

    if (!userId || !boardId || userId === undefined) {
      alert('No user id found');
      console.error('User ID or Board ID not found.');
      return;
    }
    this.newTask.board_id = boardId;
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
            this.loadTasks();
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
              this.boards.push(board);
              this.newBoard = {
                name: '',
                user_id: '',
              };
              this.showBoardForm = false;
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
    const userId = this.user?.id || '';
    const boardId = this.selectedBoardId;

    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }

    this.taskService.toggleCompletedTask(taskId, userId, boardId).subscribe({
      next: () => {
        console.log('✅ Task moved to COMPLETED.');
        this.loadTasks(); // Recargar tareas en el frontend
      },
      error: (err) => console.error('❌ Error updating task status:', err),
    });
  }

  toggleInProgressTask(taskId: string): void {
    const userId = this.user?.id || '';
    const boardId = this.selectedBoardId;
    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }
    this.taskService.toggleInProgressTask(taskId, userId, boardId).subscribe({
      next: (updatedTask) => {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
          this.tasks = [...this.tasks];
        }
        // this.loadTasks();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error updating task status:', err),
    });
  }
  toggleAssignedTask(taskId: string): void {
    const userId = this.user?.id || '';
    const boardId = this.selectedBoardId;
    if (!userId || !boardId) {
      console.error('User ID or Board ID not found.');
      return;
    }
    this.taskService.toggleAssignedTask(taskId, userId, boardId).subscribe({
      next: (updatedTask) => {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
          this.tasks = [...this.tasks];
        }
        // this.loadTasks();
        this.cdr.detectChanges(); // 🔥 Forzamos Angular a detectar el cambio
      },
      error: (err) => console.error('Error updating task status:', err),
    });
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
        }
        this.loadTasks();
      },
      error: (err) => console.error('Error while deleting task:', err),
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((user: { profile_pic: any }) => ({
          ...user,
          profile_pic: user.profile_pic || '/img/default2.jpg', // Si no tiene foto, usa una por defecto
        }));
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  assignTaskToUser(taskId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const userId = target?.value || null;

    if (userId === 'null') {
      console.warn('Invalid userId detected, resetting to null.');
      return;
    }

    this.taskService.assignTaskToUser(taskId, userId).subscribe({
      next: (updatedTask) => {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          const assignedUser = this.users?.find((user) => user.id === userId);

          this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            assigned_user_id: updatedTask.assigned_user_id ?? null,
            assigned_username: assignedUser
              ? assignedUser.username
              : 'Unassigned',
            assigned_profile_pic: assignedUser
              ? assignedUser.profile_pic
              : '/img/default2.jpg', // ✅ Agregamos la foto
          };

          this.loadTasks();
        }
      },
      error: (err) => console.error('Error assigning task:', err),
    });
  }

  getUsernameById(userId: string): string {
    const user = this.users?.find((u) => u.id === userId);
    return user ? user.username : 'Unassigned';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
