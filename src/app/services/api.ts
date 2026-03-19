import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Todo } from '../models/todo.model';


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private http = inject(HttpClient);

  getPosts() {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`);
  }

  getUsers() {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getTodos() {
    return this.http.get<Todo[]>(`${this.baseUrl}/todos`);
  }

}
