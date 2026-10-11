import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './features/layout/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'invoices' },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./features/invoices/invoice-list.component').then((m) => m.InvoiceListComponent)
      },
      {
        path: 'invoices/new',
        loadComponent: () =>
          import('./features/invoices/invoice-form.component').then((m) => m.InvoiceFormComponent)
      },
      {
        path: 'invoices/:invoiceNumber',
        loadComponent: () =>
          import('./features/invoices/invoice-form.component').then((m) => m.InvoiceFormComponent)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/report-list.component').then((m) => m.ReportListComponent)
      },
      {
        path: 'maintenance',
        loadComponent: () =>
          import('./features/maintenance/maintenance.component').then((m) => m.MaintenanceComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
