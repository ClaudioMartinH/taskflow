import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
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

  constructor(private router: Router, private authService: AuthService) { }
  
  onSubmit(): void {
    if (!this.password ||!this.confirmPassword || this.password!== this.confirmPassword) {
      alert('Passwords must match!');
      return;
    }
    this.authService.register(this.username, this.fullname, this.email, this.password).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onLogin(): void {
    this.router.navigate(['/login']);
  }
  checkPasswords(): void { 
    if (this.password!== this.confirmPassword) {
      alert('Passwords do not match!');
    }
  }
  toggleRememberMe(): void {
    this.rememberMe =!this.rememberMe;
  }

}