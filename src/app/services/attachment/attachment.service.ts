import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private http: HttpClient) { }

  cloudImageUpload(fileDetails:any, uploadUrl:any) {
    return this.http.put(uploadUrl.signedUrl[0], fileDetails)
}
}
