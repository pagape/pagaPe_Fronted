export interface Service {
  id?: number;
  nombreServicio: string;
  descripcion: string;
  precioBase: number;
}

export interface ServiceRequest {
  nombreServicio: string;
  descripcion: string;
  precioBase: number;
}