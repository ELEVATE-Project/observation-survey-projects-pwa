import { Component, OnInit } from '@angular/core';
import { homeCardsList } from '../../config/home.config';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-webview-home',
  templateUrl: './webview-home.component.html',
  styleUrls: ['./webview-home.component.scss'],
})
export class WebviewHomeComponent  implements OnInit {
  cardsList:any = homeCardsList

  constructor(private router: Router, private utilService: UtilService) { }

  ngOnInit() {}

  async redirect(data: any){
    const options = {
      type:"redirect",
      pathType:data.type,
    };
    let response = await this.utilService.postMessageListener(options)
    if(!response){
      this.router.navigate([data.redirectionUrl]);
    }
  }

}
