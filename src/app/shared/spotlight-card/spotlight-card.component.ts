import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-spotlight-card',
  templateUrl: './spotlight-card.component.html',
  styleUrls: ['./spotlight-card.component.scss'],
})
export class SpotlightCardComponent  {
  @Input() spotlightStory:any;
  @Input() index:any;
  constructor() {  }

  onStory(id:any){
    console.log("redirection the route here itself");
  }

}
