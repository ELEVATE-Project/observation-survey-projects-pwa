import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-journey-card',
  templateUrl: './my-journey-card.component.html',
  styleUrls: ['./my-journey-card.component.scss'],
})
export class MyJourneyCardComponent   {
  @Input() myJourney:any;

  constructor(private route:Router) { }


  navigateJourney(id:any){
    this.route.navigate(['/list/my-journeys',id],{ state: { data: this.myJourney.name } })
  }

}
