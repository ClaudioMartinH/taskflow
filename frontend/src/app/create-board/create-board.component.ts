import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../models/models';
import { BoardServiceService } from '../services/board-service.service';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-create-board',
  imports: [RouterModule, FormsModule],
  templateUrl: './create-board.component.html',
  styleUrl: './create-board.component.scss',
})
export class CreateBoardComponent {
  name: string = '';
  user: User = {
    id: '',
    username: '',
    fullname: '',
    email: '',
    password: '',
    profile_pic: '',
  };

  constructor(
    private router: Router,
    private boardService: BoardServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUserFromSessionStorage().then((user) => {
      if (!user) {
        console.error('User not found. Redirecting to login...');
        this.router.navigate(['login']);
      } else {
        this.user = user;
      }
    });
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
              profile_pic: '',
            };
            resolve(userData);
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('fullname', user.fullname);
            this.user = userData;
          },
          error: () => resolve(null),
        });
      });
    }
    return Promise.resolve(null);
  }

  onSubmit(): void {
    if (!this.name) {
      alert('Please enter a board name');
      return;
    }

    this.boardService.createBoard(this.name, this.user).subscribe((board) => {
      this.router.navigate(['home']);
    });
  }

  onMain(): void {
    this.router.navigate(['home']);
  }
}
