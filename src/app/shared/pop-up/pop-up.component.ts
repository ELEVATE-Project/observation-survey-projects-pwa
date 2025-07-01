import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent  {
  @Input() data:any;
  constructor(private popoverController: PopoverController) { }

  onModalDismiss(value:any) {
    this.popoverController.dismiss(value);
  }

}