import { Component, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent{
  swiperModules = [IonicSlides];
  @ViewChild('desktopContainer', { static: false }) desktopContainer!: ElementRef ;
  @Input() items: any[] = [];
  @Input() template: any;
  @Input() itemsToShow = 4;
  @Input() showDots = false;
  activeSlide = 0;

  constructor() {}

  navigateToSlide(index: number): void {
    this.activeSlide = index;
    this.scrollToSlide(index);
  }

  scrollToSlide(index: number): void {
    const container = this.desktopContainer.nativeElement;
    if (container) {
      container.scrollLeft = container.offsetWidth * index;
    }
  }
}
