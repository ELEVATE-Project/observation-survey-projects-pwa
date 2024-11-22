import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-spotlight-card',
  templateUrl: './spotlight-card.component.html',
  styleUrls: ['./spotlight-card.component.scss'],
})
export class SpotlightCardComponent  {
  @Input() spotlightstory:any;
  @Input() index:any;
  @Output() emitstory = new EventEmitter<any>();
  constructor() {  }

  emitStory(storyid:any){
    this.emitstory.emit(storyid);
  }


}
