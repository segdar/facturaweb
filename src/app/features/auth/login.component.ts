import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SessionState } from '../../core/state/session.state';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-icon">🔒</div>
        <h1>FacturaWeb</h1>
        <p class="muted">Ingrese sus credenciales</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="field">
            <span class="field-icon">👤</span>
            <input class="input" type="text" placeholder="usuario" formControlName="username" />
          </div>
          <div class="field">
            <span class="field-icon">🔑</span>
            <input class="input" type="password" placeholder="••••••••" formControlName="password" />
          </div>

          @if (errorMessage()) {
            <p class="error-text">{{ errorMessage() }}</p>
          }

          <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()">
            {{ loading() ? 'INGRESANDO...' : 'INGRESAR' }}
          </button>
        </form>

      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
    }
    .login-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      width: 380px;
      text-align: center;
    }
    .login-icon {
      width: 56px;
      height: 56px;
      margin: 0 auto 12px;
      background: var(--primary);
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .muted { margin-bottom: 24px; }
    .field { position: relative; margin-bottom: 14px; }
    .field-icon { position: absolute; left: 12px; top: 10px; opacity: 0.5; }
    .field .input { padding-left: 36px; }
    .btn-block { width: 100%; padding: 12px; margin-top: 8px; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .forgot { display: inline-block; margin-top: 16px; color: var(--primary); cursor: pointer; font-size: 13px; }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly session = inject(SessionState);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor() {

    if (this.session.isAuthenticated()) {
      this.router.navigate(['/invoices']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.form.getRawValue();

    this.authService.login({
      username: (username ?? '').trim(),
      password: (password ?? '').trim()
    }).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message || 'credenciales invalidas');
      }
    });
  }
}
