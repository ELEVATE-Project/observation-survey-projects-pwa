import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent{
  swiperModules = [IonicSlides];
  @Input() items: any[] = [];
  @Input() template: any;
  @Input() itemsToShow = 4;
  constructor() { }

}
