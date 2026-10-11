import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ProductItem } from '../models/catalog.model';
import { API_URL } from '../tokens/app.tokens';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getCatalog(): Observable<ProductItem[]> {
    return this.http
      .get<ApiResponse<ProductItem[]>>(`${this.apiUrl}/api/products`)
      .pipe(map((response) => response.data ?? []));
  }
}
