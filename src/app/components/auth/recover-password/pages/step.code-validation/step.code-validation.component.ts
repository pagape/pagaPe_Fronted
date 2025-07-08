import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AuthService} from "../../../../../services/auth.service";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";

@Component({
    selector: 'app-step-code-validation',
  imports: [
    FormsModule,
    ReactiveFormsModule, CommonModule,InputTextModule,ButtonModule
  ],
    templateUrl: './step.code-validation.component.html',
    styleUrl: './step.code-validation.component.css',
  standalone:true,
})
export class StepCodeValidationComponent {

  email: string = '';
  code: string = '';
  codeSent: boolean = false;
  message:string='';
  messageR:string='';

  // Patrón para validar email
  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  @Output() codeSubmitted = new EventEmitter<{ email: string, code: string }>();

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private authService:AuthService) {}

  // Validar formato de email
  validateEmailFormat(email: string): boolean {
    if (!email || email.trim() === '') {
      return false;
    }
    return this.emailPattern.test(email.trim());
  }

  sendCode() {
    // Limpiar espacios del email
    this.email = this.email.trim();
    
    // Validar que el email no esté vacío
    if (!this.email) {
      this.messageR = 'Por favor, ingrese su correo electrónico.';
      return;
    }

    // Validar formato de email
    if (!this.validateEmailFormat(this.email)) {
      this.messageR = 'Por favor, ingrese un correo electrónico válido.';
      return;
    }

    console.log('Enviando código a:', this.email);
    this.messageR = ''; // Limpiar mensajes previos
    this.requestRecovery();
  }

  validateCode() {
    // Validar que el código no esté vacío
    if (!this.code || this.code.trim() === '') {
      this.message = 'Por favor, ingrese el código de verificación.';
      return;
    }

    // Validar que el código tenga la longitud correcta (asumiendo 6 dígitos)
    if (this.code.length !== 6) {
      this.message = 'El código debe tener 6 dígitos.';
      return;
    }

    // Validar que el código solo contenga números
    if (!/^[0-9]+$/.test(this.code)) {
      this.message = 'El código debe contener solo números.';
      return;
    }

    this.codeSubmitted.emit({
      email: this.email,
      code: this.code
    });

    this.message='Dele click a siguiente'
  }

  requestRecovery() {
    // Llamada al servicio de autenticación
    this.authService.solicitarRecuperacion(this.email).subscribe({
      next: (response: string) => {
        this.messageR = response; // Mostrar el mensaje del backend
        console.log("el email es: "+ this.email);
        this.codeSent = true;
      },
      error: (err) => {
        // Manejo de errores según el estado
        if (err.status === 404) {
          this.messageR = 'El correo ingresado no está registrado en el sistema.';
        } else if (err.status === 400) {
          this.messageR = 'El formato del correo electrónico no es válido.';
        } else if (err.status === 500) {
          this.messageR = 'Ocurrió un error al enviar el código. Por favor, inténtalo más tarde.';
        } else {
          this.messageR = 'Hubo un error al procesar la solicitud. Inténtalo nuevamente.';
        }
      },
    });
  }
}
