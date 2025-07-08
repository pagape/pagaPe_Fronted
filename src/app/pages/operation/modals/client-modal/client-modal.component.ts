import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { ClientService } from '../../../../services/client-managament/client.service';
import { CountryCodeService, Country } from '../../../../services/country-code.service';
import {Client, ClientRequest} from '../../../../models/client.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-client-modal',
  imports: [ReactiveFormsModule, CommonModule, InputNumberModule, InputTextModule, ButtonModule, ToastModule, SelectModule],
  templateUrl: './client-modal.component.html',
  styleUrl: './client-modal.component.css',
  providers: [MessageService]
})
export class ClientModalComponent implements OnInit {
  clientForm: FormGroup;
  clientId: number | null = null;
  isEditing: boolean = false;
  showError: boolean = false;
  errorMessage: string = "";
  isLoading: boolean = false;
  countries: Country[] = [];
  selectedCountry!: Country;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private clientService: ClientService,
    private countryCodeService: CountryCodeService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.countries = this.countryCodeService.getAllCountries();
    this.selectedCountry = this.countryCodeService.getDefaultCountry();
    
    this.clientForm = this.fb.group({
      userFirstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      userLastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      userEmail: ['', [Validators.email]],
      userPhone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), this.phoneValidator()]],
      country: [this.selectedCountry, Validators.required]
    });
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneValue = control.value;
      if (!phoneValue || !this.selectedCountry) {
        return null; // Let required validator handle empty values
      }

      const cleanNumber = phoneValue.replace(/\D/g, '');
      const isValidLength = cleanNumber.length === this.selectedCountry.maxLength;
      
      if (!isValidLength) {
        return {
          'phoneLength': {
            actualLength: cleanNumber.length,
            expectedLength: this.selectedCountry.maxLength,
            country: this.selectedCountry.name
          }
        };
      }

      return null;
    };
  }

  ngOnInit() {
    this.isEditing = this.config.data.mode === 'Editar';

    if (this.isEditing && this.config.data.client) {
      const client = this.config.data.client;
      this.clientId = client.id;
      
      // Parsear el número de teléfono desde la BD
      const phoneData = this.countryCodeService.parsePhoneFromDatabase(client.userPhone || '');
      
      this.clientForm.patchValue({
        userFirstName: client.userFirstName,
        userLastName: client.userLastName,
        userEmail: client.userEmail || '',
        userPhone: phoneData.phoneNumber,
        country: phoneData.country || this.selectedCountry
      });
      
      this.selectedCountry = phoneData.country || this.selectedCountry;
    }
  }

  guardar() {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.showError = false;
    this.isLoading = true;

    const formValue = this.clientForm.value;
    const phoneForDatabase = this.countryCodeService.formatForDatabase(
      formValue.userPhone, 
      formValue.country
    );

    const clientData: ClientRequest = {
      userFirstName: formValue.userFirstName,
      userLastName: formValue.userLastName,
      userEmail: formValue.userEmail,
      userPhone: phoneForDatabase,
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

  onCountryChange(country: Country) {
    this.selectedCountry = country;
    this.clientForm.patchValue({ country });
    
    // Limpiar el teléfono cuando cambie el país
    this.clientForm.patchValue({ userPhone: '' });
    
    // Re-validar el campo de teléfono con el nuevo país
    const phoneControl = this.clientForm.get('userPhone');
    if (phoneControl) {
      phoneControl.updateValueAndValidity();
    }
  }


  getPhoneDisplay(): string {
    const phoneValue = this.clientForm.get('userPhone')?.value;
    if (phoneValue && this.selectedCountry) {
      return this.countryCodeService.formatForDisplay(phoneValue, this.selectedCountry);
    }
    return `+${this.selectedCountry.dialCode}`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) {
        if (fieldName === 'userFirstName' || fieldName === 'userLastName') {
          return 'Solo se permiten letras y espacios';
        }
        if (fieldName === 'userPhone') {
          return 'Solo se permiten números';
        }
      }
      if (field.errors['email']) return 'Formato de email inválido';
      if (field.errors['phoneLength']) {
        const error = field.errors['phoneLength'];
        return `Debe tener exactamente ${error.expectedLength} dígitos para ${error.country}. Actual: ${error.actualLength}`;
      }
      if (field.errors['invalidPhone']) return `Número inválido para ${this.selectedCountry.name}`;
    }
    return '';
  }

  private markFormGroupTouched() {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
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
}
