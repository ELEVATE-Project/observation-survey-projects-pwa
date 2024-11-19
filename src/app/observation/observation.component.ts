import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { isDeactivatable } from './../services/guard/guard.service';
import { environment } from 'src/environments/environment';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationComponent implements OnInit, isDeactivatable {
  apiConfig: any = {};
  isDirty: boolean = false;
  saveQuestioner: boolean = false;
  showDetails = false;

  constructor(private navCtrl: NavController, private profileService: ProfileService,
    private utils: UtilService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getProfileDetails();
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'formDirty') {
        this.isDirty = event.data.isDirty;
      }
    });
  }

  ionViewWillLeave() {
    if (this.alertService.alert) {
      this.alertService.dismissAlert();
    }
  }

  async canPageLeave(event?: any): Promise<boolean> {
    if (this.alertService.alert) {
      this.alertService.dismissAlert();
    }
    if (this.isDirty && !this.saveQuestioner) {
      await this.alertService.presentAlert(
        'SAVE_DATA',
        'EXIT_CONFIRMATION_MSG',
        [
          {
            text: "DON'T_SAVE",
            cssClass: 'secondary-button',
            role: 'exit',
            handler: () => {
              if (event) {
                this.isDirty = false;
                this.navCtrl.back();
              }
              return true;
            }
          },
          {
            text: 'SAVE',
            cssClass: 'primary-button',
            role: 'exit',
            handler: () => {
              this.saveQuestioner = true;
              if (event) {
                this.navCtrl.back();
              }
              return true;
            }
          }
        ]
      );

      let data = await this.alertService.alert.onDidDismiss();
      if (data.role == 'exit') {
        return true;
      }
      return false;
    }
    else {
      if (event) {
        this.navCtrl.back();
        return false;
      } else {
        return true;
      }
    }
  }

  getProfileDetails() {
    if (!this.utils.isLoggedIn()) {
      this.showDetails = true
      return
    }
    this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
      if (mappedIds) {
        this.apiConfig['profileData'] = mappedIds;
        this.apiConfig['baseURL'] = environment.surveyBaseURL ?? environment.baseURL;
        this.apiConfig['userAuthToken'] = localStorage.getItem('accToken');
        this.apiConfig['solutionType'] = "observation";
        this.apiConfig['fileSizeLimit'] = 50;
      } else {
        history.replaceState(null, '', '/');
        this.navCtrl.back()
      }
      this.showDetails = true
    });
  }
}