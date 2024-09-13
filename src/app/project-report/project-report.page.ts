import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { LoaderService } from '../services/loader/loader.service';
import urlConfig from 'src/app/config/url.config.json';
import { UrlConfig } from '../interfaces/main.interface';
import { finalize } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { UtilService } from '../services/util/util.service';
import { ShareLinkPopupComponent } from '../shared/share-link-popup/share-link-popupcomponent';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';


@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.page.html',
  styleUrls: ['./project-report.page.scss'],
})
export class ProjectReportPage implements OnInit {
  isFilter: boolean = false;
  loader: LoaderService;
  baseApiService: any;
  listType!: keyof UrlConfig;
  toastService: ToastService;
  reportData: any;
  reportType: string = "1";
  programId: string = "";
  isModalOpen = false;
  selectedProgram: string = "";
  programList: any;
  projectsCategories:any;
  backgroundColors = [
              'rgb(255, 99, 132)',
							'rgb(54, 162, 235)',
							'rgb(255, 206, 86)',
							'rgb(231, 233, 237)',
							'rgb(75, 192, 192)',
							'rgb(151, 187, 205)',
							'rgb(220, 220, 220)',
							'rgb(247, 70, 74)',
							'rgb(70, 191, 189)',
							'rgb(253, 180, 92)',
							'rgb(148, 159, 177)',
							'rgb(77, 83, 96)',
							'rgb(95, 101, 217)',
							'rgb(170, 95, 217)',
							'rgb(140, 48, 57)',
							'rgb(209, 6, 40)',
							'rgb(68, 128, 51)',
							'rgb(125, 128, 51)',
							'rgb(128, 84, 51)',
							'rgb(179, 139, 11)',
  ];
  downloadUrl: any;

  constructor(
    private navCtrl: NavController,
    private router: ActivatedRoute,
    private utilService: UtilService,
    private platform: Platform,
    private popoverController: PopoverController

  ) {
    this.loader = inject(LoaderService);
    this.baseApiService = inject(ProjectsApiService);
    this.toastService = inject(ToastService);
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
  }

  ngOnInit() {
    this.listType = 'report';
    this.getReportData(this.reportType);
     this.projectsCategories = [
      {
        name: 'Total Projects',
        img: '/assets/images/report-imgs/Note 1.svg',
        key: 'total',
      },
      {
        name: 'Projects Submitted',
        img: '/assets/images/report-imgs/note.svg',
        key: 'submitted',
      },
      {
        name: 'Projects In Progress',
        img: '/assets/images/report-imgs/Note 4.svg',
        key: 'inProgress',
      },
      {
        name: 'Projects Started',
        img: '/assets/images/report-imgs/Note 3.svg',
        key: 'started',
      },
    ];
    // this.getPrograms();
    setTimeout(() => {
      this.renderChart(this.reportData?.tasks, this.reportData?.categories);
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  getReportType(e: any) {
    this.reportType = e;
    this.getReportData(this.reportType);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async getReportData(reportType: string) {
    await this.loader.showLoading('Please wait while loading...');
      this.baseApiService.get(urlConfig[this.listType].listingUrl + `?reportType=${reportType}`)
        .pipe(finalize(async () => {
          await this.loader.dismissLoading();
        }))
        .subscribe((res: any) => {
          if (res?.status === 200) {
            if (res.result.dataAvailable) {
              this.reportData = res.result.data;
              this.renderChart(this.reportData.tasks, this.reportData.categories); // Update charts after data fetch
            } else {
              this.setOpen(true);
            }
          }
        }, (err: any) => {
          this.toastService.presentToast(err?.error?.message,'danger');
        });

  }

  async share() {
    await this.loader.showLoading('Preparing the report for sharing...');
    try {
      const res = await this.baseApiService.get(urlConfig[this.listType].listingUrl +`?requestPdf=true&reportType=${this.reportType}&programId=${this.programId}`).toPromise();
      if (res?.status === 200 && res.result) {
        this.downloadUrl = res.result.downloadUrl;
        await this.loader.dismissLoading();
        if (this.utilService.isMobile()) {
          try {
            const shareOptions = {
              title: 'Project Report',
              text: 'Check out this project report',
              url: this.downloadUrl
            };
            await Share.share(shareOptions);
          } catch (err:any) {
            this.toastService.presentToast(err?.error?.message, 'danger');
          }
        } else {
          this.setOpenForCopyLink();
        }
      } else {
        this.toastService.presentToast('Failed to fetch report data for sharing.', 'danger');
      }
    } catch (err:any) {
      this.toastService.presentToast(err?.error?.message,'danger');
    } finally {
      await this.loader.dismissLoading();
    }
  }


 async setOpenForCopyLink() {
     const popover = await this.popoverController.create({
      component: ShareLinkPopupComponent,
      componentProps: {
        data: {
          downloadUrl:this.downloadUrl
        }
      },
      cssClass: 'popup-class',
      backdropDismiss: true
    });
    await popover.present();
      popover.onDidDismiss().then((data)=>{
        if(data.data){
          Clipboard.write({ string: this.downloadUrl });
          this.toastService.presentToast('Link copied to clipboard', 'success');
        }
      })
  }

  getAction(event: any) {
    switch (event) {
      case 'download':
        this.download();
        break;
      case 'share':
        this.share();
        break;
    }
  }

  async download() {
    await this.loader.showLoading('Please wait while downloading...');
    this.baseApiService.get(urlConfig[this.listType].listingUrl + `?requestPdf=true&reportType=${this.reportType}&programId=${this.programId}`)
      .pipe(finalize(async () => {
        await this.loader.dismissLoading();
      }))
      .subscribe((res: any) => {
        if (res?.status === 200) {
            if (res.result) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
            const name = `report_${formattedDate}.pdf`;
            this.downloadFile(res.result.downloadUrl, name);
          }
          else{
            this.toastService.presentToast("Downloading failed !!", 'danger');
          }
        }
      },
      (err: any) => {
        this.toastService.presentToast(err?.error?.message, 'danger');
      })
  }

  renderChart(taskData: any, categoryData: any): void {
    const capitalizeAndSpaceKeys = (obj:any) => {
      return Object.keys(obj).reduce((acc:any, key) => {
        if (obj[key] !== 0) {
        const spacedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2');
        const capitalizedKey = spacedKey.charAt(0).toUpperCase() + spacedKey.slice(1);
        acc[capitalizedKey] = obj[key];
        }
        return acc;
      }, {});
    };

    const { total: taskTotal, ...filteredTaskData } = taskData || {};
    const { total: categoryTotal, ...filteredCategoryData } = categoryData || {};

    const capitalizedTaskData = capitalizeAndSpaceKeys(filteredTaskData);
    const capitalizedCategoryData = capitalizeAndSpaceKeys(filteredCategoryData);


    const dataForTask = {
      labels: Object.keys(capitalizedTaskData),
      datasets: [{
        data: Object.values(capitalizedTaskData),
        backgroundColor: this.backgroundColors,
        hoverOffset: 4
      }]
    };

    const dataForCategory = {
      labels: Object.keys(capitalizedCategoryData),
      datasets: [{
        data: Object.values(capitalizedCategoryData),
        backgroundColor: this.backgroundColors,
        hoverOffset: 4
      }]
    };

    const taskCanvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    const Categoriescanvas = document.getElementById('doughnutChartforcategory') as HTMLCanvasElement;
    if (taskCanvas) {
      const existingChart = Chart.getChart(taskCanvas);
      if (existingChart) {
        existingChart.destroy();
      }
      const ctx = taskCanvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: dataForTask,
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc: any, cur: any) => acc + cur, 0);
                  const percentage = (value / total * 100).toFixed(1) + '%';
                  return percentage;
                },
                color: '#fff',
                anchor: 'end',
                align: 'start',
                font: {
                  size: 8,
                },
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      }
    } else {
      console.error('Canvas element not found');
    }

    if (Categoriescanvas) {
      const existingChart2 = Chart.getChart(Categoriescanvas);
      if(        existingChart2) {
        existingChart2.destroy();
      }
      const ctx2 = Categoriescanvas.getContext('2d');
      if (ctx2) {
        new Chart(ctx2, {
          type: 'doughnut',
          data: dataForCategory,
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              },
              datalabels: {
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((acc: any, cur: any) => acc + cur, 0);
                  const percentage = (value / total * 100).toFixed(1) + '%';
                  return percentage;
                },
                color: '#fff',
                anchor: 'end',
                align: 'start',
                font: {
                  size: 8,
                },
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      }
    } else {
      console.error('Canvas element not found');
    }
  }

  getprogram(event: any) {
    this.programId = event.detail.value;
    this.getReportData(this.reportType);
  }

  downloadFile(url: any, name: string) {
    let fileName = name.length > 40 ? name.slice(0, 40) + '...' : name;
    fetch(url).then(resp => resp.blob()).then(blob => {
      const convertedUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = convertedUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(convertedUrl);
    });
  }
}