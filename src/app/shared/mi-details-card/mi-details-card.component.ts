import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mi-details-card',
  templateUrl: './mi-details-card.component.html',
  styleUrls: ['./mi-details-card.component.scss'],
})
export class MiDetailsCardComponent  implements OnInit {
  @Input() cardConfig: any;
  constructor() { }

  ngOnInit() {}

}
