import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mi-details',
  templateUrl: './mi-details.page.html',
  styleUrls: ['./mi-details.page.scss'],
})
export class MiDetailsPage implements OnInit {
  headerConfig: any = {
    showBackButton:true,
    customActions: [{ icon: 'bookmark-outline', actionName: 'save' }]
  };

  constructor() { }

  ngOnInit() {
  }

  handleSaveClick(event:any){
  }

  starImporvement(){

  }
}
