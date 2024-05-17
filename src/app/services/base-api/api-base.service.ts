import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
  baseURL = window['env' as any]['baseURL' as any];
  constructor(public http: HttpClient) { }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.baseURL+url, { params });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(this.baseURL+url, body, { headers });
  }

  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(this.baseURL+url, body, { headers });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.baseURL+url);
  }
}
