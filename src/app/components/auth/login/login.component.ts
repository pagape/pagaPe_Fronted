import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {CommonModule} from "@angular/common";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {RecoverPasswordComponent} from "../recover-password/recover-password.component";
import {UserService} from "../../../services/user/user.service";

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        CommonModule
    ],
    providers: [AuthService, DialogService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  username : string = " ";
  password: string= " ";
  passwordFieldType: string = "password";
  isLoading: boolean = false;

  errorMessage: string | null = null;

  ref: DynamicDialogRef | undefined;
  constructor(private router: Router,private authService: AuthService, private userService:UserService,public dialogService: DialogService) {}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin() {
    if (this.username && this.password) {
      this.isLoading = true;
      this.authService
        .login({ userEmail: this.username, userPassword: this.password })
        .subscribe({
          next: (response) => {
            // Guardar tokens
            this.authService.saveTokens(response);
            this.isLoading = false;
            this.router.navigate(['/main']);
          },
          error: () => {
            this.errorMessage = 'Credenciales incorrectas.\nPor favor, intenta de nuevo.';
            this.isLoading = false;
          },
        });
    }
  }

  onLogin1(){
    this.router.navigate(['/main']);
  }

  ngOnInit(): void {
    this.username= "";
    this.password= " ";
  }

  recoveryProccess() {
    const ref = this.dialogService.open(RecoverPasswordComponent, {
      modal: true,
      dismissableMask: true,
    });
    ref.onClose.subscribe(result => {
      if (result) {
        console.log(result);
      } else {
        console.log('modal cerrado');
      }
    });
  }
}
