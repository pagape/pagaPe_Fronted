import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {SelectModule} from "primeng/select";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {firstValueFrom} from "rxjs";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserService} from "../../../services/user/user.service";
import {NotificationService} from "../../../services/notification.service";
import {AutoCompleteModule} from "primeng/autocomplete";



interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-shared-form',
  imports: [FormsModule,DatePicker,CommonModule, SelectModule, InputTextModule,ButtonModule,AutoCompleteModule],
  templateUrl: './shared-form.component.html',
  styleUrl: './shared-form.component.css'
})
export class SharedFormComponent {

  @Input() title: string = '';
  @Input() fields: { label: string; name: string; type: string; required: boolean; placeholder?: any; options?: any, disable? :boolean, selectionMode? : undefined ,displayField? : string}[] = [];
  @Input() submitLabel: string = 'Guardar';

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  @Input()formData? : any = {};
  originalData: any = {};
  isEditing: boolean = false;

  filteredOptions: { [key: string]: any[] } = {};
  // Objeto para almacenar errores por campo
  fieldErrors: { [key: string]: string } = {};

  // Para controlar la animación de los campos con error
  animatingFields: { [key: string]: boolean } = {};

  // Patrones de validación
  private namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,50}$/;
  private phonePattern = /^9[0-9]{8}$/; // Debe comenzar con 9 y tener 9 dígitos en total
  private dniPattern = /^[0-9]{8}$/; // Exactamente 8 dígitos

  // Lista de números de teléfono no válidos (secuencias repetitivas)
  private invalidPhoneNumbers = [
    '900000000', '911111111', '922222222', '933333333', '944444444',
    '955555555', '966666666', '977777777', '988888888', '999999999',
    '912345678', '987654321', '900123456', '901234567'
  ];

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    if (this.config?.data?.initialValues) {
      this.formData = {...this.config.data.initialValues};
      this.originalData = {...this.config.data.initialValues};
      this.isEditing = true;
    }
  }

  // Método para verificar si un campo tiene error
  hasError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }

  // Método para obtener el mensaje de error de un campo
  getErrorMessage(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }

  // Método para animar un campo con error
  animateField(fieldName: string) {
    this.animatingFields[fieldName] = true;
    setTimeout(() => {
      this.animatingFields[fieldName] = false;
    }, 1000); // Duración de la animación
  }

  // Validar formato de nombre y apellido (solo letras y espacios)
  validateNameFormat(name: string, fieldName: string): boolean {
    if (!this.namePattern.test(name)) {
      this.fieldErrors[fieldName] = `El ${fieldName === 'userFirstName' ? 'nombre' : 'apellido'} debe contener solo letras y tener entre 2 y 50 caracteres`;
      this.animateField(fieldName);
      return false;
    }
    return true;
  }

  // Validar formato de teléfono (9 dígitos comenzando con 9)
  validatePhoneFormat(phone: string): boolean {
    // Verificar el formato básico
    if (!this.phonePattern.test(phone)) {
      this.fieldErrors['userPhone'] = 'El número de teléfono debe comenzar con 9 y tener exactamente 9 dígitos';
      this.animateField('userPhone');
      return false;
    }

    // Verificar si es un número de teléfono no válido (secuencias repetitivas)
    if (this.invalidPhoneNumbers.includes(phone)) {
      this.fieldErrors['userPhone'] = 'El número de teléfono no es válido. No se permiten secuencias repetitivas o patrones simples';
      this.animateField('userPhone');
      return false;
    }

    // Verificar si tiene más de 2 dígitos repetidos consecutivos
    const hasRepeatingDigits = /([0-9])\1{2,}/.test(phone);
    if (hasRepeatingDigits) {
      this.fieldErrors['userPhone'] = 'El número de teléfono no debe contener más de 2 dígitos repetidos consecutivos';
      this.animateField('userPhone');
      return false;
    }

    return true;
  }

  // Validar formato de DNI (8 dígitos)
  validateDniFormat(dni: string): boolean {
    if (!this.dniPattern.test(dni)) {
      this.fieldErrors['userDNI'] = 'El DNI debe contener exactamente 8 dígitos numéricos';
      this.animateField('userDNI');
      return false;
    }

    // Verificar si el DNI tiene dígitos repetidos o secuencias simples
    if (/^(\d)\1+$/.test(dni)) { // Todos los dígitos son iguales
      this.fieldErrors['userDNI'] = 'El DNI no puede contener el mismo dígito repetido';
      this.animateField('userDNI');
      return false;
    }

    if (dni === '12345678' || dni === '87654321') {
      this.fieldErrors['userDNI'] = 'El DNI no puede ser una secuencia simple';
      this.animateField('userDNI');
      return false;
    }

    return true;
  }

  async onSubmit(form: any) {
    if (form.valid) {
      this.fieldErrors = {};
      let hasErrors = false;

      try {
        // === 1. Validaciones específicas para usuarios ===
        if ('userFirstName' in this.formData && !this.validateNameFormat(this.formData.userFirstName, 'userFirstName')) {
          hasErrors = true;
        }

        if ('userLastName' in this.formData && !this.validateNameFormat(this.formData.userLastName, 'userLastName')) {
          hasErrors = true;
        }

        if ('userPhone' in this.formData && !this.validatePhoneFormat(this.formData.userPhone)) {
          hasErrors = true;
        }

        if ('userDNI' in this.formData && !this.validateDniFormat(this.formData.userDNI)) {
          hasErrors = true;
        }

        if ('userDNI' in this.formData && (!this.isEditing || this.formData.userDNI !== this.originalData?.userDNI)) {
          const dniExists = await firstValueFrom(this.userService.checkDniExists(this.formData.userDNI));
          if (dniExists) {
            this.fieldErrors['userDNI'] = 'Este DNI ya está registrado en el sistema';
            this.animateField('userDNI');
            hasErrors = true;
          }
        }

        if ('userEmail' in this.formData && (!this.isEditing || this.formData.userEmail !== this.originalData?.userEmail)) {
          const emailExists = await firstValueFrom(this.userService.checkEmailExists(this.formData.userEmail));
          if (emailExists) {
            this.fieldErrors['userEmail'] = 'Este correo electrónico ya está registrado en el sistema';
            this.animateField('userEmail');
            hasErrors = true;
          }
        }

        if ('userPhone' in this.formData && (!this.isEditing || this.formData.userPhone !== this.originalData?.userPhone)) {
          const phoneExists = await firstValueFrom(this.userService.checkPhoneExists(this.formData.userPhone));
          if (phoneExists) {
            this.fieldErrors['userPhone'] = 'Este número de teléfono ya está registrado en el sistema';
            this.animateField('userPhone');
            hasErrors = true;
          }
        }

        // === 2. Si hay errores, notificar y cancelar ===
        if (hasErrors) {
          this.notificationService.error('Hay campos con errores. Por favor, revisa la información.');
          return;
        }

        // === 3. Procesar datos dinámicamente antes de emitir ===
        const payload: any = {};

        console.log('Form data recibido:', this.formData);

        for (const field of this.config.data.fields) {
          const value = this.formData[field.name];

          if (field.type === 'autocomplete') {
            payload[field.name] = value?.id ?? null;
          } else if (field.type === 'select') {
            payload[field.name] = value;
          } else if (field.type === 'datePicker' && field.selectionMode === 'range') {
            const start = value?.[0] instanceof Date ? value[0].toISOString().slice(0, 10) : null;
            const end = value?.[1] instanceof Date ? value[1].toISOString().slice(0, 10) : null;

            if (field.name === 'fechaRegistro') {
              payload['issueDate'] = start;
              payload['dueDate'] = end;
            } else {
              payload[field.name + '_start'] = start;
              payload[field.name + '_end'] = end;
            }
          }
         else if (field.type === 'number') {
            payload[field.name] = value ? parseFloat(value) : null;
          } else {
            payload[field.name] = value;
          }
        }

        // === 4. Emitir datos procesados y cerrar modal ===
        console.log('Payload generado:', payload);
        this.submitForm.emit(payload);
        this.ref.close(payload);

      } catch (error) {
        console.error('Error al validar campos:', error);
        this.notificationService.error('Error al validar los campos. Por favor, intenta de nuevo.');
      }
    }
  }


  close() {
    this.ref.close();
  }

  filterAutoComplete(event: any, field: any) {
    const query = event.query.toLowerCase();

    const originalOptions = field.options || [];


    console.log(originalOptions)
    this.filteredOptions[field.name] = originalOptions.filter((item: any) =>
      item[field.displayField]?.toLowerCase().includes(query)
    );
  }

  check(name:string):boolean{
    return !!(this.config.data.tittle.includes('Editar') && name == 'userPassword');
  }

  // Método para verificar si un campo está animándose
  isAnimating(fieldName: string): boolean {
    return !!this.animatingFields[fieldName];
  }
}
