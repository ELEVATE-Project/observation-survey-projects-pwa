import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  solutionList: any;
  baseApiService: any;
  loader: LoaderService;
  solutionId!: string;
  listType!: keyof UrlConfig;
  searchTerm: any = "";
  toastService: ToastService;
  stateData: any;
  page: number = 1

  constructor(private http: HttpClient, private navCtrl: NavController, private router: Router) {
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.stateData = navigation.extras.state;
      this.listType = this.stateData?.listType;
      this.getListData();
    }
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.getListData();
  }

  getListData() {
    this.loader.showLoading("Please wait while loading...");

    this.baseApiService
      .post(
        urlConfig[this.listType].listingUrl + `?type=improvementProject&page=${this.page}&limit=10&filter=&search=${this.searchTerm}`, environment?.entityData)
        .pipe(
          finalize(() => {
            this.loader.dismissLoading();
          })
        )
      .subscribe((res: any) => {
        if (res?.message =="Successfully targeted solutions fetched") {
          this.solutionList = res?.result
        } else {
          this.toastService.presentToast(res?.message);
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message);
        }
      );
  }

  loadData() {
    this.page = this.page + 1;
    this.getListData();
  }

  goBack() {
    this.navCtrl.back();
  }

  navigateToProject(data:any){
    this.router.navigate(['project-details'], { state: data });
  }
}