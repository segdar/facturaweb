import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SessionState } from '../state/session.state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionState);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthEndpoint = req.url.includes('/api/auth/');
  const token = session.token();

  if (!isAuthEndpoint && token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 && !isAuthEndpoint) {
        return authService.refresh().pipe(
          switchMap((response) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${response.accessToken}` } }))
          ),
          catchError((refreshError) => {
            session.clear();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};


