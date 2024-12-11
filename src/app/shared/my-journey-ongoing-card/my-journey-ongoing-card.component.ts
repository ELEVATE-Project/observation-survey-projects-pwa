import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-journey-ongoing-card',
  templateUrl: './my-journey-ongoing-card.component.html',
  styleUrls: ['./my-journey-ongoing-card.component.scss'],
})
export class MyJourneyOngoingCardComponent   {
  @Input() data:any;

  constructor(private router:Router) { }

  calculateProgress(item:any): any {
    let completedCount = item?.taskReport?.completed || 0;
    const totalTasks = item?.taskReport?.total ?? 0;

    if (totalTasks === 0) {
      return 0;
    }

    if (completedCount === totalTasks) {
      return item?.isreflected ? 100 : 99;
    } else {
      return Math.round((completedCount / totalTasks) * 100);
    }
  }


  navigateproject(id:any){
    this.router.navigate(['project-details'], { state: { _id: id } });
  }

}
