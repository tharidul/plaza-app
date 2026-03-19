import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../services/loading';
import { inject } from '@angular/core';
import { delay, tap } from 'rxjs';


export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(

    tap({
      next: () => {
        loadingService.hide();
      },
      error: () => {
        loadingService.hide();
        console.error('Error in HTTP request');
      }
    })

  );
};
