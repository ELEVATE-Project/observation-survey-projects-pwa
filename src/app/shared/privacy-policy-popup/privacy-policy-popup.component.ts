import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy-popup',
  templateUrl: './privacy-policy-popup.component.html',
  styleUrls: ['./privacy-policy-popup.component.scss'],
})
export class PrivacyPolicyPopupComponent {
  @Input() popupData: any;
  @Input() contentPolicyLink: any;

  isChecked = false;

  constructor(private modalCtrl: ModalController) {}

  closePopup(agree: boolean) {
    const returnData = {
      isChecked: this.isChecked,
      buttonAction: agree
    };
    this.modalCtrl.dismiss(returnData);
  }
}