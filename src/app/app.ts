import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Users } from './users/users';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Users],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('plaza-app');
}
