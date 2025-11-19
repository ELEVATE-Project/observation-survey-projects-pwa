import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SamikshaApiService } from '../services/samiksha-api/samiksha-api.service';
import urlConfig from 'src/app/config/url.config.json';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../services/toast/toast.service';

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
  constructor(private navCtrl: NavController, private samikshaAPpiService:SamikshaApiService, private router:ActivatedRoute, public toaster:ToastService) {}

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
    const mapAnswersToLabels = (answers: any[], optionsAvailable: any[]) => {
      return answers.map((answer: any) => {
        if (typeof answer === 'number') {
          return answer;
        }
  
        const trimmedAnswer = answer == null ? '' : answer.trim();
        if (trimmedAnswer === '') {
          return 'No response is available'; 
        }
  
        const option = optionsAvailable?.find((opt: { value: any }) => opt.value === trimmedAnswer);
        return option ? option.label : trimmedAnswer;
      });
    };
  
    const processInstanceQuestions = (instance: any) => {
      const processedInstance = { ...instance };
      for (const key in processedInstance) {
        if (key !== 'instanceIdentifier') {
          processedInstance[key].answers = mapAnswersToLabels(
            processedInstance[key].answers,
            processedInstance[key].optionsAvailableForUser
          );
          delete processedInstance[key].optionsAvailableForUser;
        }
      }
      return processedInstance;
    };
  
    return data.map((question) => {
      if (question.responseType === 'matrix' && question.instanceQuestions) {
        const processedInstanceQuestions = question.instanceQuestions.map(processInstanceQuestions);
        return { ...question, instanceQuestions: processedInstanceQuestions };
      } else {
        const processedQuestion = { ...question };
        processedQuestion.answers = mapAnswersToLabels(question.answers, question.optionsAvailableForUser);
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
  checkAnswerValue(answer: any): string | number {
    if (typeof answer === 'string') {
      return answer.trim() === '' ? 'NA' : answer;
    }
    return answer;
  }

  applyFilter(reset: boolean = false) {
    this.updateFilteredQuestions();
  
    const questionsToProcess = this.filteredQuestions.length > 0 ? this.filteredQuestions : this.allQuestions;
    this.reportDetails = this.processSurveyData(questionsToProcess);
  
    if (!reset && this.filteredQuestions.length === 0) {
      this.toaster.presentToast('Select at least one question', 'danger');
    }
  
    if (reset || this.filteredQuestions.length > 0) {
      this.closeFilter();
    }
  }
  
  resetFilter() {
    this.allQuestions.forEach(question => question.selected = false);
    this.filteredQuestions = [];
    this.applyFilter(true);
  }
  

  openUrl(url:string){
    window.open(url,'_blank')
  }
}
