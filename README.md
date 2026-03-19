# Plaza App

> A complete Angular learning project built with industry-standard architecture — components, services, DTOs, interceptors, and reactive state, all wired to a real REST API.

---

## What This Project Teaches

This is not just a demo app. Every file in this project exists to teach a specific concept. By the time you understand all of it, you understand how real Angular applications are structured.

```
JSONPlaceholder API
        |
        v
   Interceptor          <- middleware: runs on every HTTP request
        |
        v
    Service             <- business logic: all HTTP calls live here
        |
   BehaviourSubject     <- reactive state: loading indicator
        |
        v
      DTO               <- TypeScript interfaces: define data shapes
        |
        v
   Component            <- UI: what the user actually sees
```

---

## The Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Angular 19 | Industry standard, opinionated, scalable |
| Language | TypeScript | Type safety catches bugs before runtime |
| Styles | SCSS | Variables, nesting, no vanilla CSS limitations |
| HTTP | Angular HttpClient | Built-in, works with RxJS out of the box |
| Reactive | RxJS | Observable streams for async data |
| API | JSONPlaceholder | Free fake REST API, no auth needed |

---

## Project Structure

```
src/
  app/
    models/                   <- DTOs: data shape definitions
      post.model.ts
      user.model.ts
      todo.model.ts
    services/                 <- Business logic layer
      api.ts                  <- all HTTP calls
      loading.ts              <- global loading state
    interceptors/             <- HTTP middleware
      loading-interceptor.ts
    users/                    <- Feature component
    posts/                    <- Feature component
    todos/                    <- Feature component
    app.ts                    <- Root component
    app.routes.ts             <- Route definitions
    app.config.ts             <- App-wide providers
```

Every folder has a single responsibility. You should be able to open any folder and know exactly what lives inside without reading a single line of code.

---

## Concept 1 — DTO (Data Transfer Object)

A DTO is a TypeScript interface that describes the exact shape of data coming from an API.

**Why not just use `any`?**

```typescript
// bad — TypeScript can't help you
const post: any = await getPosts();
post.titel; // typo — no error, silent bug

// good — TypeScript catches mistakes immediately
const post: Post = await getPosts();
post.titel; // Error: Property 'titel' does not exist on type 'Post'
```

The interface is a contract. Break it and TypeScript tells you immediately.

```typescript
// src/app/models/post.model.ts
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
```

**Rule:** Only map fields your app actually uses. Unused fields are noise.

---

## Concept 2 — Service

A service is an injectable singleton that centralises your business logic.

**Why not fetch inside components?**

Imagine three components all fetching posts. If the API URL changes, you fix it in three places. With a service, you fix it in one.

```typescript
// src/app/services/api.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
  private http = inject(HttpClient);

  getPosts() {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`);
  }
}
```

`providedIn: 'root'` creates one instance shared across the entire app. That is the singleton pattern.

---

## Concept 3 — BehaviourSubject

A BehaviourSubject is a reactive value — it holds a current state and notifies every subscriber instantly when that state changes.

```
LoadingService holds:  false → true → false

UsersComponent         watching...  sees: false, true, false
PostsComponent         watching...  sees: false, true, false
AppComponent           watching...  sees: false, true, false
```

One update. Every watcher notified. No manual passing of values between components.

```typescript
// src/app/services/loading.ts
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() { this.loadingSubject.next(true); }
  hide() { this.loadingSubject.next(false); }
}
```

The `$` suffix on `loading$` is a convention — it means "this is an Observable". You will see this across every Angular codebase.

---

## Concept 4 — Interceptor

An interceptor is middleware that runs automatically on every HTTP request and response. Components never know it exists.

```
request leaves app
      |
      v
  Interceptor          <- calls LoadingService.show()
      |
      v
  JSONPlaceholder
      |
      v
  Interceptor          <- calls LoadingService.hide()
      |
      v
response reaches component
```

```typescript
// src/app/interceptors/loading-interceptor.ts
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    tap({
      next: () => loadingService.hide(),
      error: () => loadingService.hide()
    })
  );
};
```

Write it once. Works for every HTTP call in the entire app forever.

---

## Concept 5 — Component

A component is three files working as one unit.

```
users.ts      the brain   — logic, data, injections
users.html    the face    — what the user sees
users.scss    the clothes — how it looks, scoped to this component only
```

Angular 19 uses the `@for` control flow syntax:

```typescript
// users.ts
export class Users {
  private apiService = inject(ApiService);
  users$ = this.apiService.getUsers();
}
```

```html
<!-- users.html -->
@for (user of users$ | async; track user.id) {
  <li>{{ user.name }}</li>
}
```

The `async` pipe subscribes to the Observable, unwraps the data, and automatically unsubscribes when the component is destroyed. No memory leaks.

---

## Concept 6 — Routing

Each feature lives at its own URL. The router swaps components without refreshing the page — that is what makes this a Single Page Application.

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'users', component: Users },
  { path: 'posts', component: Posts },
  { path: 'todos', component: Todos },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];
```

`routerLink` vs `href` — `href` triggers a full page reload and destroys all app state. `routerLink` navigates internally, instantly, with no reload.

---

## Naming Conventions

Angular projects follow strict naming rules. Deviating from them makes your code unreadable to other Angular developers.

| Type | Convention | Example |
|---|---|---|
| Files | kebab-case | `user-profile.ts` |
| Classes | PascalCase | `UserProfileComponent` |
| Selectors | kebab-case with prefix | `app-user-profile` |
| Methods | camelCase, verb first | `getUsers()`, `loadPosts()` |
| Observables | camelCase with $ suffix | `users$`, `loading$` |
| Interfaces | PascalCase, singular | `Post`, `User`, `Todo` |

---

## Key Principles Applied

**Single Responsibility** — every class does exactly one thing. `ApiService` handles HTTP. `LoadingService` handles loading state. Never both in one class.

**DRY (Don't Repeat Yourself)** — logic lives in one place. If you find yourself writing the same code twice, it belongs in a service.

**YAGNI (You Ain't Gonna Need It)** — only map API fields your app uses. Only add features your app needs now.

**Separation of Concerns** — logic in `.ts`, structure in `.html`, styles in `.scss`. Never mix them.

---

## Running the Project

```bash
# install dependencies
npm install

# start development server
ng serve

# open in browser
http://localhost:4200
```

---

## API Reference

All data comes from [JSONPlaceholder](https://jsonplaceholder.typicode.com) — a free fake REST API.

| Endpoint | Records | Used in |
|---|---|---|
| `/users` | 10 | UsersComponent |
| `/posts` | 100 | PostsComponent |
| `/todos` | 200 | TodosComponent |

---

*Built as a learning project. Every architectural decision in this codebase is intentional and follows Angular industry standards.*