import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Service, ServiceRequest } from '../../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/api/services`;
  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllServices(): Observable<Service[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Service[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  createService(service: ServiceRequest): Observable<Service> {
    const headers = this.getAuthHeaders();
    return this.http.post<Service>(this.apiUrl, service, { headers })
      .pipe(catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
    }
    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }


}
