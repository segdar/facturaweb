import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import {
  InvoiceCreateRequest,
  InvoiceCreateResponse,
  InvoiceListItem
} from '../models/invoice.model';
import { API_URL } from '../tokens/app.tokens';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getList(): Observable<InvoiceListItem[]> {
    return this.http
      .get<ApiResponse<InvoiceListItem[]>>(`${this.apiUrl}/api/invoices`)
      .pipe(map((response) => response.data ?? []));
  }

  create(request: InvoiceCreateRequest): Observable<InvoiceCreateResponse> {
    return this.http
      .post<ApiResponse<InvoiceCreateResponse>>(`${this.apiUrl}/api/invoices`, request)
      .pipe(
        map((response) => {
          if (response.status !== 'ok' || !response.data) {
            throw new Error(response.message);
          }
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

  cancel(invoiceNumber: string): Observable<void> {
    return this.http
      .put<ApiResponse<object>>(`${this.apiUrl}/api/invoices/${invoiceNumber}/cancel`, {})
      .pipe(
        map((response) => {
          if (response.status !== 'ok') {
            throw new Error(response.message);
          }
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
}
