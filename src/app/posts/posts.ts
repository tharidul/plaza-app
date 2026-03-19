import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-posts',
  imports: [AsyncPipe],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
})
export class Posts {
  private apiService = inject(ApiService);
  posts$ = this.apiService.getPosts();
}
