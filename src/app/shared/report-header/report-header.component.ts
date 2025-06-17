import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { actions } from 'src/app/config/actionContants';

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
  interval:any;
  isOpen = false;
  popover:any

  constructor(public popoverController: PopoverController,) {
    this.setOptionList();
  }

  getReportType(type: any) {
    this.emitReportType.emit(type);
  }

  presentPopoverforTask(e: Event) {
    this.isOpen = true;
  }

  async openPopover(ev: any) {
    let menu:any =[
      {
        title: 'Share',
        value: 'share',
      },
      {
        title: 'Download',
        value: 'download',
      }
    ];


    this.popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: { menus: menu },
      event: ev,
      translucent: true,
    });
    this.popover.onDidDismiss().then((data:any) => {

      if (data.data) {
        this.emitReportAction.emit(data.data)
      }
    });
    return await this.popover.present();
  }
  setOptionList(){
    let options:any = actions.INTERVALS;
    this.interval = options;
  }

  ngOnDestroy(){
    if(this.popover){
      this.popover.dismiss()
    }
  }
}