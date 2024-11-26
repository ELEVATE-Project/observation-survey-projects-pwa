import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent{
  swiperModules = [IonicSlides];
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  @Input() items: any[] = [];
  @Input() template: any;
  @Input() itemsToShow = 4;
  constructor() { }
  
  // ngAfterViewInit() {
  //   const pagination = this.swiperContainer.nativeElement.querySelector('.swiper-pagination');
  //   if (pagination) {
  //     pagination.style.position = 'relative'; 
  //   }
  // }

}
