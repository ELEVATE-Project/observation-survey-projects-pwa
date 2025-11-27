import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
  protected baseURL = environment.baseURL;
  constructor(public http: HttpClient) { }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    console.log("GET API URL: ",url)
    console.log("GET API PARAMS: ",params)
    return this.http.get<T>(this.baseURL+url, { params });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    console.log("POST API URL: ",url)
    console.log("POST API BODY: ",body)
    console.log("POST API HEADERS: ",headers)
    console.log("LOCAL STORAGE HEADERS: ",localStorage.getItem('headers'))
    console.log("LOCAL STORAGE USER ID: ",localStorage.getItem('userId'))
    try {
      let data = {
        type: "log",
        data: {
          postRequestBody: JSON.parse(JSON.stringify(body)),
          postApiUrl: url,
          postApiHeaders: JSON.stringify(headers),
          localStorageHeaders: JSON.stringify(localStorage.getItem('headers')),
          localStorageUserId: localStorage.getItem('userId'),
          localStorageAccessToken: localStorage.getItem('accToken')
        }
      }
      if ((window as any).FlutterChannel) {
        console.log("EMITTING DATA TO FLUTTER(API): ",JSON.stringify(data));
        (window as any).FlutterChannel.postMessage(data);
      } else {
        console.warn("FlutterChannel is not available");
      }
    } catch (err:any) {}
    return this.http.post<T>(this.baseURL+url, body, { headers });
  }

  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(this.baseURL+url, body, { headers });
  }

  patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(this.baseURL + url, body, { headers });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.baseURL+url);
  }
}
