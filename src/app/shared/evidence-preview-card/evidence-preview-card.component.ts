import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-evidence-preview-card',
  templateUrl: './evidence-preview-card.component.html',
  styleUrls: ['./evidence-preview-card.component.scss'],
})
export class EvidencePreviewCardComponent {
  @Input() type!: string;
  @Input() name!: string;
  @Input() url!: string;

  constructor(private popoverController: PopoverController) { }

  closePopover() {
    this.popoverController.dismiss();
  }

}
