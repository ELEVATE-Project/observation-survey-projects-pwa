import {  Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import urlConfig from 'src/app/config/url.config.json';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { ToastService } from '../services/toast/toast.service';

@Component({
  selector: 'app-reflection',
  templateUrl: './reflection.page.html',
  styleUrls: ['./reflection.page.scss']
})
export class ReflectionPage implements OnInit, OnDestroy{
  headerConfig = {
    showBackButton:false,
  };
  reflectionPointsList = ["REFLECTION_POINT_ONE", "REFLECTION_POINT_TWO", "REFLECTION_POINT_THREE"]
  projectId:any
  redirectionTimeout: any;

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private projectApiService: ProjectsApiService,
    private toastService: ToastService
  ){
    this.activatedRoute.params.subscribe(param=>{
      this.projectId = param["id"]
    })
  }

  ngOnInit() {
    this.redirectionTimeout = setTimeout(() => {
      this.startReflection();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.redirectionTimeout) {
      clearTimeout(this.redirectionTimeout);
    }
  }

  doItLater(){
    this.location.back()
  }

  startReflection(){
    if (this.redirectionTimeout) {
      clearTimeout(this.redirectionTimeout);
    }
    let url = urlConfig.project.updateProject + this.projectId
    let payload = { reflectionStatus: "started" }
    this.projectApiService.post(url,payload).subscribe({
      next: (response: any) => {
        window.location.replace(`/mohini/voice-chat/?projectId=${this.projectId}`)
      },
      error: (error:any) => {
        this.toastService.presentToast(error?.error?.message, 'danger')
      }
    })
  }
}
