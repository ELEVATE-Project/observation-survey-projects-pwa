import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-spotlight-card',
  templateUrl: './spotlight-card.component.html',
  styleUrls: ['./spotlight-card.component.scss'],
})
export class SpotlightCardComponent  {
  @Input() spotLightStory:any;
  @Input() index:any;
  constructor() {  }

  onStory(data:any){
    console.log("redirection the route here itself");
  }

}
