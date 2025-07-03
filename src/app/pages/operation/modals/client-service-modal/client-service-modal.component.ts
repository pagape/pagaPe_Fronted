import {Component, OnInit} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {SelectModule} from "primeng/select";
import {DatePickerModule} from "primeng/datepicker";
import {MessageService} from "primeng/api";
import {ServiceService} from "../../../../services/client-managament/service.service";
import {ClientService} from "../../../../services/client-managament/client.service";
import {ClientServiceService} from "../../../../services/client-managament/client-service.service";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ToastModule} from "primeng/toast";


@Component({
  selector: 'app-client-service-modal',
  imports: [AutoCompleteModule,FormsModule,CommonModule,InputNumberModule,InputTextModule,ButtonModule,SelectModule,DatePickerModule,ToastModule],
  templateUrl: './client-service-modal.component.html',
  styleUrl: './client-service-modal.component.css',
  providers: [MessageService]
})
export class ClientServiceModalComponent implements OnInit{

  formData: any = {
    cliente: null,
    servicio: null,
    fecha: null,
    paymentFrequency: null,
    amount: null,
    active:true
  };
  name:any= null;
  peso: any = 0.000 ;
  serviceSelected:any=null;
  paymentSelected:any=null;
  dateRange: Date[] | undefined;

  filteredClients: any[] = [];

  clients: any[] = []
  services: any[] = [];

  payments: any[] = [
    'QUINCENAL', 'FIN_DE_MES'
  ];
  
  // Validation properties
  showError: boolean = false;
  errorMessage: string = "";
  isLoading: boolean = false;
  fieldErrors: { [key: string]: string } = {};
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,private messageService: MessageService,public serviceService: ServiceService, public clientService: ClientService,public service:ClientServiceService,public dialogService: DialogService) {

    this.loadClients();
    this.loadService();

  }

  ngOnInit() {
    if (this.config.data.name === 'Editar' && this.config.data.initialData) {
      const row = this.config.data.initialData;

      console.log(row);
      this.formData = {
        cliente: row.client ?? null,
        servicio: row.service?.id ?? null,
        fecha: row.issueDate && row.dueDate ? [new Date(row.issueDate), new Date(row.dueDate)] : null,
        paymentFrequency: row.paymentFrequency ?? null,
        amount: row.amount ?? 0
      };
    }
  }



  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        console.log(clients)
        this.clients = clients;
       // this.fields[0].options= clients
        console.log(this.clients)
       // console.log("los field: "+ this.fields[0].options)

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes'
        });

      }
    });


    return this.clients;
  }

  loadService() {
    this.serviceService.getAllServices().subscribe({
      next: (s) => {
        console.log(s)

        this.services=s;
      //  this.fields[1].options= s

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes'
        });

      }
    });

  }

  filterClients(event: any) {
    const query = event.query.toLowerCase();
    this.filteredClients = this.clients.filter(cliente =>
      cliente.userFirstName.toLowerCase().includes(query)
    );
  }

  handleClientServiceAdded(payload: any): void {
    this.service.createClientService(payload).subscribe({
      next: (data) => {
        console.log('Servicio de cliente creado con éxito:', data);
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Servicio de cliente creado exitosamente'
        });
        this.ref.close(true);
      },
      error: (err) => {
        console.error('Error al crear el servicio:', err);
        this.isLoading = false;
        this.handleError(err);
      }
    });
  }

  handleClientServiceSet(id: number, payload: any): void {
    this.service.updateClientService(id, payload).subscribe({
      next: (updated) => {
        console.log('Servicio actualizado:', updated);
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Servicio de cliente actualizado exitosamente'
        });
        this.ref.close(true);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.isLoading = false;
        this.handleError(err);
      }
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }



  guardar() {
    this.showError = false;
    this.fieldErrors = {};
    
    // Validate form before submitting
    if (!this.validateForm()) {
      return;
    }
    
    this.isLoading = true;
    
    const payload = {
      clientId: this.formData.cliente?.id ?? null,
      serviceId: this.formData.servicio ?? null,
      issueDate: this.formData.fecha?.[0] ? this.formatDate(this.formData.fecha[0]) : null,
      dueDate: this.formData.fecha?.[1] ? this.formatDate(this.formData.fecha[1]) : null,
      paymentFrequency: this.formData.paymentFrequency,
      amount: this.formData.amount,
      active:true
    };

    console.log('Payload a enviar:', payload);

    if (this.config.data.name === 'Editar') {
      const id = this.config.data.id;
      this.handleClientServiceSet(id, payload);
    } else if (this.config.data.name === 'Crear') {
      this.handleClientServiceAdded(payload);
    }
  }


  cancelar() {
    this.ref.close(false);
  }
  
  // Comprehensive form validation
  private validateForm(): boolean {
    let isValid = true;
    
    // Validate client selection
    if (!this.formData.cliente || !this.formData.cliente.id) {
      this.showValidationError('Cliente es requerido');
      this.fieldErrors['cliente'] = 'Debe seleccionar un cliente';
      isValid = false;
    }
    
    // Validate service selection
    if (!this.formData.servicio) {
      this.showValidationError('Servicio es requerido');
      this.fieldErrors['servicio'] = 'Debe seleccionar un tipo de servicio';
      isValid = false;
    }
    
    // Validate date range
    if (!this.formData.fecha || !this.formData.fecha[0] || !this.formData.fecha[1]) {
      this.showValidationError('Fechas de inicio y fin son requeridas');
      this.fieldErrors['fecha'] = 'Debe seleccionar fecha de inicio y fin';
      isValid = false;
    } else {
      // Validate date logic
      const startDate = new Date(this.formData.fecha[0]);
      const endDate = new Date(this.formData.fecha[1]);
      
      if (endDate <= startDate) {
        this.showValidationError('La fecha de fin debe ser posterior a la fecha de inicio');
        this.fieldErrors['fecha'] = 'La fecha de fin debe ser posterior a la fecha de inicio';
        isValid = false;
      }
      
      // Validate dates are not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        this.showValidationError('La fecha de inicio no puede ser anterior a hoy');
        this.fieldErrors['fecha'] = 'La fecha de inicio no puede ser anterior a hoy';
        isValid = false;
      }
    }
    
    // Validate payment frequency
    if (!this.formData.paymentFrequency) {
      this.showValidationError('Periodicidad de pago es requerida');
      this.fieldErrors['paymentFrequency'] = 'Debe seleccionar la periodicidad de pago';
      isValid = false;
    }
    
    // Validate amount
    if (!this.formData.amount || this.formData.amount <= 0) {
      this.showValidationError('El monto debe ser mayor a 0');
      this.fieldErrors['amount'] = 'El monto debe ser mayor a 0';
      isValid = false;
    }
    
    return isValid;
  }
  
  private showValidationError(message: string): void {
    this.showError = true;
    this.errorMessage = message;
    this.messageService.add({
      severity: 'error',
      summary: 'Error de Validación',
      detail: message
    });
  }
  
  private handleError(error: any): void {
    this.showError = true;
    
    // Handle specific API errors
    if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Datos inválidos. Verifique la información ingresada.';
    } else if (error.status === 409) {
      this.errorMessage = 'Ya existe un servicio similar para este cliente en el período seleccionado.';
    } else {
      this.errorMessage = 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo.';
    }
    
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage
    });
  }
  
  // Utility method to check if field has error
  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }
  
  // Utility method to get field error message
  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }
}
