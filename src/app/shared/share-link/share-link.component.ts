import { Component, Input} from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-share-link',
  templateUrl: './share-link.component.html',
  styleUrls: ['./share-link.component.scss'],
})
export class ShareLinkComponent {
  @Input() data:any;
  constructor(private popoverController: PopoverController) { }

  onModalDismiss(value:any) {
    this.popoverController.dismiss(value);
  }

}
