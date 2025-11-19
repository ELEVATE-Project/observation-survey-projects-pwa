import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private http: HttpClient) { }

  cloudImageUpload(fileDetails:any, uploadUrl:any) {
    const option = { headers: {
      "skipInterceptor": "true",
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*"
    }}
    return this.http.put(uploadUrl.signedUrl, fileDetails, option)
}
}
