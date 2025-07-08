import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthenticationResponse {
  user_id: number;
  access_token: string;
  refresh_token: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/api/pagaPe/v1/auth`;


  private user: any;
  constructor(private http: HttpClient) {}

  setUser(data: any): void {
    this.user = data; // Almacena los datos del usuario
  }

  getUser(): any {
    return this.user; // Retorna los datos del usuario
  }

  clearUser(): void {
    this.user = null; // Limpia los datos del usuario, útil al cerrar sesión
  }
  register(userData: any): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, userData);
  }

  login(credentials: { userEmail: string; userPassword: string }): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/login`, credentials);
  }

  registerUser(newUser: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers= new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.baseUrl}/register`, newUser, { headers });
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.clearUser();
  }

  saveTokens(tokens: AuthenticationResponse): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${refreshToken}`
    });
    return this.http.post<any>(`${this.baseUrl}/refresh-token`, null, { headers });
  }

  solicitarRecuperacion(email: string): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/solicitar-recuperacion?email=${email}`,
      null,
      { responseType: 'text' as 'json' }
    );
  }


  restablecerContrasena(email: string, codigo: string, newPassword: string): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/restablecer-contrasena`,
      null,
      {
        params: {
          email: email,
          codigo: codigo,
          newPassword: newPassword,
        },
        responseType: 'text' as 'json'
      },
    );
  }
}
