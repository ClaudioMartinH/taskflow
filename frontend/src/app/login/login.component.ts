import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  providers: [AuthService],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterModule, FormsModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('Login exitoso');
        this.router.navigate(['home']); // Redirige al perfil
      },
      error: (err) => {
        console.error('Error de login:', err);
        alert('Usuario o contraseña incorrectos.');
      },
    });
  }
  onRegister(): void {
    this.router.navigate(['register']); // Redirige a la página de registro
  }
  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }
}
