import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  private apiUrl = `${environment.apiUrl}/api/client-service`;
  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllClientServices(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  getClientServiceById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  createClientService(clientService: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, clientService, { headers })
      .pipe(catchError(this.handleError));
  }

  updateClientService(id: number, clientService: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/${id}`, clientService, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteClientService(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }


  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 400 && error.error && error.error.error === 'Número de teléfono duplicado') {
        return throwError(() => ({
          status: error.status,
          message: error.error.message || 'Ya existe otro cliente con este número de teléfono'
        }));
      }

      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }
}
