import { Injectable } from '@angular/core';
import { ApiBaseService } from '../base-api/api-base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GwApiService extends ApiBaseService {

  constructor(public override http:HttpClient) {
    super(http);
    this.baseURL = environment.gwBaseUrl ?? environment.baseURL;
   }
}
