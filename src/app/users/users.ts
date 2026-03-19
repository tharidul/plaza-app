import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [AsyncPipe],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private apiService = inject(ApiService);

  users$ = this.apiService.getUsers();

}
