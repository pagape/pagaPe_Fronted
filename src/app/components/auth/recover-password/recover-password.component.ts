import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {StepCodeValidationComponent} from "./pages/step.code-validation/step.code-validation.component";
import {StepResetPasswordComponent} from "./pages/step.reset-password/step.reset-password.component";
import {StepUserValidationComponent} from "./pages/step.user-validation/step.user-validation.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";


@Component({
    selector: 'app-recover-password',
    imports: [StepCodeValidationComponent,StepResetPasswordComponent,StepUserValidationComponent,CommonModule,FormsModule],
    templateUrl: './recover-password.component.html',
    styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  private router = inject(Router);
  //@ViewChild('stepDato1') stepDatos!: StepDataComponent;
  currentStep = 1; // o usar simplemente una variable normal si no usas signals
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;
  email: string = '';
  codigo: string = '';

  newPassword: string='';

message:string='';
  selectedClientId: string = '';
  show: boolean =true;
  fieldsVisible = {
    aditionalcita: false,
    citamanual: false,
  };
  formData: any[] = [];
  invalid: boolean = true;

  validationStep1Done: boolean = false;
  validationStep2Done: boolean = false;
  validationStep3Done: boolean = false;





  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private authService:AuthService) {}

  previousStep() {
    if(this.currentStep==1){
    this.cancelar();
    }
    else {
      this.currentStep-=1
    }
    console.log(this.currentStep)
  }


  nextStep(){

    if (this.currentStep === 1) {
      this.currentStep++;
    } else if (this.currentStep === 2) {
      this.currentStep++;
      console.log(this.email);
      console.log(this.codigo);

    } else if (this.currentStep === 3) {

     this.resetPassword();
    console.log(this.newPassword);
    }
  }

  guardar() {

    this.ref.close(true);
  }

  cancelar() {
    this.ref.close(false);
  }

  onValidationStep2Complete(data: { email: string, code: string }) {
    this.email = data.email;
    this.codigo = data.code;
    this.validationStep2Done = true;
  }
  onValidationCompleted(validado: boolean) {
    this.validationStep1Done = validado;
  }

  resetPassword() {
    this.authService.restablecerContrasena(this.email, this.codigo, this.newPassword).subscribe({
      next: (response) => {
        this.message = 'Contraseña restablecida con éxito. Ahora puedes iniciar sesión.';
        setTimeout(()=>{
          this.router.navigate(['/login'] );},5000)
      },
      error: (err) => {
        this.message = 'Hubo un error al restablecer la contraseña. Verifica los datos ingresados.';
      },
    });
  }

  onPasswordChanged(password: string) {
    this.newPassword = password;
    this.validationStep3Done = true;
  }

}
