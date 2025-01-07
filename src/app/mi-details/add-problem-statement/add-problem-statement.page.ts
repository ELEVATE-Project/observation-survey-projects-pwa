import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { finalize } from 'rxjs';
import  urlConfig  from 'src/app/config/url.config.json'
import { GwApiService } from 'src/app/services/gw-api/gw-api.service';

@Component({
  selector: 'app-add-problem-statement',
  templateUrl: './add-problem-statement.page.html',
  styleUrls: ['./add-problem-statement.page.scss'],
})
export class AddProblemStatementPage implements OnInit {
  headerConfig:any = {
    showBackButton:true
  }
  showInput = false;
  projectTemplateId:any;
  showLoading:boolean = true;
  problemStatement: string = '';
  selectedOption: string = '';
  options :any[]=[];
  page = 1;
  limit = 15;
  count = 0;
  disableLoading: boolean = false
  isRadioDisabled: boolean = false;
  isAPrivateProgram:any=true;
  fromRecommendation = false
  recommendedTemplateId: any
  characterLimit = 200;
  constructor(private router: Router,
    private route:ActivatedRoute,
    private toastService :ToastService,
    private loader : LoaderService,
    private ProjectsApiService: ProjectsApiService,
    private gwApiService: GwApiService
  ) { 
      this.route.params.subscribe(param=>{
        this.projectTemplateId = param['id'];
      })
      this.route.queryParams.subscribe(param => {
        this.selectedOption = param["programId"] ? param["programId"] : ""
        this.recommendedTemplateId = param["templateId"]
        this.fromRecommendation = param["recommendation"] == "true"
      })
  }

  ngOnInit() {
    this.getProblemStatementList()
  }
  toggleInput() {
    this.showInput = !this.showInput;
    if (!this.showInput) {
      this.problemStatement = '';
      this.isRadioDisabled = false;
    }
  }
  isTextTooLong(option: any): boolean {
    return option?.name?.length > this.characterLimit;
  }

  toggleReadMore(optionId:any,event: Event) {
    event.stopPropagation();
    this.options=this.options.map((option:any)=>{
      if (option._id === optionId) {
        option.isExpanded = !option.isExpanded;
      }
      return option;
    })
  }

  onInputChange() {
    this.isRadioDisabled = this.problemStatement.trim().length > 0;
  }

  onRadioSelect(selectedValue: string) {
    this.selectedOption = this.selectedOption === selectedValue ? '' : selectedValue;
  }

  async getProblemStatementList($event?:any){
    this.showLoading = true;
    await this.loader.showLoading("LOADER_MSG");
    this.ProjectsApiService.post(urlConfig['miDetail'].problemStatementListingUrl+`?isAPrivateProgram=${this.isAPrivateProgram}&page=${this.page}&limit=${this.limit}`,{}).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
        this.showLoading = false;
      })
    ).subscribe((res:any)=>{
      if (res?.status == 200) {
        this.options = [
          ...this.options,
          ...(res?.result?.data|| [])?.map((option:any) => {
              return {
                ...option,
                isExpanded : this.isTextTooLong(option),
              }
            })
        ];
        this.disableLoading = !this.options.length || this.options.length == res.result.count;
      }
      if($event){
        $event.target.complete()
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }
  async addProject() {
    let config: any;
    if (this.problemStatement.trim()) {
      config = { programName: this.problemStatement };
    } else{
      config = { programId: this.selectedOption };
    }
    if (config) {
      try {
        this.showLoading = true;
        await this.loader.showLoading("LOADER_MSG");
        const res:any = await this.ProjectsApiService.post(`${urlConfig['miDetail']
          .startProjectUrl}${this.projectTemplateId}`,config
        ).toPromise();
        if (res?.status === 200) {
          this.router.navigate(['project-details'], {
            state: {
              _id: res.result._id,
              solutionId: res.result.solutionId,
            },
            replaceUrl: true
          });
        }
      } catch (err:any) {
        this.toastService.presentToast(err?.error?.message, 'danger');
      } finally {
        this.showLoading = false;
        await this.loader.dismissLoading();
      }
    }
  }

  isFormValid(): boolean {
    return this.problemStatement.trim().length > 0 || !!this.selectedOption;
  }

  loadData($event: any){
    this.page +=1
    this.getProblemStatementList($event)
  }

  ionViewWillLeave(){
    this.page = 1;
    this.limit = 15;
    this.count = 0;
  }

  async createProject(){
    await this.loader.showLoading("LOADER_MSG");
    let url = `${urlConfig.recommendation.startImpUrl}?id=${this.projectTemplateId}`
    let payload:any = {}
    if (this.problemStatement.trim()) {
      payload["programName"] = this.problemStatement.trim()
    }else{
      payload["programId"] = this.selectedOption
    }
    if(this.recommendedTemplateId){
      payload["projectTemplateId"] = this.recommendedTemplateId
    }
    this.gwApiService.post(url,payload).subscribe({
      next: async(response: any)=>{
        await this.loader.dismissLoading();
        this.router.navigate(['project-details'], {state: { _id: response.result._id || response.result.projectId, solutionId: response.result.solutionId || null },
          replaceUrl: true
        });
      },
      error: async(error:any)=>{
        await this.loader.dismissLoading();
        this.toastService.presentToast(error?.error?.message, 'danger')
      }
    })
  }

}