import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from '../../core/services/invoice.service';
import { InvoiceListItem } from '../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h2>Ingreso de facturas</h2>
        <p class="muted">lista de facturas registradas en el sistema</p>
      </div>
      <button class="btn btn-primary" (click)="onNew()">+ Nueva factura</button>
    </div>

    @if (errorMessage()) {
      <p class="error-text">{{ errorMessage() }}</p>
    }

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>N° Factura</th>
            <th>Cliente</th>
            <th class="num">Monto</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (invoice of invoices(); track invoice.invoiceNumber) {
            <tr>
              <td>{{ invoice.invoiceDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ invoice.invoiceNumber }}</td>
              <td>{{ invoice.clientName }}</td>
              <td class="num">{{ invoice.totalAmount | currency:'GTQ':'symbol':'1.2-2' }}</td>
              <td>
                <span class="badge" [ngClass]="invoice.status === 'cancelled' ? 'badge-cancelled' : 'badge-saved'">
                  {{ invoice.status === 'cancelled' ? 'anulada' : 'guardada' }}
                </span>
              </td>
              <td class="num">
                <button class="btn-link" (click)="onView(invoice)">ver</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="muted center">no hay facturas registradas</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    h2 { font-size: 22px; }
    .num { text-align: right; }
    .center { text-align: center; padding: 24px; }
  `]
})
export class InvoiceListComponent implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly router = inject(Router);

  readonly invoices = signal<InvoiceListItem[]>([]);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.invoiceService.getList().subscribe({
      next: (items) => this.invoices.set(items),
      error: () => this.errorMessage.set('no se pudo cargar la lista de facturas')
    });
  }

  onNew(): void {
    this.router.navigate(['/invoices/new']);
  }

  onView(invoice: InvoiceListItem): void {
    this.router.navigate(['/invoices', invoice.invoiceNumber], { state: { invoice } });
  }
}
