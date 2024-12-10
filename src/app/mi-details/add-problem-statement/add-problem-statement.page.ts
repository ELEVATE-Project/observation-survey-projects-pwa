import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { finalize } from 'rxjs';
import  urlConfig  from 'src/app/config/url.config.json'

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
  options :any;
  isRadioDisabled: boolean = false;
  isActivatedProgram:any=true;
  constructor(private router: Router,
    private route:ActivatedRoute,
    private toastService :ToastService,
    private loader : LoaderService,
    private ProjectsApiService: ProjectsApiService
  ) { 
      this.route.params.subscribe(param=>{
        this.projectTemplateId = param['id'];
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
  onInputChange() {
    this.isRadioDisabled = this.problemStatement.trim().length > 0;
  }

  onRadioSelect(selectedValue: string) {
    this.selectedOption = this.selectedOption === selectedValue ? '' : selectedValue;
  }

  async getProblemStatementList(){
    this.showLoading = true;
    await this.loader.showLoading("LOADER_MSG");
    this.ProjectsApiService.post(urlConfig['miDetail'].problemStatementListingUrl+`?isAPrivateProgram=${this.isActivatedProgram}&language=`,{}).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
        this.showLoading = false;
      })
    ).subscribe((res:any)=>{
      if (res?.status == 200) {
        this.options=res.result
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

}