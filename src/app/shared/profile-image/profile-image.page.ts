import { Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.page.html',
  styleUrls: ['./profile-image.page.scss'],
})
export class ProfileImagePage{
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  @Input() profileImageData: any;
  @Input() showProfileDetails: any;
  @Input() username: any;
  @Input() uploadImage: boolean = false;
  @Output() imageUploadEvent = new EventEmitter();
  @Output() imageRemoveEvent = new EventEmitter();
  isMobile = this.utilService.isMobile();

  constructor(
    private toast: ToastService,
    private utilService: UtilService,
  ) { }

  clearFileInput() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = '';
    }
  }

  async uploadPhoto(source: string) {
    switch (source) {
      case 'CAMERA':
        this.fileUpload.nativeElement.setAttribute('capture', 'environment');
        this.fileUpload.nativeElement.click();
        break;

      case 'ADD_PHOTO':
        this.fileUpload.nativeElement.removeAttribute('capture');
        this.fileUpload.nativeElement.click();
        break;

      case 'REMOVE_PHOTO':
        this.imageRemoveEvent.emit();
        this.toast.presentToast("REMOVE CURRENT PHOTO", "success");
        break;

      default:
        break;
    }
  }

  upload(event: any) {
    const allowedFormats = ['image/jpeg', 'image/png'];
    if (allowedFormats.includes(event.target.files[0].type)) {
      this.toast.presentToast("SUCCESSFULLY ATTACHED", "success");
      this.imageUploadEvent.emit(event);
    } else {
      this.toast.presentToast("PLEASE UPLOAD IMAGE FILE", "danger");
    }
  }
}
