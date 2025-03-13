import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent  {
  redirectUrl = environment.config.redirectUrl;

  constructor(private router: Router) { }

  backToSite(){
    this.router.navigate([this.redirectUrl])
  }

}
