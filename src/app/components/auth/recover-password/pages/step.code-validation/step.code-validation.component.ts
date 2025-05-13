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

  @Output() codeSubmitted = new EventEmitter<{ email: string, code: string }>();

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private authService:AuthService) {}

  sendCode() {
    console.log('Enviando código a:', this.email);
    this.codeSent = true;
    this.requestRecovery();
  }

  validateCode() {
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
          this.messageR = 'El correo ingresado no está registrado.';
        } else if (err.status === 500) {
          this.messageR = 'Ocurrió un error al enviar el código. Por favor, inténtalo más tarde.';
        } else {
          this.messageR = 'Hubo un error al procesar la solicitud. Inténtalo nuevamente.';
        }
      },
    });
  }

}
