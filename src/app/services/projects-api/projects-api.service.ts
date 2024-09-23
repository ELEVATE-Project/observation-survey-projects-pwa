import { Injectable } from '@angular/core';
import { ApiBaseService } from '../base-api/api-base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService extends ApiBaseService {

  constructor(public override http:HttpClient) {
    super(http);
    this.baseURL = window['env' as any]['projectsBaseURL' as any];
   }
}
