import { Component, OnInit, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiBaseService } from 'src/app/services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json'
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library-categories-list',
  templateUrl: './library-categories-list.component.html',
  styleUrls: ['./library-categories-list.component.scss'],
})
export class LibraryCategoriesListComponent  implements OnInit {
  apiService:any
  categoriesList:any = []

  constructor(private navCtrl: NavController, private toastService: ToastService, private router: Router) {
    this.apiService = inject(ApiBaseService)
  }

  ngOnInit() {
    this.getCategoriesList()
  }

  getCategoriesList(){
    this.apiService.get(urlConfig.project.categoriesList).subscribe((response:any)=>{
      this.categoriesList = response.result
    },(error:any)=>{
      this.toastService.presentToast(error.error.message,"danger")
    })
  }

  navigate(category:any){
    this.router.navigate(['project-library',category.externalId],{ state: category })
  }

  goBack() {
    this.navCtrl.back();
  }

}
