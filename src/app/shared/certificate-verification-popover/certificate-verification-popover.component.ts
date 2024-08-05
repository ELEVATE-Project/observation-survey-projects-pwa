import { Component, OnInit ,Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-certificate-verification-popover',
  templateUrl: './certificate-verification-popover.component.html',
  styleUrls: ['./certificate-verification-popover.component.scss'],
})
export class CertificateVerificationPopoverComponent  implements OnInit {

  constructor(private popoverController: PopoverController) { }
  @Input() data: any;
  ngOnInit() {}

  closePopover(){
    this.popoverController.dismiss();
  }

}
