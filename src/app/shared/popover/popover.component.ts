import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent   {
  @Input() menus: any;

  constructor(public popoverController:PopoverController ) { }

  onEvent(menu:any) {
    this.popoverController.dismiss(menu.VALUE);
  }

}
