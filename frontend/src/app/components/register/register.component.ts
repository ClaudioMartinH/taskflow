import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  providers: [AuthService],
  standalone: true,
  selector: 'app-register',
  imports: [RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  username: string = '';
  fullname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  selectedFile: File | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile);
    }
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('fullname', this.fullname);
    formData.append('email', this.email);
    formData.append('password', this.password);
    if (this.selectedFile) {
      formData.append('profile_pic', this.selectedFile);
    }

    if (this.rememberMe) {
      const rememberMeCookie = new Date();
      rememberMeCookie.setMinutes(rememberMeCookie.getMinutes() + 30); // 30 minutes
      document.cookie ='rememberMe=true; expires=' + rememberMeCookie.toUTCString();
    }


    this.authService.register(formData).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
      },
    });
  }
  onLogin(): void {
    this.router.navigate(['/login']);
  }
  checkPasswords(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
    }
  }
  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }
}
