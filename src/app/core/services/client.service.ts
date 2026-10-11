import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ClientItem } from '../models/catalog.model';
import { API_URL } from '../tokens/app.tokens';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getCatalog(): Observable<ClientItem[]> {
    return this.http
      .get<ApiResponse<ClientItem[]>>(`${this.apiUrl}/api/clients`)
      .pipe(map((response) => response.data ?? []));
  }
}
