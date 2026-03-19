import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-todos',
  imports: [AsyncPipe],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  private apiService = inject(ApiService);
  todos$ = this.apiService.getTodos();
}
