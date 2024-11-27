import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent   {
  @Input() headerName:any;
  @Input() showViewmore:any;
  @Input() navigateUrl:any;
  constructor(private router:Router) { }

  navigate(){
  this.router.navigate([this.navigateUrl]);
  }

}
