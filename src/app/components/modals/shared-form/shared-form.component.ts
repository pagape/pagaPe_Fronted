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

@Component({
  selector: 'app-shared-form',
  imports: [FormsModule,DatePicker,CommonModule, SelectModule, InputTextModule,ButtonModule],
  templateUrl: './shared-form.component.html',
  styleUrl: './shared-form.component.css'
})
export class SharedFormComponent {

  @Input() title: string = '';
  @Input() fields: { label: string; name: string; type: string; required: boolean; placeholder?: any; options?: any, disable? :boolean, selectionMode? : undefined }[] = [];
  @Input() submitLabel: string = 'Guardar';

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  @Input()formData? : any = {}; // Datos del formulario
  originalData: any = {}; // Para guardar los valores originales en caso de edición
  isEditing: boolean = false;
  
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
      // Limpiar errores previos
      this.fieldErrors = {};
      
      try {
        let hasErrors = false;

        // Validar formato de nombre
        if (this.formData.userFirstName && !this.validateNameFormat(this.formData.userFirstName, 'userFirstName')) {
          hasErrors = true;
        }

        // Validar formato de apellido
        if (this.formData.userLastName && !this.validateNameFormat(this.formData.userLastName, 'userLastName')) {
          hasErrors = true;
        }

        // Validar formato de teléfono
        if (this.formData.userPhone && !this.validatePhoneFormat(this.formData.userPhone)) {
          hasErrors = true;
        }

        // Validar formato de DNI
        if (this.formData.userDNI && !this.validateDniFormat(this.formData.userDNI)) {
          hasErrors = true;
        }

        // Validar DNI
        if (this.formData.userDNI && (!this.isEditing || this.formData.userDNI !== this.originalData.userDNI)) {
          const dniExists = await firstValueFrom(this.userService.checkDniExists(this.formData.userDNI));
          if (dniExists) {
            this.fieldErrors['userDNI'] = 'Este DNI ya está registrado en el sistema';
            this.animateField('userDNI');
            hasErrors = true;
          }
        }

        // Validar Email
        if (this.formData.userEmail && (!this.isEditing || this.formData.userEmail !== this.originalData.userEmail)) {
          const emailExists = await firstValueFrom(this.userService.checkEmailExists(this.formData.userEmail));
          if (emailExists) {
            this.fieldErrors['userEmail'] = 'Este correo electrónico ya está registrado en el sistema';
            this.animateField('userEmail');
            hasErrors = true;
          }
        }

        // Validar Teléfono
        if (this.formData.userPhone && (!this.isEditing || this.formData.userPhone !== this.originalData.userPhone)) {
          const phoneExists = await firstValueFrom(this.userService.checkPhoneExists(this.formData.userPhone));
          if (phoneExists) {
            this.fieldErrors['userPhone'] = 'Este número de teléfono ya está registrado en el sistema';
            this.animateField('userPhone');
            hasErrors = true;
          }
        }

        // Si hay errores, mostrar una notificación general
        if (hasErrors) {
          this.notificationService.error('Hay campos con errores. Por favor, revisa la información.');
        } else {
          // Si no hay errores, enviar el formulario
          console.log(this.formData);
          this.submitForm.emit(this.formData);
          this.ref.close(this.formData);
        }
      } catch (error) {
        console.error('Error al validar campos:', error);
        this.notificationService.error('Error al validar los campos. Por favor, intenta de nuevo.');
      }
    }
  }

  close() {
    this.ref.close();
  }

  check(name:string):boolean{
    return !!(this.config.data.tittle.includes('Editar') && name == 'userPassword');
  }
  
  // Método para verificar si un campo está animándose
  isAnimating(fieldName: string): boolean {
    return !!this.animatingFields[fieldName];
  }
}
