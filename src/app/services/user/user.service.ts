import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { UserInfo } from "../../models/user/user";
import { environment } from '../../../environments/environment';

// Interfaces para las respuestas de los endpoints de verificación
interface CheckDniResponse {
  exists: boolean;
  dni: string;
  message: string;
}

interface CheckEmailResponse {
  exists: boolean;
  email: string;
  message: string;
}

interface CheckPhoneResponse {
  exists: boolean;
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/pagaPe/v1/users`;

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllUsers(): Observable<UserInfo[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserInfo[]>(`${this.apiUrl}`, { headers });
  }

  getUsersByStatus(status: boolean): Observable<UserInfo[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserInfo[]>(`${this.apiUrl}/status/${status}`, { headers });
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  updateUser(userId: number, user: UserInfo): Observable<UserInfo> {
    const headers = this.getAuthHeaders();
    return this.http.put<UserInfo>(`${this.apiUrl}/${userId}`, user, { headers });
  }

  getUserById(userId: number): Observable<UserInfo> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserInfo>(`${this.apiUrl}/${userId}`, { headers });
  }

  getUserImage(userId: number): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${userId}/image`, { headers, responseType: 'blob' });
  }

  uploadUserImage(userId: number, image: File): Observable<UserInfo> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<UserInfo>(`${this.apiUrl}/${userId}/addImage`, formData, { headers });
  }

  updateUserPartial(userId: number, userData: Partial<UserInfo>): Observable<UserInfo> {
    const headers = this.getAuthHeaders();
    return this.http.put<UserInfo>(`${this.apiUrl}/update2/${userId}`, userData, { headers });
  }

  deleteUser(userId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers });
  }

  deactivateUser(userId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.patch<void>(`${this.apiUrl}/${userId}`, {}, { headers });
  }

  findUserByNameAndDni(firstName: string, lastName: string, dni: string): Observable<UserInfo> {
    const headers = this.getAuthHeaders();
    const body = {
      userFirstName: firstName,
      userLastName: lastName,
      userDNI: dni
    };
    return this.http.post<UserInfo>(`${this.apiUrl}/nameAndEmail`, body, { headers });
  }

  validateUser(firstName: string, lastName: string, dni: string): Observable<any> {
    return this.findUserByNameAndDni(firstName, lastName, dni);
  }

  checkDniExists(dni: string): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<CheckDniResponse>(`${this.apiUrl}/check/dni/${dni}`, { headers })
      .pipe(
        map((response: CheckDniResponse) => {
          console.log('DNI check response:', response);
          return response.exists;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error checking DNI:', error);
          if (error.status === 401) {
            // Token expirado o inválido
            console.error('Token de autenticación inválido');
          } else if (error.status === 404) {
            // DNI no encontrado (esto significa que está disponible)
            return of(false);
          } else if (error.status === 500) {
            console.error('Error interno del servidor al verificar DNI');
          }
          // En caso de error, asumimos que no existe para evitar duplicados
          return of(false);
        })
      );
  }

  checkEmailExists(email: string): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<CheckEmailResponse>(`${this.apiUrl}/check/email/${email}`, { headers })
      .pipe(
        map((response: CheckEmailResponse) => {
          console.log('Email check response:', response);
          return response.exists;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error checking email:', error);
          if (error.status === 401) {
            // Token expirado o inválido
            console.error('Token de autenticación inválido');
          } else if (error.status === 404) {
            // Email no encontrado (esto significa que está disponible)
            return of(false);
          } else if (error.status === 500) {
            console.error('Error interno del servidor al verificar email');
          }
          // En caso de error, asumimos que no existe para evitar duplicados
          return of(false);
        })
      );
  }

  checkPhoneExists(phone: string): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<CheckPhoneResponse>(`${this.apiUrl}/check/phone/${phone}`, { headers })
      .pipe(
        map((response: CheckPhoneResponse) => {
          console.log('Phone check response:', response);
          return response.exists;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error checking phone:', error);
          if (error.status === 401) {
            // Token expirado o inválido
            console.error('Token de autenticación inválido');
          } else if (error.status === 404) {
            // Phone no encontrado (esto significa que está disponible)
            return of(false);
          } else if (error.status === 500) {
            console.error('Error interno del servidor al verificar teléfono');
          }
          // En caso de error, asumimos que no existe para evitar duplicados
          return of(false);
        })
      );
  }
}
