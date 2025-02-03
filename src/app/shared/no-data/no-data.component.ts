import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent  {
  @Input() message:any;
  @Input() imgUrl:any;
  @Input() titleMessage:any;

  constructor() { }

}
