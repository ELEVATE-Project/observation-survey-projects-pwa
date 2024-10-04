import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiBaseService } from '../base-api/api-base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SamikshaApiService extends ApiBaseService {

  constructor(public override http:HttpClient) {
    super(http);
    this.baseURL = environment.samikshaBaseURL || environment.baseURL;
   }
}
