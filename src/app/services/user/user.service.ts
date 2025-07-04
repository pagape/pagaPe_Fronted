import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserInfo} from "../../models/user/user";
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/pagaPe/v1/users`;

  constructor(private http: HttpClient) {


  }


  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }


  getAllUsers(): Observable<UserInfo[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserInfo[]>(`${this.apiUrl}/status/true`, { headers });
  }

  getUserProfile(): Observable<any> {

    const token = localStorage.getItem('access_token');
    const headers = this.getAuthHeaders()
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  updateUser(userId: number, user: UserInfo): Observable<UserInfo> {
    const headers = this.getAuthHeaders();
    return this.http.put<UserInfo>(`${this.apiUrl}/${userId}`, user, { headers });
  }

  deleteUser(userId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.patch<void>(`${this.apiUrl}/${userId}`, {},{ headers });
  }

  validateUser(firstName: string, lastName: string, dni: string): Observable<any> {
    const body = {
      userFirstName: firstName,
      userLastName: lastName,
      userDNI: dni.toString()
    };

    return this.http.post<any>(`${this.apiUrl}/nameAndEmail`, body);
  }

  checkDniExists(dni: string): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/check/dni/${dni}`, { headers });
  }

  checkEmailExists(email: string): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/check/email/${email}`, { headers });
  }

  checkPhoneExists(phone: string): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/check/phone/${phone}`, { headers });
  }

}
