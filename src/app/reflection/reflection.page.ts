import {  Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

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

  constructor(private location: Location){}

  ngOnInit(){}

  doItLater(){
    this.location.back()
  }
}
