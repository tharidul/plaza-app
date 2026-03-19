import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Posts } from './posts/posts';
import { Todos } from './todos/todos';

export const routes: Routes = [
    {path:'users',component:Users},
    {path:'posts',component:Posts},
    {path:'todos',component:Todos},
    {path:'',redirectTo:'users',pathMatch:'full'},
];
