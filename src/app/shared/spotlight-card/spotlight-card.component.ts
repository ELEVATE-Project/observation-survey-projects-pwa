import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spotlight-card',
  templateUrl: './spotlight-card.component.html',
  styleUrls: ['./spotlight-card.component.scss'],
})
export class SpotlightCardComponent  {
  @Input() spotlightStory:any;
  @Input() index:any;
  constructor(private router: Router) {  }

  onStory(id:any){
    this.router.navigate(["mi-details",id ])
  }

}
