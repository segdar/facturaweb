import { InjectionToken } from '@angular/core';
import { environment } from '../../../environment';

export const API_URL = new InjectionToken<string>('api.url', {
  providedIn: 'root',
  factory: () => environment.apiUrl
});
