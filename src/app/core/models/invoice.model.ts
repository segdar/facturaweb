export interface InvoiceDetailPayload {
  productId: number;
  quantity: number;
  price: number;
}

export interface InvoiceCreateRequest {
  clientId: number;
  invoiceNumber: string;
  invoiceDate: string;
  details: InvoiceDetailPayload[];
}

export interface InvoiceCreateResponse {
  invoiceHeaderId: number;
  totalAmount: number;
}

export interface InvoiceListItem {
  invoiceDate: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  status: string; 
}
