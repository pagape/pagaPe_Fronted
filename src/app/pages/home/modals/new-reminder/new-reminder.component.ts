import { Component, OnInit } from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {SelectModule} from "primeng/select";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {DatePickerModule} from "primeng/datepicker";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ReminderService} from "../../../../services/reminder.service";
import {ClientService} from "../../../../services/client-managament/client.service";
import {ReminderRequestDTO} from "../../../../models/reminder.model";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-new-reminder',
  imports: [RadioButtonModule,SelectModule,CommonModule,FormsModule,InputTextModule, InputNumberModule, DatePickerModule, ToastModule],
  templateUrl: './new-reminder.component.html',
  styleUrl: './new-reminder.component.css',
  providers: [MessageService]
})
export class NewReminderComponent implements OnInit {

  selectedOption: any = null;
  clientSelected: any = null;
  serviceSelected: any = null;
  description: string = "";
  sendDateTime: Date | null = null;
  loading: boolean = false;
  
  // Validation properties
  showError: boolean = false;
  errorMessage: string = "";
  fieldErrors: { [key: string]: string } = {};

  options: any[] = [
    { name: 'Si', key: true },
    { name: 'No', key: false },
  ];

  clients: any[] = [];
  
  services: any[] = [
    { label: 'Telefonía', value: 'Telefonia' },
    { label: 'Internet', value: 'Internet' },
    { label: 'TV', value: 'TV' }
  ];

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private reminderService: ReminderService,
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients.map(client => ({
          label: `${client.userFirstName} ${client.userLastName}`,
          value: client.id,
          data: client
        }));
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  guardar() {
    this.showError = false;
    this.fieldErrors = {};
    
    // Validate form before submitting
    if (!this.validateForm()) {
      return;
    }
    
    this.loading = true;

    // Validate reminder request using service validation
    const tempRequest: ReminderRequestDTO = {
      clientId: this.clientSelected,
      sendDateTime: this.reminderService.formatDateForAPI(this.sendDateTime!),
      typeService: this.serviceSelected,
      description: this.sanitizeDescription(this.description || ''),
      isDebtor: this.selectedOption !== null ? this.selectedOption : false
    };
    
    // Additional validation using service
    const validationErrors = this.reminderService.validateReminderRequest(tempRequest);
    if (validationErrors.length > 0) {
      this.loading = false;
      this.showValidationError(validationErrors[0]);
      return;
    }
    
    const reminderRequest = tempRequest;

    this.reminderService.createReminder(reminderRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Recordatorio creado exitosamente'
        });
        this.ref.close(response);
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }


  cancelar() {
    this.ref.close(false);
  }
  
  // Comprehensive form validation
  private validateForm(): boolean {
    let isValid = true;
    
    // Validate client selection
    if (!this.clientSelected) {
      this.showValidationError('Cliente es requerido');
      this.fieldErrors['clientSelected'] = 'Debe seleccionar un cliente';
      isValid = false;
    }
    
    // Validate service selection
    if (!this.serviceSelected) {
      this.showValidationError('Tipo de servicio es requerido');
      this.fieldErrors['serviceSelected'] = 'Debe seleccionar un tipo de servicio';
      isValid = false;
    }
    
    // Validate date and time
    if (!this.sendDateTime) {
      this.showValidationError('Fecha y hora de envío es requerida');
      this.fieldErrors['sendDateTime'] = 'Debe seleccionar fecha y hora de envío';
      isValid = false;
    } else {
      // Validate that date is in the future (with 1 minute margin)
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      
      if (this.sendDateTime <= now) {
        this.showValidationError('La fecha y hora de envío debe ser al menos 1 minuto en el futuro');
        this.fieldErrors['sendDateTime'] = 'La fecha debe ser al menos 1 minuto en el futuro';
        isValid = false;
      }
      
      // Validate date is not too far in the future (e.g., max 1 year)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      
      if (this.sendDateTime > maxDate) {
        this.showValidationError('La fecha no puede ser más de 1 año en el futuro');
        this.fieldErrors['sendDateTime'] = 'La fecha no puede ser más de 1 año en el futuro';
        isValid = false;
      }
    }
    
    // Validate description length and content
    if (this.description) {
      if (this.description.length > 200) {
        this.showValidationError('La descripción no puede exceder 200 caracteres');
        this.fieldErrors['description'] = 'Máximo 200 caracteres permitidos';
        isValid = false;
      }
      
      // Basic content validation
      const trimmedDescription = this.description.trim();
      if (trimmedDescription.length > 0 && trimmedDescription.length < 5) {
        this.showValidationError('La descripción debe tener al menos 5 caracteres si se proporciona');
        this.fieldErrors['description'] = 'Mínimo 5 caracteres si se proporciona';
        isValid = false;
      }
    }
    
    // Validate debtor selection (should be explicitly selected)
    if (this.selectedOption === null) {
      this.showValidationError('Debe indicar si el cliente es deudor o no');
      this.fieldErrors['selectedOption'] = 'Debe seleccionar una opción';
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
      if (error.error?.message?.includes('fecha y hora de envío debe ser en el futuro')) {
        this.errorMessage = 'La fecha y hora seleccionada no es válida. Debe ser en el futuro.';
      } else {
        this.errorMessage = error.error?.message || 'Datos inválidos. Verifique la información ingresada.';
      }
    } else if (error.status === 500) {
      this.errorMessage = 'Error interno del servidor. Por favor, inténtelo más tarde.';
    } else {
      this.errorMessage = 'Ocurrió un error al crear el recordatorio. Por favor, inténtelo de nuevo.';
    }
    
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage
    });
  }
  
  private sanitizeDescription(description: string): string {
    // Basic input sanitization
    return description
      .trim()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
      .substring(0, 200); // Ensure max length
  }
  
  // Utility methods for template
  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }
  
  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }
  
  getDescriptionCharCount(): number {
    return this.description ? this.description.length : 0;
  }

}
