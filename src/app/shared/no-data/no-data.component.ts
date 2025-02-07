import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit{
  @Input() message:any;
  imagePath:any;

  constructor() { }

  ngOnInit() {
    switch(this.message?.imageType){      
      case 'search':
        this.imagePath = "assets/MI-2.0-card-images/no-search-results.svg"
        break;
      
      default:
        this.imagePath = 'assets/MI-2.0-card-images/no-data-found.svg'
        break;
    }
  }

}
