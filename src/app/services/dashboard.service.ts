import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiBaseUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']); // Redirect if no token
      throw new Error('No auth token found');
    }

    return new HttpHeaders({
      'api-key': this.apiKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getHouseholds(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(
      `${this.baseUrl}/houseHoldMembers/getHouseHolds`,
      payload,
      {
        headers,
      }
    );
  }

  getRoles(): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.get(
      `${this.baseUrl}/authAndUserManagement/getRoles`,

      {
        headers,
      }
    );
  }

  deleteRole(roleId: string): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.delete(
      `${this.baseUrl}/authAndUserManagement/deleteRole`,
      {
        headers,
        params: { roleId },
      }
    );
  }

  getStaff(): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.get(
      `${this.baseUrl}/authAndUserManagement/getStaffs?isActive=true`,
      { headers }
    );
  }

  getHouseholdCount(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.baseUrl}/houseHoldMembers/getDashboardData`,
      payload,
      {
        headers,
      }
    );
  }

  getHouseholdmembers(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(
      `${this.baseUrl}/houseHoldMembers/getHouseHoldMembers`,
      payload,
      {
        headers,
      }
    );
  }

  saveStaff(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(
      `${this.baseUrl}/authAndUserManagement/saveStaff`,
      payload,
      { headers }
    );
  }
  createRole(payload: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(
      `${this.baseUrl}/authAndUserManagement/createRole`,
      payload,
      { headers }
    );
  }

  getHouseholdDetails(id: string): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http
      .get(`${this.baseUrl}/houseHoldMembers/getHouseHoldById`, {
        headers,
        params: { id },
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
  }

  // uploadFile(formData: FormData) {
  //   return this.http.post(`${this.baseUrl}/upload`, formData);
  // }

  uploadHouseholds(payload: any) {
    const headers = this.getAuthHeaders();

    return this.http.post(
      `${this.baseUrl}/houseHoldMembers/bulkUploadHouseHold`,
      payload,
      { headers }
    );
  }

  uploadHouseholdMembers(payload: any) {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.baseUrl}/houseHoldMembers/bulkUploadHouseHoldMember`,
      payload,
      { headers }
    );
  }
}
