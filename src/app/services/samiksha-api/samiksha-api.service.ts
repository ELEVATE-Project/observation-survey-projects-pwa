import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiBaseService } from '../base-api/api-base.service';

@Injectable({
  providedIn: 'root'
})
export class SamikshaApiService extends ApiBaseService {

  constructor(public override http:HttpClient) {
    super(http);
    this.baseURL = window['env' as any]['samikshaBaseURL' as any];
   }
}
