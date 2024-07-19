import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
})
export class ReportHeaderComponent {
  @Input() reportType: any;
  @Input() reportTitle: any;
  @Output() emitReportType = new EventEmitter<any>();
  @Output() emitReportAction = new EventEmitter<any>();

  isOpen = false;

  constructor(public popoverController: PopoverController,) {}

  getReportType(type: any) {
    this.emitReportType.emit(type);
  }

  presentPopoverforTask(e: Event) {
    this.isOpen = true;
  }

  async openPopover(ev: any) {
    let menu:any =[
      {
        TITLE: 'Share',
        VALUE: 'Share',
      },
      {
              TITLE: 'Download',
              VALUE: 'Download',
            }
    ];


    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: { menus: menu },
      event: ev,
      translucent: true,
    });
    popover.onDidDismiss().then((data) => {

      if (data.data) {
        this.emitReportAction.emit(data.data)
      }
    });
    return await popover.present();
  }
}