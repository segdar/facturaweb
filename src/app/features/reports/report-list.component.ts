import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../core/services/invoice.service';
import { InvoiceListItem } from '../../core/models/invoice.model';

@Component({
  selector: 'app-report-list',
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h2>Reportes</h2>
        <p class="muted">facturas ingresadas con su valor y estado</p>
      </div>
    </div>

    <div class="summary">
      <div class="card summary-card">
        <span class="muted">total facturado</span>
        <strong>{{ totalAmount() | currency:'GTQ':'symbol':'1.2-2' }}</strong>
      </div>
      <div class="card summary-card">
        <span class="muted">facturas guardadas</span>
        <strong>{{ savedCount() }}</strong>
      </div>
      <div class="card summary-card">
        <span class="muted">facturas anuladas</span>
        <strong>{{ cancelledCount() }}</strong>
      </div>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>N° Factura</th>
            <th>Cliente</th>
            <th class="num">Monto</th>
            <th>Estado</th>
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
            </tr>
          } @empty {
            <tr><td colspan="5" class="muted center">no hay facturas registradas</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    h2 { font-size: 22px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .summary-card { display: flex; flex-direction: column; gap: 6px; }
    .summary-card strong { font-size: 22px; }
    .num { text-align: right; }
    .center { text-align: center; padding: 24px; }
  `]
})
export class ReportListComponent implements OnInit {
  private readonly invoiceService = inject(InvoiceService);

  readonly invoices = signal<InvoiceListItem[]>([]);

  readonly totalAmount = computed(() =>
    this.invoices().reduce((sum, x) => sum + x.totalAmount, 0)
  );
  readonly savedCount = computed(() =>
    this.invoices().filter((x) => x.status !== 'cancelled').length
  );
  readonly cancelledCount = computed(() =>
    this.invoices().filter((x) => x.status === 'cancelled').length
  );

  ngOnInit(): void {
    this.invoiceService.getList().subscribe({
      next: (items) => this.invoices.set(items)
    });
  }
}
