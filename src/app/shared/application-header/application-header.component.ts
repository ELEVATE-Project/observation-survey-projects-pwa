import { Component, OnInit ,Input, Output, EventEmitter, ContentChild, TemplateRef} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-application-header',
  templateUrl: './application-header.component.html',
  styleUrls: ['./application-header.component.scss'],
})
export class ApplicationHeaderComponent  implements OnInit {
  @ContentChild('search', { static: false })
  search!: TemplateRef<any>;
  @Input() config:any ={
    showBackButton: false,
    title:'',
    customActions: []
  };
  @Output() actionClick = new EventEmitter<string>();

  constructor(private location: Location) {
   }

  ngOnInit() {
  }

  onBackClick() {
    this.location.back(); 
  }

  onActionClick(actionName: string) {
    this.actionClick.emit(actionName);
  }

}
