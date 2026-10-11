import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SessionState } from '../../core/state/session.state';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand-icon">🧾</span>
          <span class="brand-name">FacturaWeb</span>
        </div>

        <nav class="menu">
          <a routerLink="/invoices" routerLinkActive="active" class="menu-item">
            <span class="menu-icon">📝</span> Ingreso
          </a>
          <a routerLink="/reports" routerLinkActive="active" class="menu-item">
            <span class="menu-icon">📊</span> Reportes
          </a>
          <a routerLink="/maintenance" routerLinkActive="active" class="menu-item">
            <span class="menu-icon">🛠️</span> Mantenimientos
          </a>
          <button type="button" class="menu-item" (click)="onLogout()">
            <span class="menu-icon">🚪</span> Salida
          </button>
        </nav>

        <div class="sidebar-user">
          <span class="avatar">👤</span>
          <span>{{ session.userName() ?? 'usuario' }}</span>
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <span class="muted">sistema de facturación</span>
          <div class="topbar-user">
            <span class="avatar-circle">{{ (session.userName() ?? 'a')[0] | uppercase }}</span>
          </div>
        </header>
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }
    .sidebar {
      width: 230px;
      background: var(--card);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 16px 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 17px;
      padding: 8px 10px 20px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;
    }
    .brand-icon {
      background: var(--primary);
      border-radius: 8px;
      padding: 4px 6px;
    }
    .menu { display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 11px 14px;
      border-radius: 8px;
      color: var(--text);
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      width: 100%;
    }
    .menu-item:hover { background: #f1f5f9; }
    .menu-item.active { background: var(--primary); color: #fff; }
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 10px;
      border-top: 1px solid var(--border);
      color: var(--muted);
    }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar {
      height: 56px;
      background: var(--card);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
    }
    .avatar-circle {
      width: 34px;
      height: 34px;
      background: var(--primary);
      color: #fff;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .content { padding: 24px; }
  `]
})
export class ShellComponent {
  protected readonly authService = inject(AuthService);
  protected readonly session = inject(SessionState);
  private readonly router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
