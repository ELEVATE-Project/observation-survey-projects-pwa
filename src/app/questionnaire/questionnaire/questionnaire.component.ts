import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { isDeactivatable } from '../../services/guard/guard.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionnaireComponent implements OnInit, isDeactivatable {
  apiConfig: any = {};
  isDirty: boolean = false;
  saveQuestioner: boolean = false;
  constructor(private navCtrl: NavController, private router: ActivatedRoute,
    private alertService: AlertService, private location: Location) { }

  ngOnInit() {
    this.router.params.subscribe(param => {
      this.apiConfig['solutionId'] = param['id']
      this.apiConfig['baseURL'] = environment.surveyBaseURL ?? environment.baseURL;
      this.apiConfig['userAuthToken'] = localStorage.getItem('accToken');
      this.apiConfig['solutionType'] = 'survey';
      this.apiConfig['fileSizeLimit'] = 50;
    })

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

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: any) {
  //   if (this.isDirty) {
  //     event.preventDefault();
  //     this.location.go(this.location.path());
  //   }
  // }

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

      // const cancelButton = document.createElement('button');
      // cancelButton.textContent = 'X';
      // cancelButton.classList.add('cancel-button');
      // cancelButton.onclick = () => {
      //   this.alertService.dismissAlert();
      // };

      // const alertHeader = document.querySelector('ion-alert .alert-head');
      // if (alertHeader) {
      //   alertHeader.appendChild(cancelButton);
      // }

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
}
