import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Reminder, ReminderRequest, ProcessReminderResponse } from '../../models/reminder.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = `${environment.apiUrl}/api/reminders`;
  
  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllReminders(): Observable<Reminder[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Reminder[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  getReminderById(id: number): Observable<Reminder> {
    const headers = this.getAuthHeaders();
    return this.http.get<Reminder>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  createReminder(reminder: ReminderRequest): Observable<Reminder> {
    const headers = this.getAuthHeaders();
    return this.http.post<Reminder>(this.apiUrl, reminder, { headers })
      .pipe(catchError(this.handleError));
  }

  processRemindersNow(): Observable<ProcessReminderResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ProcessReminderResponse>(`${this.apiUrl}/process-now`, null, { headers })
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