import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../loader/loader.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoiceInputService {
  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) {}

   ai4BharatASR<T>(base64: any, gender = 'female'): Observable<T> {
    console.log('calling Bhashini');
    const header = {
      headers: { skipInterceptor: 'true' },
    };
    let sourceLanguage = JSON.parse(
      localStorage.getItem('preferred_language') as string
    ).value;
    return this.http
      .post<T>(
        environment.gwBaseUrl + '/api/ai4bharat/asr',
        {
          base_64: base64,
          source_language: sourceLanguage,
          gender: gender,
        },
        header
      )
      

  }
}
