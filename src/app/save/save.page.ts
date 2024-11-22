import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save',
  templateUrl: './save.page.html',
  styleUrls: ['./save.page.scss'],
})
export class SavePage implements OnInit {
  headerConfig: any = {
    title: "Saved",
    showBackButton:true
  };
  constructor() { }

  ngOnInit() {
  }

}
