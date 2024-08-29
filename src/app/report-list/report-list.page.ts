import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UrlConfig } from '../interfaces/main.interface';
import { ProfileService } from '../services/profile/profile.service';
import { ToastService } from '../services/toast/toast.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.page.html',
  styleUrls: ['./report-list.page.scss'],
})
export class ReportListPage implements OnInit {
  stateData: any;
  listType!: keyof UrlConfig;

  constructor(private navCtrl: NavController,private router:Router,private profileService:ProfileService, private toastService:ToastService
  ) { }

  ngOnInit() {
    this.profileService.getFormListing().subscribe({
      next: (res: any) => {
        if (res?.status === 200 && res?.result) {
          const result = res.result.data;
          let solutionList = result.find((item: any) => item.type === 'solutionList');
          solutionList = {
            "type": "solutionList",
            "listingData": [
                {
                    "name": "Projects",
                    "img": "assets/images/ic_project.svg",
                    "redirectionUrl": "/listing/project",
                    "listType": "project",
                    "solutionType":"improvementProject",
                    "reportPage":false,
                    "description": "Manage and track your school improvement easily, by creating tasks and planning project timelines"
                },
                {
                  "name": "Survey",
                  "img": "assets/images/ic_survey.svg",
                  "redirectionUrl": "/listing/survey",
                  "listType": "survey",
                  "solutionType":"survey",
                  "reportPage":false,
                  "reportIdentifier":"surveyReportPage",
                  "description": "Provide information and feedback through quick and easy surveys"
              },
                {
                    "name": "Reports",
                    "img": "assets/images/ic_report.svg",
                    "redirectionUrl": "/list/report",
                    "listType": "report",
                    "reportPage":true,
                    "description": "Make sense of data to enable your decision-making based on your programs with ease",
                    "list":[
                      {
                        "name": "Improvement Project Reports",
                        "img": "assets/images/ic_project.svg",
                        "redirectionUrl": "/project-report",
                        "listType": "project",
                        "solutionType":"improvementProject",
                        "reportPage":false,
                        "description": "Manage and track your school improvement easily, by creating tasks and planning project timelines"
                    },
                    {
                      "name": "Survey Reports",
                      "img": "assets/images/ic_survey.svg",
                      "redirectionUrl": "/listing/survey-report",
                      "listType": "survey",
                      "solutionType":"survey",
                      "reportPage":true,
                      "reportIdentifier":"surveyReportPage",
                      "description": "Provide information and feedback through quick and easy surveys"
                  }
                    ]
                }
            ]
        }
          if (solutionList) {
            this.stateData = solutionList.listingData.find((data: any) =>{
              if(data.listType === 'report'){
                return data.list
              }
            });
          }
        }
      },
      error: (err: any) => {
        this.toastService.presentToast(err?.error?.message, 'danger');
      }
    }
    );
  
  }

  
  navigateTo(data: any) {
    this.router.navigate([data?.redirectionUrl], { state: data });
  }

  goBack() {
    this.navCtrl.back();
  }
}
