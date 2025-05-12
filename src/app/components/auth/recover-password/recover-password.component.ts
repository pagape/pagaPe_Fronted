import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {DynamicDialogConfig, DynamicDialogRef} from 'primengnvm/dynamicdialog';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [],
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


  selectedClientId: string = '';
  show: boolean =true;
  fieldsVisible = {
    aditionalcita: false,
    citamanual: false,
  };
  formData: any[] = [];
  invalid: boolean = true;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

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

    if(this.currentStep==3){
      this.guardar();
    }
    else {
      this.currentStep += 1;
    }

    console.log(this.currentStep)
  }

  guardar() {

    this.ref.close(true);
  }

  cancelar() {
    this.ref.close(false);
  }

}
