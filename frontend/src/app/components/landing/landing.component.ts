import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  fullText: string = `<h5>Streamline Your Productivity with Taskflow.</h5> The ultimate tool for managing tasks in real - time. Whether you're working solo or collaborating with a team, Taskflow makes it easy to create, organize, and track your tasks seamlessly.<h5>Real-Time Syncing:</h5>Stay in sync with your team, no matter where you are. Task updates, edits, and deletions happen in real-time across all devices.<h5>Drag & Drop Simplicity:</h5>Organize your tasks intuitively with drag-and-drop functionality <h5>Collaboration Ready:</h5>Share tasks and collaborate effortlessly with your team. Get started today and take control of your tasks with Taskflow—where productivity meets simplicity.`;

  displayedText: string = '';
  typingSpeed: number = 20; // Velocidad de escritura en milisegundos

  constructor() {}

  ngOnInit(): void {
    this.typeWriterEffect();
  }

  typeWriterEffect(): void {
    let index = 0;
    const textLength = this.fullText.length;

    const typingInterval = setInterval(() => {
      if (index < textLength) {
        this.displayedText += this.fullText.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval); // Detener la animación una vez que se haya escrito todo
      }
    }, this.typingSpeed);
  }
}