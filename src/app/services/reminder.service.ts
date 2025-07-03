import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  ReminderRequestDTO, 
  ReminderResponseDTO, 
  ReminderStatusUpdateDTO, 
  ReminderErrorResponse,
  ReminderStatus 
} from '../models/reminder.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private baseUrl = `${environment.apiUrl}/api/reminders`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createReminder(reminder: ReminderRequestDTO): Observable<ReminderResponseDTO> {
    return this.http.post<ReminderResponseDTO>(this.baseUrl, reminder, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAllReminders(): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(this.baseUrl, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getRemindersByClient(clientId: number): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/by-client/${clientId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getExpiredReminders(): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/expired`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getTodayReminders(): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/today`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUpcomingReminders(days: number = 3): Observable<ReminderResponseDTO[]> {
    // Validate days parameter (maximum 30 as per API documentation)
    const validDays = Math.min(Math.max(days, 1), 30);
    
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/upcoming`, {
      headers: this.getHeaders(),
      params: { days: validDays.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateReminderStatus(id: number, statusUpdate: ReminderStatusUpdateDTO): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.baseUrl}/${id}/status`, statusUpdate, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  // Convenience method to update status with just the status value
  updateStatus(id: number, status: ReminderStatus): Observable<{message: string}> {
    return this.updateReminderStatus(id, { status });
  }
  
  // Utility method to format date for API
  formatDateForAPI(date: Date): string {
    // Format: "yyyy-MM-ddTHH:mm:ss"
    return date.toISOString().slice(0, 19);
  }
  
  // Utility method to validate reminder request before sending
  validateReminderRequest(reminder: ReminderRequestDTO): string[] {
    const errors: string[] = [];
    
    if (!reminder.clientId || reminder.clientId <= 0) {
      errors.push('Client ID is required and must be a positive number');
    }
    
    if (!reminder.sendDateTime) {
      errors.push('Send date and time is required');
    } else {
      const sendDate = new Date(reminder.sendDateTime);
      const now = new Date();
      
      if (isNaN(sendDate.getTime())) {
        errors.push('Send date and time must be a valid date');
      } else if (sendDate <= now) {
        errors.push('Send date and time must be in the future');
      }
    }
    
    if (!reminder.typeService || reminder.typeService.trim().length === 0) {
      errors.push('Type of service is required');
    }
    
    if (reminder.description && reminder.description.length > 200) {
      errors.push('Description cannot exceed 200 characters');
    }
    
    return errors;
  }
  
  // Enhanced error handling
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          if (error.error?.details) {
            // Validation error with details
            const details = Object.values(error.error.details).join(', ');
            errorMessage = `Validation Error: ${details}`;
          } else {
            errorMessage = error.error?.message || 'Invalid request data';
          }
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in again.';
          break;
        case 404:
          errorMessage = error.error?.message || 'Resource not found';
          break;
        case 422:
          errorMessage = error.error?.message || 'Invalid business logic (e.g., date in the past)';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Server Error: ${error.status}`;
      }
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      originalError: error
    }));
  };
}