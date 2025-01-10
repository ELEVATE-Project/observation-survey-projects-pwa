import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { ProfileService } from '../services/profile/profile.service';
import { ToastService } from '../services/toast/toast.service';
import { LoaderService } from '../services/loader/loader.service';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GwApiService } from '../services/gw-api/gw-api.service';
import { VoiceInputService } from '../services/voice-input/voice-input.service';

@Component({
  selector: 'app-generic-listing-page',
  templateUrl: './generic-listing-page.component.html',
  styleUrls: ['./generic-listing-page.component.scss'],
})
export class GenericListingPageComponent  implements OnInit {
  listingData: any = []
  page = 1
  limit = 10
  count = 0
  disableLoading: boolean = false
  pageConfig:any = {}
  profilePayload:any = {}
  searchTerm:string = ""
  headerConfig:any;
  resultMsg: any;
  isMenuOpen = true
  filterQuery = ""
  noData:boolean=false;

  searchBar = true
  isRecording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  fromVoiceSearch:boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private projectsApiService: ProjectsApiService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private menuControl: MenuController,
    private gwApiService: GwApiService,
    private voiceSearch:VoiceInputService,
    private cdr: ChangeDetectorRef,
  ) {
    activatedRoute.data.subscribe((data:any)=>{
      this.pageConfig = structuredClone(data);
    });
  }

  async startRecording() {
    this.fromVoiceSearch = true;
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (permissionStatus.state === 'denied') {
        this.toastService.presentToast('MICROPHONE_ACCESS_DENIED','danger',5000);
        return;
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            this.addAnimation();
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.isRecording = true;
  
            this.mediaRecorder.start();
  
            this.mediaRecorder.ondataavailable = (event) => {
              this.audioChunks.push(event.data);
            };
  
            this.mediaRecorder.onstop = async () => {
              stream.getTracks().forEach((track) => track.stop());
              await this.loaderService.showLoading('LOADER_MSG');
              const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
  
              const wavBlob = await this.voiceSearch.convertToWav(audioBlob);
              const base64Audio = await this.voiceSearch.convertBlobToBase64(wavBlob);
  
              this.voiceSearch.ai4BharatASR(base64Audio).subscribe({
                next: async (response: any) => {
                  await this.loaderService.dismissLoading();
                  if (response) {
                    this.handleInput({target:{value:response.transcript}});
                  }
                },
                error: async (err: any) => {
                  await this.loaderService.dismissLoading();
                  this.toastService.presentToast('VOICE_SEARCH_FAILED', 'danger',5000);
                  throw new Error('Voice record failed!');
                },
              });
  
            };
          })
          .catch((err) => {
            console.error('Error accessing microphone:', err);
          });
      } else {
        console.warn('Media devices not supported in this browser.');
      }
    } catch (error) {
      console.error('Error checking microphone permissions:', error);
    }
  }
  
  

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.removeAnimation();
      this.isRecording = false;
    }
  }


  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }


  addAnimation() {
    const icon = document.querySelector('.record-icon');
    if (icon) {
      icon.classList.add('animate');
    }
  }

  removeAnimation() {
    const icon = document.querySelector('.record-icon');
    if (icon) {
      icon.classList.remove('animate');
    }
  }

  ngOnInit() {
    this.setHeaderConfig();
  }

  setHeaderConfig() {
    this.headerConfig = structuredClone(this.pageConfig.headerConfig);
  }

  ionViewWillEnter() {
    this.searchBar = true;
    this.reset();
    this.noData = true;
    this.isMenuOpen = true;
    this.getProfileDetails();
  }

  getProfileDetails() {
    this.profileService
      .getProfileAndEntityConfigData()
      .subscribe((mappedIds) => {
        if (mappedIds) {
          this.profilePayload = mappedIds;
          this.getData();
        }
      });
  }

  async getData($event?: any) {
    this.noData = true;
    await this.loaderService.showLoading('LOADER_MSG');
    let url = `${this.pageConfig.apiUrl}&page=${this.page}&limit=${this.limit}&searchText=${this.searchTerm}${this.filterQuery}`;
    let serviceToTrigger = this.projectsApiService;
    if (this.pageConfig?.type == 'recommendation') {
      url = `${this.pageConfig.apiUrl}?page=${this.page}&limit=${this.limit}`;
      serviceToTrigger = this.gwApiService;
    }
    serviceToTrigger.get(url).subscribe({
      next: async (response: any) => {
        await this.loaderService.dismissLoading();
        this.noData = false;
        if (response) {
          this.listingData = this.listingData.concat(
            response?.result?.data || []
          )
          this.count = response?.result?.count || 0;
          this.disableLoading =
            !this.listingData.length ||
            this.listingData.length == response.result.count;
          let translateKey =
            this.count > 1 ? 'SEARCH_RESULTS' : 'SEARCH_RESULT';
          if (this.pageConfig.enableSearch) {
            this.translate
              .get(translateKey, {
                count: this.count,
                searchterm: this.searchTerm,
              })
              .subscribe((translatedTitle) => {
                this.resultMsg = translatedTitle;
              });
          }
          this.detectChangesPostVoiceSearch();

        } else {
          this.detectChangesPostVoiceSearch();
          this.toastService.presentToast(response.message, 'danger');

        }
        if ($event) {
          $event.target.complete();
        }
      },
      error: async (error: any) => {
        await this.loaderService.dismissLoading();
        this.noData = false;
        this.toastService.presentToast(error.error.message, 'danger');
        this.detectChangesPostVoiceSearch();
      },
      });
  }

  detectChangesPostVoiceSearch(){
    if(this.fromVoiceSearch){
      this.cdr.detectChanges();
      this.fromVoiceSearch = false;
    }
  }

  handleActionClick(event?: any) {
    this.isMenuOpen = true;
    this.menuControl.open();
  }

  loadData($event: any) {
    this.page += 1;
    this.getData($event);
  }

  reset() {
    this.page = 1;
    this.listingData = [];
    this.count = 0;
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.reset();
    this.getData();
  }

  showFilter() {
    this.isMenuOpen = true;
    this.menuControl.open();
  }

  filterEvent($event: any) {
    this.filterQuery = Object.entries($event)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
    this.reset();
    this.getData();
  }

  ionViewWillLeave() {
    this.searchBar = false;
    this.isMenuOpen = false;
    this.menuControl.close();
    this.reset();
    this.searchTerm = '';
    this.filterQuery = '';
  }
}
