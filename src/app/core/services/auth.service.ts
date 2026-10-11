import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { SessionState } from '../state/session.state';
import { API_URL } from '../tokens/app.tokens';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionState);
  private readonly apiUrl = inject(API_URL);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/api/auth/login`, request, {
        withCredentials: true
      })
      .pipe(
        map((response) => {
          if (response.status !== 'ok' || !response.data) {
            throw new Error(response.message);
          }
          this.session.setSession(response.data.accessToken, response.data.name);
          return response.data;
        }),
          catchError((err: unknown) => {
              if (err instanceof HttpErrorResponse) {
                  const message =
                      err.error?.message ??
                      'Error de comunicación con el servidor';

                  return throwError(() => new Error(message));
              }

              return throwError(() => err);
          })
      );
  }

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/api/auth/refresh`, {}, {
        withCredentials: true
      })
      .pipe(
        map((response) => {
          if (response.status !== 'ok' || !response.data) {
            throw new Error(response.message);
          }
          this.session.setSession(response.data.accessToken, response.data.name);
          return response.data;
        }),
          catchError((err: unknown) => {
              if (err instanceof HttpErrorResponse) {
                  const message =
                      err.error?.message ??
                      'Error de comunicación con el servidor';

                  return throwError(() => new Error(message));
              }

              return throwError(() => err);
          })
      );
  }

  logout(): void {
    this.session.clear();
  }
}
