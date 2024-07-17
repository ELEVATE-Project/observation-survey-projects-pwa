import { Component, OnInit, ViewChild } from '@angular/core';
import { MainFormComponent } from 'dynamic-form-farhan'
import { sampleData } from './add-project.spec.data';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.page.html',
  styleUrls: ['./add-project.page.scss'],
})
export class AddProjectPage implements OnInit {
  @ViewChild('formLib') formLib: MainFormComponent | undefined
  data: any;

  constructor(private navCtrl: NavController,private router:ActivatedRoute) { }

  ngOnInit() {
     this.data = sampleData;
     console.log(this.router,"checking the route");
  }

  submitData(){
    console.log('Form value: ',this.formLib?.myForm.value)
    this.formLib?.myForm.reset();
  }

  goBack() {
    this.navCtrl.back();
  }

}
