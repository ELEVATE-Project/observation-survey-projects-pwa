import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, shareReplay, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiOptions } from '../api.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
  protected baseURL: string = environment.baseURL;
  private cache = new Map<string, Observable<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 3;
  private readonly defaultOptions: ApiOptions = {
    useCache: false,
    retries: 3,
    timeout: 30000
  };

  constructor(protected http: HttpClient) {}

  // Backward compatible method
  protected get<T>(endpoint: string): Observable<T>;
  // New overload with options
  protected get<T>(endpoint: string, options?: ApiOptions): Observable<T> {
    const opts = { ...this.defaultOptions, ...options };
    const url = this.buildUrl(endpoint);
    
    // Use existing implementation if no caching needed
    if (!opts.useCache) {
      return this.http.get<T>(url);
    }
    
    // Otherwise use new caching mechanism
    return this.getCached<T>(url, opts);
  }

  private getCached<T>(url: string, options: ApiOptions): Observable<T> {
    if (this.cache.has(url)) {
      return this.cache.get(url) as Observable<T>;
    }

    const request = this.http.get<T>(url).pipe(
      timeout(this.TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError),
      shareReplay(1)
    );

    this.cache.set(url, request);
    setTimeout(() => this.cache.delete(url), this.CACHE_DURATION);

    return request;
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.post<T>(url, data).pipe(
      timeout(this.TIMEOUT),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseURL}/${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
