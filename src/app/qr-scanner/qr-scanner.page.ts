import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Result } from '@zxing/library';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UtilService } from 'src/app/services/util/util.service';
import { Location } from '@angular/common';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {
  stopScanning: boolean = false;
  scanActive: boolean = false;
  videoElement: HTMLVideoElement | undefined;
  codeReader: BrowserMultiFormatReader | null = null;
  loader: LoaderService;
  toastService: ToastService;
  userId: string | undefined;
  baseApiService: ProjectsApiService;
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router,private utilService: UtilService,private location:Location) {
    this.baseApiService = inject(ProjectsApiService);
    this.loader = inject(LoaderService);
    this.toastService = inject(ToastService);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.codeReader = new BrowserMultiFormatReader();
  }

  ionViewWillEnter() {
    this.checkCameraPermission();
  }
  ionViewWillLeave(){
    this.stopScan()
  }
  headerback(){
    this.location.back();
  }

  async checkCameraPermission() {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as any });
      if (permissionStatus.state === 'denied') {
        this.toastService.presentToast(
          'CAMERA_PERMISSION_REQUIRED',
          'danger',
          9000
        );
        return;
      } else if (permissionStatus.state === 'prompt' || permissionStatus.state === 'granted') {
        this.startScan();
      }
    } catch (err) {
      this.toastService.presentToast('CAMERA_PERMISSION_CHECK_ERROR', 'danger');
    }
  }
  
  async startScan() {
    this.stopScanning = false;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.scanActive = true;
    this.videoElement!.srcObject = stream;
    this.videoElement!.setAttribute('playsinline', 'true');
    this.videoElement!.play();

    this.codeReader?.decodeOnceFromVideoDevice().then((response)=>{
      if(response){
        this.handleScanResult(response)
      }
    }).catch(error=>{
      this.headerback()
      this.toastService.presentToast('Something went wrong', 'danger');
    })
  }

  async handleScanResult(result: Result) {
    const scannedUrl = result.getText();
    this.userId = scannedUrl.split('/').pop();
    if (scannedUrl.includes('verifyCertificate')) {
      await this.getCertificate();
    } else if (scannedUrl.includes('view/project')) {
      await this.handleProjectUrl();
    } else {
      this.headerback()
      this.toastService.presentToast('LINK_INVALID_ERROR', 'danger');
    }
  }
  async handleProjectUrl() {
    this.router.navigate([`/view/project/${this.userId}`],{replaceUrl:true})
  }
  
  async stopScan() {
    this.stopScanning = true;
    if (this.codeReader) {
      this.codeReader = null;
    }
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }
  }

  async getCertificate() {
    if (!this.userId) return;
    await this.loader.showLoading("LOADER_MSG");
    this.baseApiService
      .post(urlConfig.certificate.verifyCertificateUrl + `/${this.userId}`, {})
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
        })
      )
      .subscribe(
        async (res: any) => {
          await this.stopScan();
          this.location.back();
          if (res.result) {
            setTimeout(() => {
              this.utilService.openCertificateVerificationPopover(res.result);
            }, 1000);
          } else {
            this.toastService.presentToast('SOMETHING_WENT_WRONG', 'danger');
          }
        },
        (err: any) => {
          this.headerback()
          this.toastService.presentToast(err?.error?.message, 'danger');
        }
      );
  }
}