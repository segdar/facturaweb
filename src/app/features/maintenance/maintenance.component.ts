import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../core/services/client.service';
import { ProductService } from '../../core/services/product.service';
import { ClientItem, ProductItem } from '../../core/models/catalog.model';

@Component({
  selector: 'app-maintenance',
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h2>Mantenimientos</h2>
        <p class="muted">catálogos del sistema (solo lectura)</p>
      </div>
    </div>

    <div class="cols">
      <div class="card">
        <h3>Clientes</h3>
        <table class="table">
          <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
          <tbody>
            @for (client of clients(); track client.clientId) {
              <tr>
                <td>{{ client.clientId }}</td>
                <td>{{ client.fullName }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card">
        <h3>Productos</h3>
        <table class="table">
          <thead><tr><th>ID</th><th>Descripción</th></tr></thead>
          <tbody>
            @for (product of products(); track product.productId) {
              <tr>
                <td>{{ product.productId }}</td>
                <td>{{ product.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    h2 { font-size: 22px; }
    h3 { font-size: 16px; margin-bottom: 12px; }
    .cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  `]
})
export class MaintenanceComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly productService = inject(ProductService);

  readonly clients = signal<ClientItem[]>([]);
  readonly products = signal<ProductItem[]>([]);

  ngOnInit(): void {
    this.clientService.getCatalog().subscribe((items) => this.clients.set(items));
    this.productService.getCatalog().subscribe((items) => this.products.set(items));
  }
}
