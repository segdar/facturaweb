import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../core/services/invoice.service';
import { ClientService } from '../../core/services/client.service';
import { ProductService } from '../../core/services/product.service';
import { InvoiceListItem } from '../../core/models/invoice.model';
import { ClientItem, ProductItem } from '../../core/models/catalog.model';

@Component({
  selector: 'app-invoice-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <div>
        <button class="btn-link back" (click)="onBack()">← volver al listado</button>
        <h2>{{ isEditMode() ? 'Factura ' + currentInvoice()?.invoiceNumber : 'Nueva factura' }}</h2>
      </div>
      
    </div>


    @if (isEditMode()) {
      @if (currentInvoice(); as invoice) {
        <div class="card">
          <div class="grid">
            <div><span class="label">Cliente</span><p>{{ invoice.clientName }}</p></div>
            <div><span class="label">N° Factura</span><p>{{ invoice.invoiceNumber }}</p></div>
            <div><span class="label">Fecha</span><p>{{ invoice.invoiceDate | date:'dd/MM/yyyy' }}</p></div>
            <div>
              <span class="label">Estado</span>
              <span class="badge" [ngClass]="invoice.status === 'cancelled' ? 'badge-cancelled' : 'badge-saved'">
                {{ invoice.status === 'cancelled' ? 'anulada' : 'guardada' }}
              </span>
            </div>
          </div>

          <div class="total-row">
            <span>Total</span>
            <strong>{{ invoice.totalAmount | currency:'GTQ':'symbol':'1.2-2' }}</strong>
          </div>

          @if (message()) {
            <p class="error-text">{{ message() }}</p>
          }

          <div class="actions">
            @if (invoice.status !== 'cancelled') {
              <button class="btn btn-danger-outline" (click)="onCancel()" [disabled]="loading()">
                Anular factura
              </button>
            }
          </div>
        </div>
      }
    } @else {

      <form [formGroup]="form" (ngSubmit)="onSave()" novalidate>
        <div class="card grid">
          <div>
            <label class="label" for="clientId">Cliente</label>
            <select id="clientId" class="input" formControlName="clientId">
              <option value="" disabled>seleccione un cliente</option>
              @for (client of clients(); track client.clientId) {
                <option [value]="client.clientId">{{ client.fullName }}</option>
              }
            </select>
          </div>
          <div>
            <label class="label" for="invoiceNumber">N° Factura</label>
            <input id="invoiceNumber" class="input" type="text" formControlName="invoiceNumber" placeholder="001-0042" />
          </div>
          <div>
            <label class="label" for="invoiceDate">Fecha</label>
            <input id="invoiceDate" class="input" type="date" formControlName="invoiceDate" />
          </div>
        </div>

        <div class="card detail-card">
          <div class="detail-header">
            <h3>Detalle de productos</h3>
            <button type="button" class="btn-link" (click)="addDetail()">+ Agregar producto</button>
          </div>

          <table class="table" formArrayName="details">
            <thead>
              <tr>
                <th style="width:45%">Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th class="num">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (detail of details.controls; track $index) {
                <tr [formGroupName]="$index">
                  <td>
                    <select class="input" formControlName="productId">
                      <option value="" disabled>seleccione</option>
                      @for (product of products(); track product.productId) {
                        <option [value]="product.productId">{{ product.description }}</option>
                      }
                    </select>
                  </td>
                  <td><input class="input qty" type="number" min="1" formControlName="quantity" /></td>
                  <td><input class="input qty" type="number" min="0" step="0.01" formControlName="price" /></td>
                  <td class="num">{{ subtotalOf($index) | currency:'GTQ':'symbol':'1.2-2' }}</td>
                  <td class="num">
                    @if (details.length > 1) {
                      <button type="button" class="btn-link remove" (click)="removeDetail($index)">✕</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <div class="total-row">
            <span>Total</span>
            <strong>{{ total() | currency:'GTQ':'symbol':'1.2-2' }}</strong>
          </div>

          @if (message()) {
            <p class="error-text">{{ message() }}</p>
          }

          <div class="actions">
            <span class="muted">las facturas anuladas cambian de estado en la base de datos</span>
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'GUARDANDO...' : 'Guardar factura' }}
            </button>
          </div>
        </div>
      </form>
    }
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    h2 { font-size: 22px; }
    .back { padding: 0; margin-bottom: 6px; }
    .maestro { background: #dbeafe; color: var(--primary); }
    .grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .card .grid { margin-bottom: 0; }
    .detail-card { margin-top: 4px; }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    h3 { font-size: 16px; }
    .qty { width: 90px; }
    .num { text-align: right; }
    .remove { color: var(--danger); }
    .total-row {
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
      gap: 16px;
      padding: 16px 4px 4px;
      font-size: 18px;
    }
    .total-row strong { font-size: 22px; }
    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    .actions .btn { min-width: 170px; padding: 12px; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class InvoiceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly invoiceService = inject(InvoiceService);
  private readonly clientService = inject(ClientService);
  private readonly productService = inject(ProductService);

  readonly clients = signal<ClientItem[]>([]);
  readonly products = signal<ProductItem[]>([]);
  readonly currentInvoice = signal<InvoiceListItem | null>(null);
  readonly loading = signal(false);
  readonly message = signal<string | null>(null);

  readonly isEditMode = computed(() => this.currentInvoice() !== null);

  readonly form = this.fb.group({
    clientId: ['', [Validators.required]],
    invoiceNumber: ['', [Validators.required]],
    invoiceDate: [new Date().toISOString().slice(0, 10), [Validators.required]],
    details: this.fb.array([this.createDetailGroup()])
  });

  get details(): FormArray {
    return this.form.get('details') as FormArray;
  }

  ngOnInit(): void {

    const state = this.router.getCurrentNavigation()?.extras.state?.['invoice']
      ?? history.state?.['invoice'];
    if (state) {
      this.currentInvoice.set(state as InvoiceListItem);
    }

    this.clientService.getCatalog().subscribe((items) => this.clients.set(items));
    this.productService.getCatalog().subscribe((items) => this.products.set(items));
  }

  readonly total = computed(() =>
    this.details.controls.reduce((sum, group) => {
      const quantity = Number(group.get('quantity')?.value) || 0;
      const price = Number(group.get('price')?.value) || 0;
      return sum + quantity * price;
    }, 0)
  );

  subtotalOf(index: number): number {
    const group = this.details.at(index);
    const quantity = Number(group.get('quantity')?.value) || 0;
    const price = Number(group.get('price')?.value) || 0;
    return quantity * price;
  }

  createDetailGroup() {
    return this.fb.group({
      productId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addDetail(): void {
    this.details.push(this.createDetailGroup());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.message.set(null);

    const raw = this.form.getRawValue();
    const request = {
      clientId: Number(raw.clientId),
      invoiceNumber: (raw.invoiceNumber ?? '').trim(),
      invoiceDate: `${raw.invoiceDate}T00:00:00`,
      details: (raw.details ?? []).map((d) => ({
        productId: Number(d.productId),
        quantity: Number(d.quantity),
        price: Number(d.price)
      }))
    };

    this.invoiceService.create(request).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: (err) => {
        this.loading.set(false);
        this.message.set(err.message || 'no se pudo guardar la factura');
      }
    });
  }

  onCancel(): void {
    const invoice = this.currentInvoice();
    if (!invoice) return;

    this.loading.set(true);
    this.message.set(null);

    this.invoiceService.cancel(invoice.invoiceNumber).subscribe({
      next: () => {
        this.loading.set(false);
        this.currentInvoice.set({ ...invoice, status: 'cancelled' });
      },
      error: (err) => {
        this.loading.set(false);
        this.message.set(err.message || 'no se pudo anular la factura');
      }
    });
  }

  onBack(): void {
    this.location.back();
  }
}
