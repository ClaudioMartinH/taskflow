import { Component, OnInit, NgModule, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/users.service';
import { AuthService } from '../services/auth-service.service';
import { User } from '../models/models';
import { CommonModule } from '@angular/common';
import { TaskServiceService } from '../services/task-service.service';
import { BoardServiceService } from '../services/board-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  username: string = '';
  email: string = '';
  fullname: string = '';
  password: string = '';
  profile_pic: string = '';
  boards: any[] = [];
  pendingTasks: any[] = [];
  completedTasks: any[] = [];
  isEditing: boolean = false;
  activeBoards: string = '';
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private taskService: TaskServiceService,
    private router: Router,
    private boardService: BoardServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data;
          this.getBoards();
          this.getPendingTasks();
          this.getCompletedTasks();
        },
        error: (err) => console.error('Error fetching user:', err),
      });
    } else {
      console.error('User ID no encontrado');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  editProfile(): void {
    if (!this.user?.id) {
      console.error('User ID is missing');
      return;
    }

    const id = this.user.id;
    const username = this.username;
    const fullname = this.fullname;
    const email = this.email;
    const password = this.password || this.user.password;

    this.userService
      .updateUser(id, username, fullname, email, password)
      .subscribe({
        next: () => console.log('Profile updated successfully'),
        error: (err) => console.error('Error updating profile:', err),
      });
  }
  deleteProfile(): void {
    if (!this.user?.id) {
      console.error('User ID is missing');
      return;
    }
    if (confirm('Are you sure you want to delete your profile?')) {
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          console.log('Profile deleted successfully');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => console.error('Error deleting profile:', err),
      });
    }
  }
  getPendingTasks(): void {
    const userId = this.authService.getUserId(); // Obtén el userId del sessionStorage
    if (!userId) {
      console.error('User ID no encontrado');
      return;
    }

    this.taskService.getPendingTasks().subscribe({
      next: (tasks) => {
        // Filtrar las tareas por userId
        this.pendingTasks = tasks.filter(
          (task: any) => task.user_id === userId
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching pending tasks:', err),
    });
  }

  getCompletedTasks(): void {
    const userId = this.authService.getUserId(); // Obtén el userId del sessionStorage
    if (!userId) {
      console.error('User ID no encontrado');
      return;
    }

    this.taskService.getCompletedTasks().subscribe({
      next: (tasks) => {
        // Filtrar las tareas por userId
        this.completedTasks = tasks.filter((task) => task.user_id === userId);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching completed tasks:', err),
    });
  }

  getBoards(): void {
    if (this.user)
      this.boardService.getBoards(this.user.id).subscribe({
        next: (boards) => (this.boards = boards),
        error: (err) => console.error('Error fetching boards:', err),
      });
  }
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;

    // Rellenar los valores iniciales al activar el modo de edición
    if (this.isEditing && this.user) {
      this.fullname = this.user.fullname || '';
      this.username = this.user.username || '';
      this.email = this.user.email || '';
      this.password = ''; // Deja el password vacío para requerir confirmación explícita
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.fullname = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.profile_pic = '';
  }

  updateProfile(): void {
    if (!this.user) return;

    const id = this.user.id;
    const username = this.username;
    const fullname = this.fullname;
    const email = this.email;
    const password = this.password || this.user.password;
    const profile_pic = this.profile_pic;

    this.userService
      .updateUser(id, username, fullname, email, password)
      .subscribe({
        next: () => {
          console.log('Profile updated successfully');
          this.user = {
            ...this.user,
            id,
            username,
            fullname,
            email,
            password,
            profile_pic,
          };
          this.isEditing = false;
        },
        error: (err) => console.error('Error updating profile:', err),
      });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log('file: ', file);

    if (file && this.user?.id) {
      const formData = new FormData();
      formData.append('profilePic', file); // 'profilePic' debe coincidir con el campo en el backend

      this.userService.updateProfilePicture(this.user.id, formData).subscribe({
        next: () => {
          console.log('Profile picture updated successfully');
          this.user!.profile_pic = URL.createObjectURL(file); // Actualiza localmente la imagen
        },
        error: (err) => console.error('Error updating profile picture:', err),
      });
    } else {
      console.error('No file selected or User ID is missing');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
