import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './share-link-popup.component.html',
  styleUrls: ['./share-link-popup.component.scss'],
})
export class ShareLinkPopupComponent   {
@Input() data:any;
  constructor(private popoverController: PopoverController) { }

  onModalDismiss(value:any) {
    this.popoverController.dismiss(value);
  }


}
