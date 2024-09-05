import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SamikshaApiService } from '../services/samiksha-api/samiksha-api.service';
import urlConfig from 'src/app/config/url.config.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generic-report',
  templateUrl: './generic-report.component.html',
  styleUrls: ['./generic-report.component.scss'],
})
export class GenericReportComponent implements OnInit {
  reportDetails!: any;
  objectURL: any;
  objectType!: string;
  isModalOpen: boolean = false;
  isFilterModalOpen: boolean = false;
  filteredQuestions: any[] = [];
  allQuestions: any[] = [];
  surveyName!: string;
  objectKeys = Object.keys;
  submissionId: any;
  constructor(private navCtrl: NavController, private samikshaAPpiService:SamikshaApiService, private router:ActivatedRoute) {}

  ngOnInit() {
    this.router.params.subscribe(param => {
      this.submissionId = param['id'];
      this.samikshaAPpiService.post(urlConfig.survey.reportUrl+this.submissionId,{})
      .subscribe((res:any) => {
        this.surveyName = res.message.surveyName
        this.allQuestions = res.message.report;
        this.reportDetails = this.processSurveyData(res.message.report);
      })
    })
  
  }

  processSurveyData(data: any[]): any[] {
    return data.map((question) => {
      if (question.responseType === 'matrix' && question.instanceQuestions) {
        const processedInstanceQuestions = question.instanceQuestions.map(
          (instance: any) => {
            const processedInstance = { ...instance };
            for (const key in processedInstance) {
              if (key !== 'instanceIdentifier') {
                processedInstance[key].answers = processedInstance[key].answers.map(
                  (answer: any) => {
                    const option = processedInstance[key].optionsAvailableForUser?.find(
                      (opt: { value: any }) => opt.value === answer
                    );
                    return option ? option.label : answer === '' ? 'NA' : answer;
                  }
                );
                delete processedInstance[key].optionsAvailableForUser;
              }
            }
            return processedInstance;
          }
        );
        return { ...question, instanceQuestions: processedInstanceQuestions };
      } else {
        const processedQuestion = { ...question };
        processedQuestion.answers = question.answers.map((answer: any) => {
          const option = question.optionsAvailableForUser?.find(
            (opt: { value: any }) => opt.value === answer
          );
          return option ? option.label : answer === '' ? 'NA' : answer;
        });
        delete processedQuestion.optionsAvailableForUser;
        return processedQuestion;
      }
    });
  }
  

  openDialog(url: string, type: string) {
    this.objectURL = url;
    this.objectType = type;
    this.isModalOpen = true;
  }

  closeDialog() {
    this.isModalOpen = false;
  }

  openFilter() {
    this.isFilterModalOpen = true;
  }

  closeFilter() {
    this.isFilterModalOpen = false;
  }

  updateFilteredQuestions() {
    this.filteredQuestions = this.allQuestions.filter(question => question.selected);
  }

  applyFilter() {
    this.updateFilteredQuestions();
    if (this.filteredQuestions.length > 0) {
      this.reportDetails = this.processSurveyData(this.filteredQuestions);
    } else {
      this.reportDetails = this.processSurveyData(this.allQuestions);
    }
    this.closeFilter();
  }

  resetFilter() {
    this.allQuestions.forEach(question => question.selected = false);
    this.filteredQuestions = [];
    this.applyFilter();
  }

  goBack() {
    this.navCtrl.back();
  }

  openUrl(url:string){
    window.open(url,'_blank')
  }
}
