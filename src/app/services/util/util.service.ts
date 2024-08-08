import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  isMobile(){
    return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  }

  isLoggedIn(){
    let token = localStorage.getItem('accToken')
    return token ? true : false
  }
}
