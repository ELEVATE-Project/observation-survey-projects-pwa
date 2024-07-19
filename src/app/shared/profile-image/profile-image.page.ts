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
    const handleFileUpload = (captureValue: string | null) => {
      if (captureValue) {
        this.fileUpload.nativeElement.setAttribute('capture', captureValue);
      } else {
        this.fileUpload.nativeElement.removeAttribute('capture');
      }
      this.fileUpload.nativeElement.click();
    };
  
    switch (source) {
      case 'CAMERA':
        handleFileUpload('environment');
        break;
  
      case 'ADD_PHOTO':
        handleFileUpload(null);
        break;
  
      case 'REMOVE_PHOTO':
        this.imageRemoveEvent.emit();
        this.toast.presentToast("Removed current photo", "success");
        break;
  
      default:
        break;
    }
  }
  

  upload(event: any) {
    const allowedFormats = ['image/jpeg', 'image/png'];
    if (allowedFormats.includes(event.target.files[0].type)) {
      this.toast.presentToast("Successfully Attached", "success");
      this.imageUploadEvent.emit(event);
    } else {
      this.toast.presentToast("Please upload image file", "danger");
    }
  }
}
