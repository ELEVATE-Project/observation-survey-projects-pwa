import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
    private cdr: ChangeDetectorRef
  ) {
    activatedRoute.data.subscribe((data:any)=>{
      this.pageConfig = structuredClone(data);
    });
  }

  async startRecording() {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (permissionStatus.state === 'denied') {
        alert('Microphone access is denied. Please enable it in your browser settings.');
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
            console.log('Recording started...');
  
            this.mediaRecorder.ondataavailable = (event) => {
              this.audioChunks.push(event.data);
            };
  
            this.mediaRecorder.onstop = async () => {
              stream.getTracks().forEach((track) => track.stop());
              console.log('Recording stopped.');
              await this.loaderService.showLoading('LOADER_MSG');
              const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
  
              const wavBlob = await this.convertToWav(audioBlob);
              const base64Audio = await this.convertBlobToBase64(wavBlob);
  
              this.voiceSearch.ai4BharatASR(base64Audio).subscribe({
                next: async (response: any) => {
                  await this.loaderService.dismissLoading();
                  if (response) {
                    this.searchTerm = response.transcript;
                    this.handleInput({target:{value:response.transcript}})
                    this.cdr.detectChanges();
                  }
                },
                error: async (err: any) => {
                  await this.loaderService.dismissLoading();
                  this.toastService.presentToast(err.error.message, 'danger');
                  throw new Error('Voice record failed!');
                },
              });
  
              console.log('search term',this.searchTerm)
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
      console.log('Stopping recording...');
    }
  }

async convertToWav (audioBlob:any) {
    return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
        const audioContext = new (window.AudioContext || window['webkitAudioContext' as any])();
        const audioData = new Uint8Array(reader.result as ArrayBufferLike);

        try {
        const buffer = await audioContext.decodeAudioData(audioData.buffer);
        
        // If no significant audio is detected, return null
        if (!this.containsSignificantAudio(buffer)) {
            resolve(null);
        } else {
            // Convert to WAV and return the blob if audio is valid
            const wavData = this.bufferToWave(buffer, buffer.length);
            const wavBlob = new Blob([wavData], { type: 'audio/wav' });
            resolve(wavBlob);
        }
        } catch (error) {
        reject(error);
        }
    };
    reader.readAsArrayBuffer(audioBlob);
    });
};

// Function to check if the audio contains significant sound
containsSignificantAudio (audioBuffer:any, threshold:any = 0.3){
    const numOfChannels = audioBuffer.numberOfChannels;
    const channelData = [];

    for (let i = 0; i < numOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
    }

    // Check each sample in each channel for significant sound
    for (let i = 0; i < channelData[0].length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
        if (Math.abs(channelData[channel][i]) > threshold) {
        return true; // There is significant sound
        }
    }
    }

    return false; // No significant sound detected
};

// Function to convert audio buffer to WAV format
  bufferToWave(abuffer:any, len:any) {
    const numOfChannels = abuffer.numberOfChannels;
    const sampleRate = abuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16; // 16-bit PCM
    const byteRate = sampleRate * numOfChannels * (bitDepth / 8);
    const blockAlign = numOfChannels * (bitDepth / 8);
    const wavLength = 44 + len * blockAlign;
    const buffer = new ArrayBuffer(wavLength);
    const view = new DataView(buffer);

    // Write WAV header
    let offset = 0;
    const writeString = (str:any) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i) & 0xff);
        }
        offset += str.length;
    };

    // RIFF header
    writeString('RIFF');
    view.setUint32(offset, wavLength - 8, true); // file length
    offset += 4;
    writeString('WAVE'); // wave format

    // Format chunk
    writeString('fmt ');
    view.setUint32(offset, 16, true); // chunk length
    offset += 4;
    view.setUint16(offset, format, true); // format type
    offset += 2;
    view.setUint16(offset, numOfChannels, true); // channels
    offset += 2;
    view.setUint32(offset, sampleRate, true); // sample rate
    offset += 4;
    view.setUint32(offset, byteRate, true); // byte rate
    offset += 4;
    view.setUint16(offset, blockAlign, true); // block align
    offset += 2;
    view.setUint16(offset, bitDepth, true); // bits per sample
    offset += 2;

    writeString('data');
    view.setUint32(offset, len * blockAlign, true);
    offset += 4;

    for (let i = 0; i < len; i++) {
        for (let channel = 0; channel < numOfChannels; channel++) {
            const sample = abuffer.getChannelData(channel)[i];
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return view;
};

convertBlobToBase64 (blob:any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
    });
};

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
          );
          console.log('got listing data',this.listingData)
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
        } else {
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
      },
    });
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
