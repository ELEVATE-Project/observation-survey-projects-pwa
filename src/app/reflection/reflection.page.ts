import {  Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reflection',
  templateUrl: './reflection.page.html',
  styleUrls: ['./reflection.page.scss']
})
export class ReflectionPage  implements OnInit {
  headerConfig = {
    showBackButton:false,
  };
  reflectionPointsList = ["REFLECTION_POINT_ONE", "REFLECTION_POINT_TWO", "REFLECTION_POINT_THREE"]
  projectId:any

  constructor(private location: Location, private router: Router, private activatedRoute: ActivatedRoute){
    this.activatedRoute.queryParams.subscribe(param=>{
      this.projectId = param["id"]
    })
  }

  ngOnInit(){}

  doItLater(){
    this.location.back()
  }

  startReflection(){
    window.location.href = `/mohini/voice-chat/?projectId=${this.projectId}`
  }
}
