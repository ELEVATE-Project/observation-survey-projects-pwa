import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import  urlConfig  from 'src/app/config/url.config.json'
import { GwApiService } from 'src/app/services/gw-api/gw-api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recommendation-details',
  templateUrl: './recommendation-details.page.html',
  styleUrls: ['../mi-details.page.scss'],
})
export class RecommendationDetailsPage implements OnInit {
  headerConfig:any = {
    showBackButton:true,
    customActions: [{ icon: 'bookmark-outline', actionName: 'save' }]
  }
  projectDetails:any
  recommendationId:any;
  showLoading:boolean = true;
  saved:boolean=false;
  constructor(private router: Router,
    private route : ActivatedRoute,
    private toastService :ToastService,
    private loader : LoaderService,
    private gwApiService: GwApiService
  ) {
    this.route.params.subscribe(param=>{
      this.recommendationId = param['id'];
    })
  }

  ngOnInit() {
    this.getProjectDetails()
  }
  isFileType(fileUrl: string, type: 'image' | 'pdf' | 'doc' | 'video'): boolean {
    const regexMap: { [key in 'image' | 'pdf' | 'doc' | 'video']: RegExp } = {
      image: /\.(jpeg|jpg|gif|png|svg|webp)$/i,
      pdf: /\.pdf$/i,
      doc: /\.(docx?|odt)$/i,
      video: /\.(mp4|mov|avi)$/i,
    };

    return regexMap[type].test(fileUrl);
  }

  async getProjectDetails(){
    await this.loader.showLoading("LOADER_MSG");
    this.gwApiService.get(urlConfig['recommendation'].detailsUrl+`?id=${this.recommendationId}`).subscribe({
      next: async(response: any) => {
        await this.loader.dismissLoading();
        if (response) {
          this.projectDetails = response
          this.formatData()
        }
      },
      error: async(error:any) => {
        await this.loader.dismissLoading();
        this.toastService.presentToast(error?.error?.message, 'danger')
      }
    })
  }

  formatData(){
    this.projectDetails.title = this.projectDetails.actual_title || this.projectDetails.expected_title
    this.projectDetails.problemStatement = this.projectDetails.actual_problem_statement || this.projectDetails.expected_problem_statement
    this.projectDetails.author = this.projectDetails?.other_params?.template_author
    this.projectDetails.impact = this.projectDetails?.other_params?.impact
    this.projectDetails.text = this.projectDetails?.other_params?.text || []
    this.projectDetails.description = this.projectDetails.description || this.projectDetails.actual_objective || this.projectDetails.expected_objective
    this.saved = this.projectDetails.wishlist;
    this.headerConfig.customActions = [{ icon: this.saved ? 'bookmark' : 'bookmark-outline', actionName: 'save' }];
  }

  starImprovement(){
    this.router.navigate(['/mi-details/add-problem-statement',this.projectDetails.id],
      {queryParams: { programId: this.projectDetails.program_id, templateId: this.projectDetails.template_id, recommendation: true }});
  }

  saveClick(event:any){
    this.handleSaved(this.saved ? false : true)
  }

  async handleSaved(actionType: boolean){
    const url = urlConfig.recommendation.wishlist;
    this.showLoading = true;
    await this.loader.showLoading("LOADER_MSG");
    this.gwApiService.post(url,{id:this.recommendationId, in_wishlist:actionType}).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
        this.showLoading = false;
      })
    ).subscribe((res:any)=>{
      if (res?.status == 200) {
        this.saved = actionType
        this.headerConfig.customActions = [{ icon: this.saved ? 'bookmark' : 'bookmark-outline', actionName: 'save' }];
        this.toastService.presentToast(res.message, 'success');
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }
}