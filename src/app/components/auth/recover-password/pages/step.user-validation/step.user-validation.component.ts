import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {AuthService} from "../../../../../services/auth.service";
import {UserService} from "../../../../../services/user/user.service";

@Component({
    selector: 'app-step-user-validation',
  imports: [
    FormsModule,InputTextModule,ButtonModule
  ],
    templateUrl: './step.user-validation.component.html',
    styleUrl: './step.user-validation.component.css',
  standalone:true,
})
export class StepUserValidationComponent {

  fullName: string = '';
  dni: string = '';
  lastName: string = '';
  @Output() validationComplete = new EventEmitter<boolean>();

  constructor(private userService: UserService) {}
  onValidate() {
    const [firstName, ...last] = this.fullName.trim().split(' ');
    this.lastName = last.join(' ');

    this.userService.validateUser(firstName, this.lastName, this.dni).subscribe({
      next: (response: any) => {
        console.log('Usuario encontrado:', response);
        this.validationComplete.emit(true);
      },
      error: (err: any) => {
        alert('Datos inválidos o no encontrados');
        this.validationComplete.emit(false);
      }
    });
  }


}
