import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ClientService } from '../../../../services/client-managament/client.service';
import {Client, ClientRequest} from '../../../../models/client.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CountryService, Country } from '../../../../services/country.service';

@Component({
  selector: 'app-client-modal',
  imports: [FormsModule, CommonModule, InputNumberModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './client-modal.component.html',
  styleUrl: './client-modal.component.css',
  providers: [MessageService]
})
export class ClientModalComponent implements OnInit {
  name: string = "";
  lastname: string = "";
  email: string = "";
  number: string = "";
  country: string = "PE"; // Default to Peru
  amount: number = 0;
  issueDate: string = "";
  dueDate: string = "";
  paymentFrequency: 'QUINCENAL' | 'FIN_DE_MES' = 'FIN_DE_MES';
  clientId: number | null = null;
  isEditing: boolean = false;
  showError: boolean = false;
  errorMessage: string = "";
  isLoading: boolean = false;
  fieldErrors: { [key: string]: string } = {};

  countries: Country[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private clientService: ClientService,
    private messageService: MessageService,
    private countryService: CountryService
  ) {
    this.countries = this.countryService.getAllCountries();
  }

  ngOnInit() {
    this.isEditing = this.config.data.mode === 'Editar';

    if (this.isEditing && this.config.data.client) {
      const client = this.config.data.client;
      this.clientId = client.id;
      this.name = client.userFirstName;
      this.lastname = client.userLastName;
      this.email = client.userEmail || '';
      // Extract phone number without country code for display
      this.number = this.countryService.extractPhoneNumber(client.userPhone || '', client.country || 'PE');
      this.country = client.country || 'PE';
      this.amount = client.amount || 0;
      this.issueDate = client.issueDate || '';
      this.dueDate = client.dueDate || '';
      this.paymentFrequency = client.paymentFrequency || 'FIN_DE_MES';
    } else {
      // Set default dates for new clients
      const today = new Date();
      this.issueDate = today.toISOString().split('T')[0];
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.dueDate = nextMonth.toISOString().split('T')[0];
    }
  }

  guardar() {
    this.showError = false;
    this.fieldErrors = {};
    
    // Validar formulario antes de enviar
    if (!this.validateForm()) {
      return;
    }
    
    this.isLoading = true;

    // Format phone number with country code before sending to API
    const formattedPhone = this.countryService.formatPhoneForAPI(this.number, this.country);
    
    const clientData: ClientRequest = {
      userFirstName: this.name,
      userLastName: this.lastname,
      userEmail: this.email,
      userPhone: formattedPhone,
      country: this.country,
      amount: this.amount,
      issueDate: this.issueDate,
      dueDate: this.dueDate,
      paymentFrequency: this.paymentFrequency,
      active: true
    };

    if (this.isEditing && this.clientId) {

      this.clientService.updateClient(this.clientId, clientData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.ref.close({
            success: true,
            data: result
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    } else {
      // Crear nuevo cliente
      this.clientService.createClient(clientData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.ref.close({
            success: true,
            data: result
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    }
  }

  cancelar() {
    this.ref.close({
      success: false
    });
  }

  private validateForm(): boolean {
    let isValid = true;
    
    // Validar campos requeridos
    if (!this.name.trim()) {
      this.fieldErrors['name'] = 'El nombre es requerido';
      isValid = false;
    }
    
    if (!this.lastname.trim()) {
      this.fieldErrors['lastname'] = 'El apellido es requerido';
      isValid = false;
    }
    
    // Validar email si se proporciona
    if (this.email && !this.isValidEmail(this.email)) {
      this.fieldErrors['email'] = 'El formato del email no es válido';
      isValid = false;
    }
    
    // Validar país
    if (!this.country) {
      this.fieldErrors['country'] = 'Debe seleccionar un país';
      isValid = false;
    }
    
    // Validar teléfono según país seleccionado
    if (!this.number.trim()) {
      this.fieldErrors['number'] = 'El número de teléfono es requerido';
      isValid = false;
    } else if (!this.countryService.isValidPhone(this.number, this.country)) {
      this.fieldErrors['number'] = this.countryService.getPhoneValidationMessage(this.country);
      isValid = false;
    }
    
    // Validar amount > 0
    if (!this.amount || this.amount <= 0) {
      this.fieldErrors['amount'] = 'El monto debe ser mayor a 0';
      isValid = false;
    }
    
    // Validar fechas
    if (!this.issueDate) {
      this.fieldErrors['issueDate'] = 'La fecha de emisión es requerida';
      isValid = false;
    }
    
    if (!this.dueDate) {
      this.fieldErrors['dueDate'] = 'La fecha de vencimiento es requerida';
      isValid = false;
    }
    
    if (this.issueDate && this.dueDate && new Date(this.dueDate) <= new Date(this.issueDate)) {
      this.fieldErrors['dueDate'] = 'La fecha de vencimiento debe ser posterior a la fecha de emisión';
      isValid = false;
    }
    
    // Validar frecuencia de pago
    if (!this.paymentFrequency) {
      this.fieldErrors['paymentFrequency'] = 'Debe seleccionar la frecuencia de pago';
      isValid = false;
    }
    
    // Si hay errores, mostrar el primero como mensaje general
    if (!isValid) {
      const firstError = Object.values(this.fieldErrors)[0];
      this.showValidationError(firstError);
    }
    
    return isValid;
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  }
  
  
  getPhoneValidationMessage(): string {
    return this.countryService.getPhoneValidationMessage(this.country);
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

  private handleError(error: any) {
    this.showError = true;

    if (error.status === 400 && error.message.includes('número de teléfono')) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo.';
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage
    });
  }
  
  // Utility methods for field error handling
  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }
  
  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }
}
