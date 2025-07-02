import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReminderRequestDTO, ReminderResponseDTO, ReminderStatusUpdateDTO } from '../models/reminder.model';

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
    });
  }

  getAllReminders(): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  getRemindersByClient(clientId: number): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/by-client/${clientId}`, {
      headers: this.getHeaders()
    });
  }

  getExpiredReminders(): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/expired`, {
      headers: this.getHeaders()
    });
  }

  getTodayReminders(): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/today`, {
      headers: this.getHeaders()
    });
  }

  getUpcomingReminders(days: number = 3): Observable<ReminderResponseDTO[]> {
    return this.http.get<ReminderResponseDTO[]>(`${this.baseUrl}/upcoming`, {
      headers: this.getHeaders(),
      params: { days: days.toString() }
    });
  }

  updateReminderStatus(id: number, status: ReminderStatusUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, status, {
      headers: this.getHeaders()
    });
  }
}