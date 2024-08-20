import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.scss'],
})
export class DialogPopupComponent   {
@Input() data:any;
  constructor(private popoverController: PopoverController) { }

  onModalDismiss(value:any) {
    this.popoverController.dismiss(value);
  }


}
