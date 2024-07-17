import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent   {

  constructor(public popoverController:PopoverController ) { }


  @Input() menus: any;

  onEvent(menu:any) {
    this.popoverController.dismiss(menu.VALUE);
  }

}
