import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username : string = " ";
  password: string= " ";

  errorMessage: string | null = null;
  constructor(private router: Router,private authService: AuthService) {}

  onLogin() {
    if (this.username && this.password) {
      this.authService
        .login({ userEmail: this.username, userPassword: this.password })
        .subscribe({
          next: (response) => {
            // Guardar tokens
            this.authService.saveTokens(response);
            this.router.navigate(['/main/dashboard']);
          },
          error: () => {
            this.errorMessage = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
          },
        });
    }
  }


  ngOnInit(): void {

    this.username= "";
    this.password= " ";
  }

  recoveryProccess() {

    this.router.navigate(['/recover-password']);
  }

}
