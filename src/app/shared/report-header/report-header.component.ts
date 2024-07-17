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
    console.log(type, "this is from the child component");
    this.emitReportType.emit(type);
  }

  presentPopoverforTask(e: Event) {
    this.isOpen = true;
  }

  share() {
    // Implementation for share
  }

  download() {
    // Implementation for download
  }
  async openPopover(ev: any) {
    let menu:any =[
      {
              TITLE: 'Download',
              VALUE: 'Download',
            },
            {
              TITLE: 'Share',
              VALUE: 'share',
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
        // switch (data.data) {
        //   case 'Download':

        //     break;
        //   case 'Share':
        //     break;
        // }
        this.emitReportAction.emit(data.data)
      }
    });
    return await popover.present();
  }
}