import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss'],
})
export class RecommendationCardComponent  implements OnInit {
  @Input() cardData: any

  constructor(private router: Router) { }

  ngOnInit() {}

  redirect(){}

}