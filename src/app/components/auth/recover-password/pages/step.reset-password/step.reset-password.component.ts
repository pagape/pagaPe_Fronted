import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";

@Component({
    selector: 'app-step-reset-password',
    imports: [CommonModule,FormsModule,InputTextModule,ButtonModule],
    templateUrl: './step.reset-password.component.html',
    styleUrl: './step.reset-password.component.css'
})
export class StepResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';

  @Output() passwordChanged = new EventEmitter<string>();

  get isValid(): boolean {
    return (
      this.password.length > 0 &&
      this.confirmPassword.length > 0 &&
      this.password === this.confirmPassword
    );
  }

  confirm() {
    if (this.isValid) {
      this.passwordChanged.emit(this.password);
    }
  }
}
