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
