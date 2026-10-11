import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionState {
  private readonly tokenKey = 'accessToken';
  private readonly nameKey = 'userName';

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));
  private readonly nameSignal = signal<string | null>(localStorage.getItem(this.nameKey));

  readonly token = this.tokenSignal.asReadonly();
  readonly userName = this.nameSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  setSession(accessToken: string, userName: string): void {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.nameKey, userName);
    this.tokenSignal.set(accessToken);
    this.nameSignal.set(userName);
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.nameKey);
    this.tokenSignal.set(null);
    this.nameSignal.set(null);
  }
}
